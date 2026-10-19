import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { imageMime, STATIC_IMAGE_PREFIX } from './image-assets.mjs';

function inside(root, path) {
  const value = relative(root, path);
  return value && value !== '..' && !value.startsWith(`..${sep}`) && !isAbsolute(value);
}

async function prepare(manifest, root, distOnly) {
  if (manifest?.version !== 1 || !Array.isArray(manifest.images) || manifest.roots?.source !== 'assets' || typeof manifest.roots?.build !== 'string') throw new Error('Invalid static image manifest.');
  const base = await realpath(root), objects = new Map();
  const buildRoot = resolve(base, manifest.roots.build);
  if (!inside(base, buildRoot)) throw new Error('Invalid manifest build root.');
  for (const image of manifest.images) {
    if (!['source', 'build'].includes(image.kind)) throw new Error('Invalid manifest image kind.');
    if (distOnly && image.kind !== 'build') continue;
    if (typeof image.path !== 'string' || isAbsolute(image.path) || image.path.includes('\\') || typeof image.mime !== 'string' || !image.mime.startsWith('image/') || !/^[a-f0-9]{64}$/.test(image.sha256) || !Number.isSafeInteger(image.size) || image.size <= 0) throw new Error('Invalid manifest image.');
    const file = await realpath(resolve(base, image.path));
    const expectedRoot = image.kind === 'source' ? resolve(base, 'assets') : buildRoot;
    if (!inside(expectedRoot, file) || imageMime(file) !== image.mime) throw new Error('Image path or MIME is inconsistent with the manifest.');
    const expectedKey = STATIC_IMAGE_PREFIX + (image.kind === 'source' ? `archives/${image.sha256}.blob` : relative(buildRoot, file).split(sep).join('/'));
    if (image.objectKey !== expectedKey || image.kind === 'build' && (!expectedKey.startsWith(`${STATIC_IMAGE_PREFIX}assets/`) || !imageMime(expectedKey))) throw new Error('Invalid image object key.');
    const bytes = await readFile(file);
    if (bytes.length !== image.size || createHash('sha256').update(bytes).digest('hex') !== image.sha256) throw new Error(`Local image changed; rebuild the manifest: ${image.path}`);
    const existing = objects.get(image.objectKey);
    if (existing && (existing.sha256 !== image.sha256 || existing.size !== image.size)) throw new Error('Conflicting object keys in the image manifest.');
    objects.set(image.objectKey, { ...image, bytes });
  }
  return [...objects.values()];
}

const headers = head => Object.fromEntries(Object.entries(head.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
function matches(head, image) {
  const values = headers(head);
  return Number(values['content-length']) === image.size && values['x-cos-meta-sha256'] === image.sha256;
}

async function headOrMissing(client, parameters) {
  try { return await client.headObject(parameters); }
  catch (error) {
    if (error.statusCode === 404) return null;
    throw new Error('COS HEAD failed; no object was overwritten.');
  }
}

function expectedAcl(image) { return image.kind === 'build' ? 'public-read' : 'private'; }

function aclMatches(result, expected) {
  if (result.ACL !== expected || !result.Owner?.ID || !Array.isArray(result.Grants)) return false;
  const owner = grant => grant.Grantee?.ID === result.Owner.ID && grant.Permission === 'FULL_CONTROL';
  const publicRead = grant => (grant.Grantee?.URI === 'http://cam.qcloud.com/groups/global/AllUsers' ||
    grant.Grantee?.ID === 'qcs::cam::anyone:anyone') && grant.Permission === 'READ';
  return result.Grants.some(owner) &&
    result.Grants.every(grant => owner(grant) || expected === 'public-read' && publicRead(grant)) &&
    (expected !== 'public-read' || result.Grants.some(publicRead));
}

async function ensureAcl(client, parameters, image) {
  const expected = expectedAcl(image);
  try {
    if (aclMatches(await client.getObjectAcl(parameters), expected)) return false;
    await client.putObjectAcl({ ...parameters, ACL: expected });
    if (aclMatches(await client.getObjectAcl(parameters), expected)) return true;
  } catch { /* SDK error details can include signed requests. */ }
  throw new Error(`COS object ACL was not verified: ${image.objectKey}`);
}

export async function migrateStaticImages(manifest, { root = process.cwd(), distOnly = false, apply = false, client, bucket, region } = {}) {
  const objects = await prepare(manifest, root, distOnly);
  const result = { mode: apply ? 'apply' : 'dry-run', objects: objects.length, bytes: objects.reduce((sum, image) => sum + image.size, 0), uploaded: 0, existing: 0, aclUpdated: 0 };
  if (!apply) return result; // No credentials, SDK loading or network access in dry-run.
  if (!client || !/^[a-z0-9][a-z0-9-]{0,49}-[0-9]+$/.test(bucket || '') || !/^[a-z]{2}-[a-z]+(?:-[a-z0-9]+)*$/.test(region || '')) throw new Error('A COS client, COS_BUCKET and COS_REGION are required for --apply.');
  let versioning;
  try { versioning = await client.getBucketVersioning({ Bucket: bucket, Region: region }); }
  catch { throw new Error('Cannot verify COS bucket versioning; uploads were not started.'); }
  // COS ignores forbid-overwrite after versioning has been enabled or suspended.
  // https://cloud.tencent.com/document/product/436/7749
  if (!versioning.VersioningConfiguration || versioning.VersioningConfiguration.Status) throw new Error('Safe migration requires a bucket that has never enabled versioning.');
  for (const image of objects) {
    const parameters = { Bucket: bucket, Region: region, Key: image.objectKey };
    const existing = await headOrMissing(client, parameters);
    if (existing) {
      if (!matches(existing, image)) throw new Error(`COS object conflicts with the manifest: ${image.objectKey}`);
      if (await ensureAcl(client, parameters, image)) result.aclUpdated++;
      result.existing++;
      continue;
    }
    let uploaded = true;
    try {
      await client.putObject({ ...parameters, Body: image.bytes, ContentLength: image.size,
        ContentType: image.kind === 'source' ? 'application/octet-stream' : image.mime,
        ContentDisposition: image.kind === 'source' ? 'attachment' : 'inline', ACL: expectedAcl(image),
        CacheControl: image.kind === 'source' ? 'private, no-store' : 'public, max-age=31536000, immutable',
        Headers: { 'x-cos-meta-sha256': image.sha256, 'x-cos-forbid-overwrite': 'true' }
      });
    } catch { uploaded = false; }
    const verified = await headOrMissing(client, parameters);
    if (!verified || !matches(verified, image)) throw new Error(`COS upload was not verified; existing data was retained: ${image.objectKey}`);
    if (await ensureAcl(client, parameters, image)) result.aclUpdated++;
    if (uploaded) result.uploaded++;
    else result.existing++; // An identical concurrent upload or timed-out PUT is safe to reuse.
  }
  return result;
}

function cosFromEnvironment(env = process.env) {
  for (const name of ['COS_SECRET_ID', 'COS_SECRET_KEY', 'COS_BUCKET', 'COS_REGION']) if (!env[name]?.trim()) throw new Error(`${name} is required for --apply.`);
  const require = createRequire(new URL('../../server/package.json', import.meta.url));
  let COS;
  try { COS = require('cos-nodejs-sdk-v5'); } catch { throw new Error('Install the server dependencies before --apply.'); }
  let client;
  try {
    client = new COS({ SecretId: env.COS_SECRET_ID, SecretKey: env.COS_SECRET_KEY,
      ...(env.COS_SECURITY_TOKEN ? { SecurityToken: env.COS_SECURITY_TOKEN } : {}),
      Protocol: 'https:', Timeout: 30000, UploadCheckContentMd5: true
    });
  } catch { throw new Error('Cannot initialize COS; check the configured credentials.'); }
  return { bucket: env.COS_BUCKET, region: env.COS_REGION, client };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values } = parseArgs({ options: {
      manifest: { type: 'string', default: '.local-data/media/image-manifest.json' },
      root: { type: 'string', default: process.cwd() },
      'dist-only': { type: 'boolean', default: false }, apply: { type: 'boolean', default: false }
    } });
    const manifest = JSON.parse(await readFile(values.manifest, 'utf8'));
    const result = await migrateStaticImages(manifest, {
      root: values.root, distOnly: values['dist-only'], apply: values.apply,
      ...(values.apply ? cosFromEnvironment() : {})
    });
    console.log(JSON.stringify(result));
  } catch (error) {
    // SDK errors can contain signed request URLs or headers. Only our messages reach this boundary.
    console.error(error instanceof SyntaxError ? 'Invalid image manifest JSON.' : error.message);
    process.exitCode = 1;
  }
}
