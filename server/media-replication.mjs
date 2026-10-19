import { readMediaRecords, readMediaImage, anonymousCosStatus } from './migrate-media.mjs';
import { MEDIA_CACHE_CONTROL } from './media-store.mjs';

// No queue table is needed: an immutable local image and its committed upload
// row remain the retry source across crashes, upgrades, and local rollbacks.
export async function createMediaReplicator({ dataDir, config, cosClient, anonymousStatus = anonymousCosStatus, now = Date.now }) {
  if (config?.mode !== 'cos') throw new Error('COS replication requires cloud configuration.');
  let cos = cosClient;
  if (!cos) {
    const { default: COS } = await import('cos-nodejs-sdk-v5');
    cos = new COS({ SecretId: config.secretId, SecretKey: config.secretKey,
      ...(config.securityToken ? { SecurityToken: config.securityToken } : {}),
      Protocol: 'https:', Timeout: 30000, UploadCheckContentMd5: true });
  }
  const bucket = { Bucket: config.bucket, Region: config.region };
  const ready = new Map(), retries = new Map();
  let active, stopped = false;
  const parameters = item => ({ ...bucket, Key: item.key });
  const requireRunning = () => { if (stopped) throw new Error('Replication stopped.'); };
  function checkHead(item, result) {
    const headers = Object.fromEntries(Object.entries(result?.headers ?? {}).map(([name, value]) => [name.toLowerCase(), value]));
    if (Number(headers['content-length']) !== item.size || headers['content-type'] !== item.mime || headers['x-cos-meta-sha256'] !== item.sha256) {
      throw new Error('Existing COS image conflicts with its local source.');
    }
  }
  async function replicate(record) {
    requireRunning();
    const item = await readMediaImage(dataDir, record);
    let head;
    try { head = await cos.headObject(parameters(item)); }
    catch (error) { if (error?.statusCode !== 404) throw new Error('COS metadata is unavailable.'); }
    if (head) checkHead(item, head);
    else {
      requireRunning();
      // Never overwrite, including a concurrent manual migration. If a PUT
      // succeeds but its response is lost, the next scan verifies and reuses it.
      await cos.putObject({ ...parameters(item), Body: item.bytes, ContentLength: item.size,
        ContentType: item.mime, ContentDisposition: 'inline', CacheControl: MEDIA_CACHE_CONTROL, ACL: 'private',
        Headers: { 'x-cos-meta-sha256': item.sha256, 'x-cos-forbid-overwrite': 'true' } });
      requireRunning();
      checkHead(item, await cos.headObject(parameters(item)));
    }
    requireRunning();
    let protectedObject = false;
    try { protectedObject = await anonymousStatus(config, item.key) === 403; } catch { /* Fail closed on an inconclusive access check. */ }
    if (!protectedObject) {
      const error = new Error('Private COS access could not be verified.');
      error.protectionFailure = true;
      throw error;
    }
    ready.set(item.id, { signature: `${item.mime}:${item.size}`, until: now() + 3600000 });
    retries.delete(item.id);
  }
  async function scan() {
    requireRunning();
    const records = readMediaRecords(dataDir), ids = new Set(records.map(item => item.id));
    for (const id of ready.keys()) if (!ids.has(id)) ready.delete(id);
    for (const id of retries.keys()) if (!ids.has(id)) retries.delete(id);
    const summary = { objects: records.length, verified: 0, failed: 0, deferred: 0 };
    if (!records.length) return summary;
    // A public image is a safe ACL probe for this shared public-read bucket.
    // Recheck it on every scan before copying any unpublished bytes.
    const probe = records.find(item => item.public);
    if (!probe) throw new Error('A public image is required to verify private COS access.');
    const versioning = await cos.getBucketVersioning(bucket);
    if (!versioning?.VersioningConfiguration || versioning.VersioningConfiguration.Status) throw new Error('COS versioning prevents safe replication.');
    await replicate(probe);
    summary.verified++;
    for (const record of records) {
      if (stopped) break;
      if (record.id === probe.id) continue;
      const confirmed = ready.get(record.id), retry = retries.get(record.id);
      if (confirmed?.signature === `${record.mime}:${record.size}` && confirmed.until > now()) { summary.verified++; continue; }
      if (retry?.after > now()) { summary.deferred++; continue; }
      try { await replicate(record); summary.verified++; }
      catch (error) {
        if (stopped) break;
        ready.delete(record.id);
        const failures = Math.min((retry?.failures ?? 0) + 1, 5);
        retries.set(record.id, { failures, after: now() + Math.min(60000 * 2 ** (failures - 1), 900000) });
        summary.failed++;
        // Do not continue copying private files if object privacy is in doubt.
        if (error?.protectionFailure) throw new Error('Private COS access could not be verified.');
      }
    }
    return summary;
  }
  return {
    runOnce() {
      // Timer ticks and explicit calls cannot create overlapping uploads.
      if (!active) active = scan().finally(() => { active = undefined; });
      return active;
    },
    stop() { stopped = true; },
  };
}
