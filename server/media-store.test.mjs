import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createMediaStore, mediaConfigFromEnv, mediaObjectKey, MEDIA_URL_TTL_SECONDS } from './media-store.mjs';

const id = '11111111-1111-4111-8111-111111111111';
const bytes = Buffer.from('example image bytes');
const cloudEnv = { PORTAL_MEDIA_STORAGE: 'cos', COS_BUCKET: 'lingolift-1335262060', COS_REGION: 'ap-guangzhou', COS_SECRET_ID: 'testSecretId', COS_SECRET_KEY: 'testSecretKey' };

class FakeCos {
  objects = new Map(); puts = []; deletes = []; heads = []; signatures = []; failPutAt = 0; failHeads = false; failDelete = false;
  async putObject(parameters) {
    this.puts.push(parameters);
    this.objects.set(parameters.Key, parameters);
    if (this.puts.length === this.failPutAt) throw new Error('Simulated PUT response lost');
  }
  async deleteObject(parameters) {
    this.deletes.push(parameters.Key);
    if (this.failDelete) throw new Error('Simulated delete failure');
    this.objects.delete(parameters.Key);
  }
  async headObject(parameters) {
    this.heads.push(parameters.Key);
    const object = this.objects.get(parameters.Key);
    if (!object || this.failHeads) throw new Error('Simulated unavailable object');
    return { headers: { 'content-length': String(object.Body.length) } };
  }
  getObjectUrl(parameters, callback) {
    this.signatures.push(parameters);
    callback(null, { Url: `https://lingolift-1335262060.cos.ap-guangzhou.myqcloud.com/${parameters.Key}?q-signature=stub-${this.signatures.length}` });
  }
}

async function directory(t) {
  const path = await mkdtemp(join(tmpdir(), 'fearlab-storage-'));
  await mkdir(join(path, 'uploads'));
  t.after(() => rm(path, { recursive: true, force: true }));
  return path;
}

test('cloud configuration fails closed and local rollback needs no cloud settings', () => {
  assert.deepEqual(mediaConfigFromEnv({}), { mode: 'local' });
  assert.deepEqual(mediaConfigFromEnv({ ...cloudEnv, PORTAL_MEDIA_STORAGE: 'local', COS_BUCKET: 'broken' }), { mode: 'local' });
  assert.throws(() => mediaConfigFromEnv({ PORTAL_MEDIA_STORAGE: 'typo' }), /PORTAL_MEDIA_STORAGE/);
  for (const name of ['COS_BUCKET', 'COS_REGION', 'COS_SECRET_ID', 'COS_SECRET_KEY']) {
    assert.throws(() => mediaConfigFromEnv({ ...cloudEnv, [name]: '' }), new RegExp(name));
  }
  assert.throws(() => mediaConfigFromEnv({ ...cloudEnv, COS_BUCKET: 'without-appid' }), /COS_BUCKET/);
  assert.throws(() => mediaConfigFromEnv({ ...cloudEnv, COS_REGION: '../bad' }), /COS_REGION/);
  assert.equal(mediaConfigFromEnv(cloudEnv).bucket, 'lingolift-1335262060');
  assert.equal(mediaConfigFromEnv(cloudEnv).region, 'ap-guangzhou');
});

test('dynamic media keys stay under the fixed FearLab namespace', () => {
  assert.equal(mediaObjectKey(id), `fearlab/uploads/${id}.blob`);
  assert.equal(MEDIA_URL_TTL_SECONDS, 300);
  assert.throws(() => mediaObjectKey('../secret.png'), /identity/);
  assert.throws(() => mediaObjectKey(`${id}.png`), /identity/);
  assert.throws(() => mediaObjectKey(`other/${id}`), /identity/);
});

test('dual writes keep a private verified COS copy and local rollback copy', async t => {
  const dataDir = await directory(t), cos = new FakeCos();
  let now = 1700000000000;
  const storage = await createMediaStore({ dataDir, config: mediaConfigFromEnv(cloudEnv), cosClient: cos, now: () => now });
  await storage.save({ id, bytes, mime: 'image/png' });
  assert.deepEqual(await readFile(join(dataDir, 'uploads', id)), bytes);
  const object = cos.objects.get(mediaObjectKey(id));
  assert.equal(object.Bucket, 'lingolift-1335262060'); assert.equal(object.Region, 'ap-guangzhou');
  assert.equal(object.Key, `fearlab/uploads/${id}.blob`);
  assert.equal(object.ACL, 'private'); assert.equal(object.ContentType, 'image/png');
  assert.equal(object.ContentLength, bytes.length); assert.equal(object.ContentDisposition, 'inline');
  assert.equal(object.Headers['x-cos-meta-sha256'], createHash('sha256').update(bytes).digest('hex'));
  const media = { id, size: bytes.length }, first = await storage.redirect(media);
  assert.equal(new URL(first).hostname, 'lingolift-1335262060.cos.ap-guangzhou.myqcloud.com');
  now += 30000;
  assert.equal(await storage.redirect(media), first);
  now += 250000;
  assert.notEqual(await storage.redirect(media), first);
  assert.equal(cos.heads.length, 1);
  const local = await createMediaStore({ dataDir });
  assert.equal(await local.redirect(media), null);
  assert.deepEqual(await local.read(id), bytes);
  await storage.remove(id);
  assert.equal(cos.objects.size, 0); assert.deepEqual(await readdir(join(dataDir, 'uploads')), []);
});

test('failed and uncertain PUTs remove new local and cloud objects without deleting preexisting data', async t => {
  const dataDir = await directory(t), cos = new FakeCos(); cos.failPutAt = 1;
  const storage = await createMediaStore({ dataDir, config: mediaConfigFromEnv(cloudEnv), cosClient: cos });
  await assert.rejects(storage.save({ id, bytes, mime: 'image/png' }), /unavailable/);
  assert.equal(cos.objects.size, 0); assert.deepEqual(await readdir(join(dataDir, 'uploads')), []);
  await storage.save({ id, bytes, mime: 'image/png' });
  const deleted = cos.deletes.length;
  await assert.rejects(storage.save({ id, bytes: Buffer.from('replacement'), mime: 'image/png' }), /EEXIST/);
  assert.equal(cos.deletes.length, deleted); assert.deepEqual(await storage.read(id), bytes);
});

test('cloud absence, mismatch and outage fall back locally; COS URLs are signed for five minutes', async t => {
  const dataDir = await directory(t), cos = new FakeCos();
  const local = await createMediaStore({ dataDir });
  await local.save({ id, bytes, mime: 'image/png' });
  let now = 1700000000000;
  const storage = await createMediaStore({ dataDir, config: mediaConfigFromEnv(cloudEnv), cosClient: cos, now: () => now });
  const media = { id, size: bytes.length };
  assert.equal(await storage.redirect(media), null);
  assert.deepEqual(await storage.read(id), bytes);
  now += 6000;
  cos.objects.set(mediaObjectKey(id), { Body: Buffer.from('wrong length') });
  assert.equal(await storage.redirect(media), null);
  now += 6000;
  cos.objects.set(mediaObjectKey(id), { Body: bytes });
  const url = await storage.redirect(media);
  assert.equal(new URL(url).hostname, 'lingolift-1335262060.cos.ap-guangzhou.myqcloud.com');
  assert.equal(cos.signatures[0].Sign, true); assert.equal(cos.signatures[0].Expires, 300);
  now += 61000; cos.failHeads = true;
  assert.equal(await storage.redirect(media), null);
  assert.deepEqual(await storage.read(id), bytes);
});

test('cleanup failures are sanitized and still remove the local copy', async t => {
  const dataDir = await directory(t), cos = new FakeCos(), messages = [];
  cos.failPutAt = 1; cos.failDelete = true;
  const storage = await createMediaStore({ dataDir, config: mediaConfigFromEnv(cloudEnv), cosClient: cos, onError: error => messages.push(error.message) });
  await assert.rejects(storage.save({ id, bytes, mime: 'image/png' }), /unavailable/);
  assert.deepEqual(await readdir(join(dataDir, 'uploads')), []);
  assert.equal(messages.length, 1); assert.match(messages[0], /private object may remain/);
  assert.equal(messages[0].includes(cloudEnv.COS_SECRET_KEY), false);
});
