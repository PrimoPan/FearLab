import { createHash } from 'node:crypto';
import { readFile, writeFile, unlink } from 'node:fs/promises';
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

export async function createMediaStore({ dataDir, config = { mode: 'local' }, cosClient, now = Date.now, onError = () => {} }) {
  const localPath = id => { mediaObjectKey(id); return join(dataDir, 'uploads', id); };
  let cos = cosClient;
  if (config.mode === 'cos' && !cos) {
    const { default: COS } = await import('cos-nodejs-sdk-v5');
    cos = new COS({ SecretId: config.secretId, SecretKey: config.secretKey, ...(config.securityToken ? { SecurityToken: config.securityToken } : {}), Protocol: 'https:', Timeout: 5000, UploadCheckContentMd5: true });
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
  async function remove(id) {
    cache.delete(id);
    const cleanup = await Promise.allSettled([
      unlink(localPath(id)).catch(error => { if (error.code !== 'ENOENT') throw error; }),
      ...(remote ? [cos.deleteObject(parameters(id))] : []),
    ]);
    if (cleanup.some(result => result.status === 'rejected')) report('Media cleanup was incomplete; an unreferenced private object may remain.');
  }
  return {
    async save({ id, bytes, mime }) {
      if (!Buffer.isBuffer(bytes) || !supportedMimes.has(mime)) throw new Error('Invalid image storage request.');
      // Do not remove an existing file/object if the local exclusive creation fails.
      await writeFile(localPath(id), bytes, { mode: 0o600, flag: 'wx' });
      if (!remote) return;
      try {
        await cos.putObject({ ...parameters(id), Body: bytes, ContentLength: bytes.length,
          ContentType: mime, ContentDisposition: 'inline', ACL: 'private',
          CacheControl: MEDIA_CACHE_CONTROL,
          Headers: { 'x-cos-meta-sha256': createHash('sha256').update(bytes).digest('hex') },
        });
        remember(id, { available: true, checkedUntil: now() + 60000 });
      } catch {
        // A timed-out PUT may have reached COS, so clean up both sides.
        await remove(id);
        throw new Error('Cloud image storage is unavailable.');
      }
    },
    remove,
    read: id => readFile(localPath(id)),
    async redirect(media) {
      if (!remote) return null;
      try {
        let entry = cache.get(media.id);
        if (!entry || entry.checkedUntil <= now()) {
          const head = await cos.headObject(parameters(media.id));
          const length = Number(head.headers?.['content-length']);
          if (length !== media.size) {
            remember(media.id, { available: false, checkedUntil: now() + 5000 });
            return null;
          }
          entry = remember(media.id, { ...entry, available: true, checkedUntil: now() + 60000 });
        }
        if (!entry.available) return null;
        // Reusing a still-valid URL lets repeat page loads use browser caching;
        // every request to this method still passes the API authorization first.
        if (entry.url && entry.urlExpires > now() + 30000) return entry.url;
        const url = await new Promise((resolve, reject) => {
          cos.getObjectUrl({ ...parameters(media.id), Protocol: 'https:', Sign: true, Expires: MEDIA_URL_TTL_SECONDS }, (error, result) => error ? reject(error) : resolve(result.Url));
        });
        if (typeof url !== 'string' || !url.startsWith('https://')) throw new Error('Invalid media redirect.');
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
