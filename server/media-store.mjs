import { createHash } from 'node:crypto';
import { readFile, open, unlink } from 'node:fs/promises';
import { join } from 'node:path';

// Every dynamic object stays private and is accessed with a short-lived COS URL.
export const MEDIA_URL_TTL_SECONDS = 300;
export const MEDIA_CACHE_CONTROL = 'public, max-age=300';
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const supportedMimes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function mediaObjectKey(id) {
  if (!uuid.test(id)) throw new Error('Invalid media identity.');
  return `fearlab/uploads/${id}.blob`;
}

export function mediaConfigFromEnv(env = process.env) {
  const mode = env.PORTAL_MEDIA_STORAGE || 'local';
  if (!['local', 'cos'].includes(mode)) throw new Error('PORTAL_MEDIA_STORAGE must be local or cos.');
  // A single switch restores local reads and writes even if cloud settings are stale.
  if (mode === 'local') return { mode };
  const required = name => {
    const value = env[name];
    if (typeof value !== 'string' || !value.trim() || value !== value.trim() || /[\r\n]/.test(value)) throw new Error(`${name} must be configured.`);
    return value;
  };
  const bucket = required('COS_BUCKET'), region = required('COS_REGION');
  if (!/^[a-z0-9][a-z0-9-]{0,49}-[0-9]+$/.test(bucket)) throw new Error('COS_BUCKET must include the numeric APPID.');
  if (!/^[a-z]{2}-[a-z]+(?:-[a-z0-9]+)*$/.test(region)) throw new Error('COS_REGION is invalid.');
  const config = { mode, bucket, region, secretId: required('COS_SECRET_ID'), secretKey: required('COS_SECRET_KEY') };
  if (env.COS_SECURITY_TOKEN) config.securityToken = required('COS_SECURITY_TOKEN');
  return config;
}

export async function createMediaStore({ dataDir, config = { mode: 'local' }, cosClient, fetchHead = fetch, now = Date.now, onError = () => {} }) {
  const localPath = id => { mediaObjectKey(id); return join(dataDir, 'uploads', id); };
  let cos = cosClient;
  if (config.mode === 'cos' && !cos) {
    const { default: COS } = await import('cos-nodejs-sdk-v5');
    // Only offline URL signing runs in the API. SDK network operations belong
    // to the isolated replication process, where a transport crash is harmless.
    cos = new COS({ SecretId: config.secretId, SecretKey: config.secretKey, ...(config.securityToken ? { SecurityToken: config.securityToken } : {}), Protocol: 'https:' });
  }
  const remote = config.mode === 'cos';
  const parameters = id => ({ Bucket: config.bucket, Region: config.region, Key: mediaObjectKey(id) });
  const cache = new Map();
  function remember(id, value) {
    if (!cache.has(id) && cache.size >= 1000) cache.delete(cache.keys().next().value);
    cache.set(id, value);
    return value;
  }
  function report(message) { onError(new Error(message)); }
  async function signedUrl(id, method = 'GET') {
    const url = await new Promise((resolve, reject) => {
      cos.getObjectUrl({ ...parameters(id), Method: method, Protocol: 'https:', Sign: true, Expires: MEDIA_URL_TTL_SECONDS }, (error, result) => error ? reject(error) : resolve(result.Url));
    });
    const parsed = new URL(url);
    if (parsed.origin !== `https://${config.bucket}.cos.${config.region}.myqcloud.com` || parsed.pathname !== `/${mediaObjectKey(id)}` || !parsed.searchParams.has('q-signature')) throw new Error('Invalid media redirect.');
    return url;
  }
  async function headObject(id) {
    // A total deadline bounds read fallback even on a persistently slow link.
    const response = await fetchHead(await signedUrl(id, 'HEAD'), {
      method: 'HEAD', redirect: 'manual', credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(3000),
    });
    if (response.status !== 200) throw new Error('Cloud image unavailable.');
    return response.headers;
  }
  async function remove(id) {
    cache.delete(id);
    // Only uncommitted local files are rolled back. The worker never sees these
    // UUIDs, and a slow COS DELETE must not delay an API transaction failure.
    await unlink(localPath(id)).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
  return {
    async save({ id, bytes, mime }) {
      if (!Buffer.isBuffer(bytes) || !supportedMimes.has(mime)) throw new Error('Invalid image storage request.');
      // The local file and the subsequent DB record form the durable copy queue.
      // Existing UUIDs are immutable; never remove them on an EEXIST failure.
      const file = await open(localPath(id), 'wx', 0o600);
      try {
        await file.writeFile(bytes);
        await file.sync();
        const directory = await open(join(dataDir, 'uploads'), 'r');
        try { await directory.sync(); } finally { await directory.close(); }
      } catch {
        await unlink(localPath(id)).catch(() => {});
        throw new Error('The image could not be saved locally.');
      } finally { await file.close(); }
    },
    remove,
    read: id => readFile(localPath(id)),
    async redirect(media) {
      if (!remote) return null;
      try {
        let entry = cache.get(media.id);
        if (!entry || entry.checkedUntil <= now()) {
          const head = await headObject(media.id);
          const bytes = await readFile(localPath(media.id));
          if (Number(head.get('content-length')) !== media.size || bytes.length !== media.size || head.get('content-type')?.split(';')[0] !== media.mime || head.get('x-cos-meta-sha256') !== createHash('sha256').update(bytes).digest('hex')) {
            remember(media.id, { available: false, checkedUntil: now() + 5000 });
            return null;
          }
          entry = remember(media.id, { ...entry, available: true, checkedUntil: now() + 60000 });
        }
        if (!entry.available) return null;
        // Reusing a still-valid URL lets repeat page loads use browser caching;
        // every request to this method still passes the API authorization first.
        if (entry.url && entry.urlExpires > now() + 30000) return entry.url;
        const url = await signedUrl(media.id);
        remember(media.id, { ...entry, url, urlExpires: now() + MEDIA_URL_TTL_SECONDS * 1000 });
        return url;
      } catch {
        remember(media.id, { available: false, checkedUntil: now() + 5000 });
        report('Cloud image read failed; using the local copy.');
        return null;
      }
    },
  };
}
