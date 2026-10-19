import { DatabaseSync } from 'node:sqlite';
import { constants } from 'node:fs';
import { open } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { decodeUpload } from './images.mjs';
import { mediaIds } from './validation.mjs';
import { mediaConfigFromEnv, mediaObjectKey, MEDIA_CACHE_CONTROL, MEDIA_URL_TTL_SECONDS } from './media-store.mjs';

export class MigrationError extends Error {}
const stop = message => { throw new MigrationError(message); };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export function readMediaRecords(dataDir) {
  let db, records, publicIds;
  try {
    // Do not call openStore: migrations must never initialize or change the DB.
    db = new DatabaseSync(join(dataDir, 'portal.sqlite'), { readOnly: true });
    db.exec('BEGIN');
    records = db.prepare("SELECT id,mime,size FROM uploads UNION ALL SELECT id,mime,size FROM registration_uploads ORDER BY id").all();
    publicIds = new Set();
    for (const row of db.prepare('SELECT profile FROM people_profiles JOIN users ON users.id=people_profiles.user_id WHERE users.disabled=0').all()) {
      const profile = JSON.parse(row.profile);
      for (const url of [profile.idPhoto, profile.lifePhoto]) {
        if (typeof url !== 'string' || !url.startsWith('/api/media/')) stop('Published profile media is invalid.');
        const id = url.slice('/api/media/'.length); mediaObjectKey(id); publicIds.add(id);
      }
    }
    for (const row of db.prepare('SELECT snapshot FROM published').all()) {
      for (const id of mediaIds(JSON.parse(row.snapshot).data)) { mediaObjectKey(id); publicIds.add(id); }
    }
    db.exec('COMMIT');
  } catch (error) {
    if (error instanceof MigrationError) throw error;
    stop('The media database cannot be read or contains invalid records.');
  } finally { db?.close(); }
  const seen = new Set();
  for (const record of records) {
    let key;
    try { key = mediaObjectKey(record.id); } catch { stop('The media database contains an invalid image identity.'); }
    if (seen.has(record.id)) stop(`Duplicate media identity: ${record.id}.`);
    seen.add(record.id);
    if (!Number.isSafeInteger(record.size) || record.size <= 0 || record.size > 8 * 1024 * 1024) stop(`Invalid recorded image size: ${record.id}.`);
    record.key = key;
    record.public = publicIds.has(record.id);
  }
  return records;
}

export async function readMediaImage(dataDir, record) {
  let file, bytes;
  try {
    file = await open(join(dataDir, 'uploads', record.id), constants.O_RDONLY | constants.O_NOFOLLOW);
    const stat = await file.stat();
    if (!stat.isFile() || stat.size !== record.size) stop(`Local image size mismatch: ${record.id}.`);
    bytes = await file.readFile();
  } catch (error) {
    if (error instanceof MigrationError) throw error;
    stop(`Local image cannot be read: ${record.id}.`);
  } finally { await file?.close(); }
  if (bytes.length !== record.size) stop(`Local image changed during validation: ${record.id}.`);
  let decoded;
  try { decoded = decodeUpload(bytes.toString('base64')); } catch { stop(`Local image content is invalid: ${record.id}.`); }
  if (decoded.mime !== record.mime) stop(`Local image MIME mismatch: ${record.id}.`);
  return { ...record, bytes, sha256: hash(bytes) };
}

export async function inspectMediaInventory(dataDir) {
  const inventory = [];
  for (const record of readMediaRecords(dataDir)) inventory.push(await readMediaImage(dataDir, record));
  return inventory;
}

export async function anonymousCosStatus(config, key) {
  try {
    // An unsigned direct-origin request, with no browser session involved.
    const response = await fetch(`https://${config.bucket}.cos.${config.region}.myqcloud.com/${key}`, {
      method: 'GET', redirect: 'manual', credentials: 'omit', headers: { Range: 'bytes=0-0' }, signal: AbortSignal.timeout(10000),
    });
    await response.body?.cancel();
    return response.status;
  } catch { stop('The anonymous COS access check could not be completed.'); }
}

export async function migrateMedia({ dataDir, apply = false, probeId, verifyDownloads = false, env = process.env, cosClient, anonymousStatus = anonymousCosStatus, fetchSigned = fetch, onProgress = () => {} }) {
  // Hold validated bytes in memory so a later local edit cannot change the upload.
  const inventory = await inspectMediaInventory(resolve(dataDir));
  const probe = probeId ? inventory.find(item => item.id === probeId && item.public) : inventory.find(item => item.public);
  if (probeId && !probe) stop('The probe must be an existing, currently public image.');
  const summary = { mode: apply ? 'apply' : 'dry-run', objects: inventory.length, totalBytes: inventory.reduce((total, item) => total + item.size, 0),
    publicObjects: inventory.filter(item => item.public).length, privateObjects: inventory.filter(item => !item.public).length, probeId: probe?.id ?? null,
    uploaded: 0, reused: 0, verifiedDownloads: 0 };
  if (!apply || !inventory.length) return summary;
  if (!probe) stop('A currently public image is required to verify private ACLs before migrating unpublished media.');
  let config;
  try { config = mediaConfigFromEnv(env); } catch { stop('COS environment configuration is incomplete or invalid.'); }
  if (config.mode !== 'cos') stop('Apply requires PORTAL_MEDIA_STORAGE=cos in the server environment.');
  let cos = cosClient;
  if (!cos) {
    try {
      const { default: COS } = await import('cos-nodejs-sdk-v5');
      cos = new COS({ SecretId: config.secretId, SecretKey: config.secretKey, ...(config.securityToken ? { SecurityToken: config.securityToken } : {}), Protocol: 'https:', Timeout: 30000, UploadCheckContentMd5: true });
    } catch { stop('The COS SDK could not be initialized.'); }
  }
  const bucket = { Bucket: config.bucket, Region: config.region };
  const parameters = item => ({ ...bucket, Key: item.key });
  let versioning;
  try { versioning = await cos.getBucketVersioning(bucket); } catch { stop('COS bucket versioning could not be verified.'); }
  // Forbid-overwrite is not reliable on enabled or suspended versioned buckets.
  // https://cloud.tencent.com/document/product/436/7749
  if (!versioning?.VersioningConfiguration || versioning.VersioningConfiguration.Status) stop('Migration requires a bucket that has never enabled versioning; no writes were attempted.');
  async function head(item, allowMissing = false) {
    try { return await cos.headObject(parameters(item)); }
    catch (error) {
      if (allowMissing && error?.statusCode === 404) return null;
      stop(`COS object metadata could not be read: ${item.id}.`);
    }
  }
  function validateHead(item, result) {
    const headers = Object.fromEntries(Object.entries(result?.headers ?? {}).map(([name, value]) => [name.toLowerCase(), value]));
    if (Number(headers['content-length']) !== item.size || headers['x-cos-meta-sha256'] !== item.sha256 || headers['content-type'] !== item.mime) {
      stop(`COS object conflicts with the local image; refusing to overwrite: ${item.id}.`);
    }
  }
  const existing = new Set();
  // Detect every pre-existing conflict before writing even the public probe.
  for (const item of inventory) {
    const result = await head(item, true);
    if (result) { validateHead(item, result); existing.add(item.id); }
  }
  async function verify(item) {
    validateHead(item, await head(item));
    let status;
    try { status = await anonymousStatus(config, item.key); } catch { stop(`Anonymous COS protection could not be verified: ${item.id}.`); }
    if (status !== 403) stop(`Anonymous COS access was not denied with 403; migration stopped: ${item.id}.`);
    if (verifyDownloads) {
      let result;
      try { result = await cos.getObject(parameters(item)); } catch { stop(`Private COS download verification failed: ${item.id}.`); }
      if (!Buffer.isBuffer(result?.Body) || result.Body.length !== item.size || hash(result.Body) !== item.sha256) stop(`Private COS download checksum mismatch: ${item.id}.`);
      let response, downloaded;
      try {
        const signed = await new Promise((resolve, reject) => {
          cos.getObjectUrl({ ...parameters(item), Protocol: 'https:', Sign: true, Expires: MEDIA_URL_TTL_SECONDS }, (error, data) => error ? reject(error) : resolve(data.Url));
        });
        const url = new URL(signed);
        if (url.protocol !== 'https:' || url.host !== `${config.bucket}.cos.${config.region}.myqcloud.com` || url.pathname !== `/${item.key}` || !url.searchParams.has('q-signature')) throw new Error('Unexpected signed URL');
        response = await fetchSigned(signed, { redirect: 'manual', credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(30000) });
        if (response.status !== 200 || response.headers.get('content-type')?.split(';')[0] !== item.mime) throw new Error('Unexpected signed response');
        downloaded = Buffer.from(await response.arrayBuffer());
      } catch {
        await response?.body?.cancel().catch(() => {});
        stop(`Signed COS URL verification failed: ${item.id}.`);
      }
      if (downloaded.length !== item.size || hash(downloaded) !== item.sha256) stop(`Signed COS URL checksum mismatch: ${item.id}.`);
      summary.verifiedDownloads++;
    }
  }
  async function migrate(item) {
    if (existing.has(item.id)) summary.reused++;
    else {
      try {
        await cos.putObject({ ...parameters(item), Body: item.bytes, ContentLength: item.size, ContentType: item.mime,
          ContentDisposition: 'inline', CacheControl: MEDIA_CACHE_CONTROL, ACL: 'private',
          Headers: { 'x-cos-meta-sha256': item.sha256, 'x-cos-forbid-overwrite': 'true' },
        });
        summary.uploaded++;
      } catch {
        // Never delete after uncertain outcomes. A rerun verifies and reuses any
        // successfully written object; the DB and local copy are untouched.
        stop(`COS upload did not complete; rerun after checking connectivity: ${item.id}.`);
      }
    }
    await verify(item);
    onProgress({ id: item.id, result: existing.has(item.id) ? 'reused' : 'uploaded', privateAccessVerified: true });
  }
  await migrate(probe);
  for (const item of inventory) if (item.id !== probe.id) await migrate(item);
  return summary;
}

export function parseMigrationArgs(argv, env = process.env) {
  const args = { dataDir: env.PORTAL_DATA_DIR, apply: false, verifyDownloads: false };
  let explicitDryRun = false;
  for (let index = 0; index < argv.length; index++) {
    const option = argv[index];
    if (option === '--apply') args.apply = true;
    else if (option === '--dry-run') explicitDryRun = true;
    else if (option === '--verify-downloads') args.verifyDownloads = true;
    else if (option === '--help') args.help = true;
    else if (['--data-dir', '--probe-id'].includes(option)) {
      const value = argv[++index];
      if (!value || value.startsWith('--')) stop('A migration option is missing its value.');
      args[option === '--data-dir' ? 'dataDir' : 'probeId'] = value;
    } else stop('Unrecognized migration argument. Credentials must be supplied through the server environment.');
  }
  if (args.apply && explicitDryRun) stop('Choose either --apply or --dry-run.');
  if (!args.help && !args.dataDir) stop('Set PORTAL_DATA_DIR or provide --data-dir.');
  return args;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = parseMigrationArgs(process.argv.slice(2));
    if (args.help) console.log('Usage: node --env-file=/etc/fearlab/media.env server/migrate-media.mjs [--data-dir PATH] [--dry-run | --apply] [--probe-id PUBLIC_UUID] [--verify-downloads]\nDefault: dry-run. No database changes, source removals, cloud deletions, or overwrites.');
    else console.log(JSON.stringify(await migrateMedia({ ...args, onProgress: progress => console.log(JSON.stringify(progress)) })));
  } catch (error) {
    // SDK errors may contain signed URLs and credential material. Never print them.
    console.error(error instanceof MigrationError ? error.message : 'Media migration failed; no source files or database records were modified.');
    process.exitCode = 1;
  }
}
