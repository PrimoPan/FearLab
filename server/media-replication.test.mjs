import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createMediaReplicator } from './media-replication.mjs';
import { mediaObjectKey, MEDIA_CACHE_CONTROL } from './media-store.mjs';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2fQAAAAASUVORK5CYII=', 'base64');
const publicId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const draftId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const registrationId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const orphanId = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const config = { mode: 'cos', bucket: 'lingolift-1335262060', region: 'ap-guangzhou' };
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

async function fixture(t) {
  const dataDir = await mkdtemp(join(tmpdir(), 'fearlab-replication-'));
  await mkdir(join(dataDir, 'uploads'));
  const db = new DatabaseSync(join(dataDir, 'portal.sqlite'));
  db.exec(`CREATE TABLE uploads(id TEXT,mime TEXT,size INTEGER);
    CREATE TABLE registration_uploads(id TEXT,mime TEXT,size INTEGER);
    CREATE TABLE users(id TEXT,disabled INTEGER);
    CREATE TABLE people_profiles(user_id TEXT,profile TEXT);
    CREATE TABLE published(snapshot TEXT);`);
  for (const id of [publicId, draftId]) db.prepare('INSERT INTO uploads VALUES(?,?,?)').run(id, 'image/png', png.length);
  db.prepare('INSERT INTO registration_uploads VALUES(?,?,?)').run(registrationId, 'image/png', png.length);
  db.prepare('INSERT INTO users VALUES(?,?)').run('member', 0);
  db.prepare('INSERT INTO people_profiles VALUES(?,?)').run('member', JSON.stringify({ idPhoto: `/api/media/${publicId}`, lifePhoto: `/api/media/${publicId}` }));
  db.close();
  for (const id of [publicId, draftId, registrationId, orphanId]) await writeFile(join(dataDir, 'uploads', id), png);
  t.after(() => rm(dataDir, { recursive: true, force: true }));
  return dataDir;
}

class FakeCos {
  objects = new Map(); puts = []; heads = []; version = {}; failKey; uncertainKey; gate;
  async getBucketVersioning() { return { VersioningConfiguration: this.version }; }
  async headObject({ Key }) {
    this.heads.push(Key);
    const object = this.objects.get(Key);
    if (!object) throw { statusCode: 404 };
    return { headers: { 'content-length': object.Body.length, 'content-type': object.ContentType, 'x-cos-meta-sha256': object.Headers['x-cos-meta-sha256'] } };
  }
  async putObject(parameters) {
    this.puts.push(parameters);
    assert.equal(parameters.Headers['x-cos-forbid-overwrite'], 'true');
    assert.equal(this.objects.has(parameters.Key), false);
    if (this.gate) await this.gate(parameters.Key);
    if (parameters.Key === this.failKey) throw new Error('network failure');
    this.objects.set(parameters.Key, parameters);
    if (parameters.Key === this.uncertainKey) { this.uncertainKey = undefined; throw new Error('lost PUT response'); }
  }
}
const options = (dataDir, cos) => ({ dataDir, config, cosClient: cos, anonymousStatus: async () => 403 });

test('the committed DB rows are a durable queue; sources stay intact and restarts reuse verified replicas', async t => {
  const dataDir = await fixture(t), cos = new FakeCos(), before = await readFile(join(dataDir, 'portal.sqlite'));
  const worker = await createMediaReplicator(options(dataDir, cos));
  const summary = await worker.runOnce();
  assert.deepEqual(summary, { objects: 3, verified: 3, failed: 0, deferred: 0 });
  assert.equal(cos.puts[0].Key, mediaObjectKey(publicId));
  assert.equal(cos.objects.has(mediaObjectKey(orphanId)), false, 'uncommitted files must never be copied');
  for (const object of cos.puts) {
    assert.equal(object.ACL, 'private'); assert.equal(object.ContentType, 'image/png');
    assert.equal(object.CacheControl, MEDIA_CACHE_CONTROL); assert.equal(object.ContentLength, png.length);
    assert.equal(object.Headers['x-cos-meta-sha256'], sha256(png));
  }
  const restarted = await createMediaReplicator(options(dataDir, cos));
  assert.equal((await restarted.runOnce()).verified, 3);
  assert.equal(cos.puts.length, 3);
  assert.deepEqual(await readFile(join(dataDir, 'portal.sqlite')), before);
  assert.equal((await readdir(join(dataDir, 'uploads'))).length, 4);
  for (const id of [publicId, draftId, registrationId]) assert.deepEqual(await readFile(join(dataDir, 'uploads', id)), png);
});

test('failed and uncertain writes preserve originals, defer retries, then recover without overwriting', async t => {
  const dataDir = await fixture(t), cos = new FakeCos();
  let now = 1000000;
  cos.failKey = mediaObjectKey(draftId); cos.uncertainKey = mediaObjectKey(registrationId);
  const worker = await createMediaReplicator({ ...options(dataDir, cos), now: () => now });
  assert.deepEqual(await worker.runOnce(), { objects: 3, verified: 1, failed: 2, deferred: 0 });
  assert.equal((await worker.runOnce()).deferred, 2);
  cos.failKey = undefined; now += 61000;
  assert.equal((await worker.runOnce()).verified, 3);
  assert.equal(cos.puts.filter(item => item.Key === mediaObjectKey(registrationId)).length, 1);
  assert.equal(cos.puts.filter(item => item.Key === mediaObjectKey(draftId)).length, 2);
  assert.deepEqual(await readFile(join(dataDir, 'uploads', draftId)), png);
});

test('same-size cloud conflicts and invalid local images are not overwritten or uploaded', async t => {
  const dataDir = await fixture(t), cos = new FakeCos();
  const conflict = { Body: png, ContentType: 'image/png', Headers: { 'x-cos-meta-sha256': 'wrong' } };
  cos.objects.set(mediaObjectKey(draftId), conflict);
  await writeFile(join(dataDir, 'uploads', registrationId), Buffer.alloc(png.length));
  const worker = await createMediaReplicator(options(dataDir, cos));
  assert.equal((await worker.runOnce()).failed, 2);
  assert.deepEqual(cos.puts.map(item => item.Key), [mediaObjectKey(publicId)]);
  assert.equal(cos.objects.get(mediaObjectKey(draftId)), conflict);
});

test('public ACL probe and versioning checks stop unsafe copying before any private bytes', async t => {
  const dataDir = await fixture(t), cos = new FakeCos();
  const worker = await createMediaReplicator({ ...options(dataDir, cos), anonymousStatus: async () => 200 });
  await assert.rejects(worker.runOnce(), /Private COS access/);
  assert.deepEqual(cos.puts.map(item => item.Key), [mediaObjectKey(publicId)]);
  for (const status of ['Enabled', 'Suspended']) {
    const versioned = new FakeCos(); versioned.version = { Status: status };
    const denied = await createMediaReplicator(options(dataDir, versioned));
    await assert.rejects(denied.runOnce(), /versioning/);
    assert.equal(versioned.puts.length, 0);
  }
});

test('concurrent ticks share one scan and stop prevents later cloud writes', async t => {
  const dataDir = await fixture(t), cos = new FakeCos();
  let release, started;
  const gated = new Promise(resolve => { started = resolve; });
  cos.gate = () => new Promise(resolve => { release = resolve; started(); });
  const worker = await createMediaReplicator(options(dataDir, cos));
  const first = worker.runOnce(), second = worker.runOnce();
  assert.equal(first, second);
  await gated;
  worker.stop(); release();
  await assert.rejects(first, /stopped/);
  assert.equal(cos.puts.length, 1);
  assert.equal((await readdir(join(dataDir, 'uploads'))).length, 4);
  const restarted = await createMediaReplicator(options(dataDir, cos));
  cos.gate = undefined;
  assert.equal((await restarted.runOnce()).verified, 3);
  assert.equal(cos.puts.filter(item => item.Key === mediaObjectKey(publicId)).length, 1);
});

test('registration approval moves the same queued UUIDs without duplicating copies', async t => {
  const dataDir = await fixture(t), cos = new FakeCos();
  const worker = await createMediaReplicator(options(dataDir, cos));
  await worker.runOnce();
  const db = new DatabaseSync(join(dataDir, 'portal.sqlite'));
  db.exec('BEGIN; INSERT INTO uploads SELECT * FROM registration_uploads; DELETE FROM registration_uploads; COMMIT;');
  db.close();
  const restarted = await createMediaReplicator(options(dataDir, cos));
  assert.equal((await restarted.runOnce()).verified, 3);
  assert.equal(cos.puts.length, 3);
});
