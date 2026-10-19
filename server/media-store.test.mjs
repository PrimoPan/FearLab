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
  objects = new Map(); puts = []; deletes = []; heads = []; signatures = []; failHeads = false;
  async putObject() { throw new Error('SDK network calls must not run in the API'); }
  async deleteObject() { throw new Error('SDK network calls must not run in the API'); }
  async headObject() { throw new Error('SDK network calls must not run in the API'); }
  async fetchHead(url, options) {
    assert.equal(options.method, 'HEAD'); assert.equal(options.redirect, 'manual');
    assert.equal(options.signal.aborted, false);
    const key = new URL(url).pathname.slice(1);
    this.heads.push(key);
    if (this.failHeads) throw new Error('Simulated unavailable object');
    const object = this.objects.get(key);
    if (!object) return new Response(null, { status: 404 });
    return new Response(null, { status: 200, headers: {
      'content-length': String(object.Body.length), 'content-type': 'image/png',
      'x-cos-meta-sha256': createHash('sha256').update(object.Body).digest('hex'),
    } });
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

test('COS mode saves and rolls back locally without any cloud operation', async t => {
  const dataDir = await directory(t), cos = new FakeCos();
  const storage = await createMediaStore({ dataDir, config: mediaConfigFromEnv(cloudEnv), cosClient: cos, fetchHead: cos.fetchHead.bind(cos) });
  await storage.save({ id, bytes, mime: 'image/png' });
  assert.deepEqual(await readFile(join(dataDir, 'uploads', id)), bytes);
  assert.equal(cos.objects.size, 0); assert.equal(cos.signatures.length, 0);
  await assert.rejects(storage.save({ id, bytes: Buffer.from('replacement'), mime: 'image/png' }), /EEXIST/);
  assert.deepEqual(await storage.read(id), bytes);
  await storage.remove(id);
  assert.deepEqual(await readdir(join(dataDir, 'uploads')), []);
});

test('verified replicas receive reusable five minute URLs and local rollback preserves the source', async t => {
  const dataDir = await directory(t), cos = new FakeCos();
  let now = 1700000000000;
  const storage = await createMediaStore({ dataDir, config: mediaConfigFromEnv(cloudEnv), cosClient: cos, fetchHead: cos.fetchHead.bind(cos), now: () => now });
  await storage.save({ id, bytes, mime: 'image/png' });
  cos.objects.set(mediaObjectKey(id), { Body: bytes });
  const media = { id, size: bytes.length, mime: 'image/png' }, first = await storage.redirect(media);
  assert.equal(new URL(first).hostname, 'lingolift-1335262060.cos.ap-guangzhou.myqcloud.com');
  now += 30000;
  assert.equal(await storage.redirect(media), first);
  now += 250000;
  assert.notEqual(await storage.redirect(media), first);
  assert.equal(cos.heads.length, 2);
  assert.ok(cos.signatures.every(call => call.Sign && call.Expires === 300));
  assert.ok(cos.signatures.some(call => call.Method === 'HEAD'));
  const local = await createMediaStore({ dataDir });
  assert.equal(await local.redirect(media), null);
  assert.deepEqual(await local.read(id), bytes);
  await storage.remove(id);
  assert.equal(cos.objects.size, 1, 'API rollback must never issue a cloud delete');
});

test('absence, equal-size content conflicts and outages fall back to the local image', async t => {
  const dataDir = await directory(t), cos = new FakeCos(), messages = [];
  let now = 1700000000000;
  const storage = await createMediaStore({ dataDir, config: mediaConfigFromEnv(cloudEnv), cosClient: cos, fetchHead: cos.fetchHead.bind(cos), now: () => now, onError: error => messages.push(error.message) });
  await storage.save({ id, bytes, mime: 'image/png' });
  const media = { id, size: bytes.length, mime: 'image/png' };
  assert.equal(await storage.redirect(media), null);
  now += 6000;
  cos.objects.set(mediaObjectKey(id), { Body: Buffer.alloc(bytes.length) });
  assert.equal(await storage.redirect(media), null);
  now += 6000;
  cos.objects.set(mediaObjectKey(id), { Body: bytes });
  assert.ok(await storage.redirect(media));
  now += 61000; cos.failHeads = true;
  assert.equal(await storage.redirect(media), null);
  assert.deepEqual(await storage.read(id), bytes);
  assert.ok(messages.every(message => !message.includes(cloudEnv.COS_SECRET_KEY)));
});
