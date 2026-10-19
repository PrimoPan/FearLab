import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { inspectMediaInventory, migrateMedia, parseMigrationArgs, MigrationError } from './migrate-media.mjs';
import { mediaObjectKey, MEDIA_CACHE_CONTROL } from './media-store.mjs';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2fQAAAAASUVORK5CYII=', 'base64');
const publicId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const draftId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const registrationId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const env = { PORTAL_MEDIA_STORAGE: 'cos', COS_BUCKET: 'lingolift-1335262060', COS_REGION: 'ap-guangzhou', COS_SECRET_ID: 'fakeId', COS_SECRET_KEY: 'NeverPrintThisFakeCredential' };
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

async function fixture(t) {
  const dataDir = await mkdtemp(join(tmpdir(), 'fearlab-media-migration-'));
  await mkdir(join(dataDir, 'uploads'));
  const db = new DatabaseSync(join(dataDir, 'portal.sqlite'));
  db.exec(`CREATE TABLE uploads(id TEXT,mime TEXT,size INTEGER);
    CREATE TABLE registration_uploads(id TEXT,mime TEXT,size INTEGER);
    CREATE TABLE users(id TEXT,disabled INTEGER);
    CREATE TABLE people_profiles(user_id TEXT,profile TEXT);
    CREATE TABLE published(snapshot TEXT);`);
  for (const id of [publicId, draftId]) db.prepare('INSERT INTO uploads VALUES(?,?,?)').run(id, 'image/png', png.length);
  db.prepare('INSERT INTO registration_uploads VALUES(?,?,?)').run(registrationId, 'image/png', png.length);
  db.prepare('INSERT INTO users VALUES(?,?)').run('mandy', 0);
  db.prepare('INSERT INTO people_profiles VALUES(?,?)').run('mandy', JSON.stringify({ idPhoto: `/api/media/${publicId}`, lifePhoto: `/api/media/${publicId}` }));
  db.close();
  for (const id of [publicId, draftId, registrationId]) await writeFile(join(dataDir, 'uploads', id), png);
  t.after(() => rm(dataDir, { recursive: true, force: true }));
  return dataDir;
}

class MigrationCos {
  objects = new Map(); calls = []; version = {}; failVersion = false; uncertainPut = false; badDownload = false; badSignedStatus = false;
  async getBucketVersioning(parameters) {
    this.calls.push({ method: 'version', ...parameters });
    if (this.failVersion) throw new Error(env.COS_SECRET_KEY);
    return { VersioningConfiguration: this.version };
  }
  async headObject(parameters) {
    this.calls.push({ method: 'head', key: parameters.Key });
    const object = this.objects.get(parameters.Key);
    if (!object) throw { statusCode: 404, message: env.COS_SECRET_KEY };
    return { headers: { 'content-length': String(object.Body.length), 'content-type': object.ContentType, 'x-cos-meta-sha256': object.Headers['x-cos-meta-sha256'] } };
  }
  async putObject(parameters) {
    this.calls.push({ method: 'put', key: parameters.Key });
    assert.equal(parameters.Headers['x-cos-forbid-overwrite'], 'true');
    if (this.objects.has(parameters.Key)) throw { statusCode: 409, message: env.COS_SECRET_KEY };
    this.objects.set(parameters.Key, parameters);
    if (this.uncertainPut) { this.uncertainPut = false; throw new Error(env.COS_SECRET_KEY); }
  }
  async getObject(parameters) {
    this.calls.push({ method: 'get', key: parameters.Key });
    return { Body: this.badDownload ? Buffer.from('bad data') : this.objects.get(parameters.Key).Body };
  }
  getObjectUrl(parameters, callback) {
    assert.equal(parameters.Protocol, 'https:'); assert.equal(parameters.Sign, true); assert.equal(parameters.Expires, 300);
    this.calls.push({ method: 'sign', key: parameters.Key });
    callback(null, { Url: `https://lingolift-1335262060.cos.ap-guangzhou.myqcloud.com/${parameters.Key}?q-signature=test` });
  }
  async fetchSigned(url) {
    const key = new URL(url).pathname.slice(1);
    this.calls.push({ method: 'signed-get', key });
    return new Response(this.objects.get(key).Body, { status: this.badSignedStatus ? 403 : 200, headers: { 'content-type': 'image/png' } });
  }
  async anonymousStatus(_config, key) {
    this.calls.push({ method: 'anonymous', key });
    return 403;
  }
}

function options(dataDir, cos) { return { dataDir, apply: true, env, cosClient: cos, anonymousStatus: cos.anonymousStatus.bind(cos), fetchSigned: cos.fetchSigned.bind(cos) }; }
function existingImage() { return { Body: png, ContentType: 'image/png', Headers: { 'x-cos-meta-sha256': sha256(png) } }; }

test('default dry-run fully validates both tables without cloud calls or database/source changes', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos();
  const before = await readFile(join(dataDir, 'portal.sqlite'));
  const summary = await migrateMedia({ ...options(dataDir, cos), apply: false });
  assert.deepEqual(summary, { mode: 'dry-run', objects: 3, totalBytes: png.length * 3, publicObjects: 1, privateObjects: 2, probeId: publicId, uploaded: 0, reused: 0, verifiedDownloads: 0 });
  assert.deepEqual(cos.calls, []);
  assert.deepEqual(await readFile(join(dataDir, 'portal.sqlite')), before);
  assert.deepEqual(await readFile(join(dataDir, 'uploads', publicId)), png);
  const manifest = await inspectMediaInventory(dataDir);
  assert.ok(manifest.every(item => item.sha256 === sha256(png) && item.key.startsWith('fearlab/uploads/')));
});

test('all local files are checked before cloud operations and probes must already be public', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos();
  await assert.rejects(migrateMedia({ ...options(dataDir, cos), probeId: draftId }), /currently public/);
  await writeFile(join(dataDir, 'uploads', registrationId), Buffer.alloc(png.length));
  await assert.rejects(migrateMedia(options(dataDir, cos)), /content is invalid/);
  assert.deepEqual(cos.calls, []); assert.equal(cos.objects.size, 0);
});

test('recorded size and MIME mismatches stop migration before any COS call', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos();
  const db = new DatabaseSync(join(dataDir, 'portal.sqlite'));
  db.prepare('UPDATE uploads SET size=? WHERE id=?').run(png.length + 1, draftId);
  await assert.rejects(migrateMedia(options(dataDir, cos)), /size mismatch/);
  db.prepare('UPDATE uploads SET size=?,mime=? WHERE id=?').run(png.length, 'image/jpeg', draftId);
  await assert.rejects(migrateMedia(options(dataDir, cos)), /MIME mismatch/);
  db.close();
  assert.deepEqual(cos.calls, []);
});

test('versioning enabled, suspended or unreadable prevents every upload without leaking SDK diagnostics', async t => {
  const dataDir = await fixture(t);
  for (const status of ['Enabled', 'Suspended']) {
    const cos = new MigrationCos(); cos.version = { Status: status };
    await assert.rejects(migrateMedia(options(dataDir, cos)), /never enabled versioning/);
    assert.equal(cos.objects.size, 0); assert.deepEqual(cos.calls.map(call => call.method), ['version']);
  }
  const cos = new MigrationCos(); cos.failVersion = true;
  await assert.rejects(migrateMedia(options(dataDir, cos)), error => error instanceof MigrationError && !error.message.includes(env.COS_SECRET_KEY));
});

test('a conflicting existing object anywhere aborts before the probe upload', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos(), original = existingImage();
  original.Headers['x-cos-meta-sha256'] = 'different';
  cos.objects.set(mediaObjectKey(registrationId), original);
  await assert.rejects(migrateMedia(options(dataDir, cos)), /refusing to overwrite/);
  assert.equal(cos.calls.some(call => call.method === 'put'), false);
  assert.equal(cos.objects.get(mediaObjectKey(registrationId)), original);
});

test('only the public probe is uploaded if anonymous access is not denied', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos();
  await assert.rejects(migrateMedia({ ...options(dataDir, cos), anonymousStatus: async () => 200 }), /not denied with 403/);
  assert.deepEqual([...cos.objects.keys()], [mediaObjectKey(publicId)]);
  assert.equal(cos.objects.get(mediaObjectKey(publicId)).ACL, 'private');
  assert.deepEqual(await readFile(join(dataDir, 'uploads', draftId)), png);
});

test('apply verifies the public probe before private writes and safely reuses identical objects on rerun', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos();
  const before = await readFile(join(dataDir, 'portal.sqlite'));
  const summary = await migrateMedia({ ...options(dataDir, cos), verifyDownloads: true });
  assert.equal(summary.uploaded, 3); assert.equal(summary.reused, 0); assert.equal(summary.verifiedDownloads, 3);
  assert.equal(cos.calls.filter(call => call.method === 'signed-get').length, 3);
  const puts = cos.calls.filter(call => call.method === 'put');
  assert.equal(puts[0].key, mediaObjectKey(publicId));
  const probeCheck = cos.calls.findIndex(call => call.method === 'anonymous');
  const firstPrivateWrite = cos.calls.findIndex(call => call.method === 'put' && call.key !== mediaObjectKey(publicId));
  assert.ok(probeCheck < firstPrivateWrite);
  for (const object of cos.objects.values()) {
    assert.equal(object.Bucket, 'lingolift-1335262060'); assert.equal(object.Region, 'ap-guangzhou');
    assert.equal(object.ACL, 'private'); assert.equal(object.CacheControl, MEDIA_CACHE_CONTROL);
    assert.equal(object.ContentType, 'image/png'); assert.equal(object.ContentLength, png.length);
  }
  const reused = await migrateMedia({ ...options(dataDir, cos), verifyDownloads: true });
  assert.equal(reused.uploaded, 0); assert.equal(reused.reused, 3); assert.equal(reused.verifiedDownloads, 3);
  assert.equal(cos.calls.filter(call => call.method === 'put').length, 3);
  assert.deepEqual(await readFile(join(dataDir, 'portal.sqlite')), before);
});

test('uncertain uploads are never deleted and are verified/reused on the next run', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos(); cos.uncertainPut = true;
  await assert.rejects(migrateMedia(options(dataDir, cos)), error => /rerun/.test(error.message) && !error.message.includes(env.COS_SECRET_KEY));
  assert.deepEqual([...cos.objects.keys()], [mediaObjectKey(publicId)]);
  const resumed = await migrateMedia(options(dataDir, cos));
  assert.equal(resumed.reused, 1); assert.equal(resumed.uploaded, 2);
  assert.equal(cos.calls.filter(call => call.method === 'put' && call.key === mediaObjectKey(publicId)).length, 1);
});

test('download checksum verification fails before private uploads when the probe content is wrong', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos(); cos.badDownload = true;
  await assert.rejects(migrateMedia({ ...options(dataDir, cos), verifyDownloads: true }), /download checksum mismatch/);
  assert.deepEqual([...cos.objects.keys()], [mediaObjectKey(publicId)]);
});

test('an unusable signed URL stops after the public probe without logging the URL', async t => {
  const dataDir = await fixture(t), cos = new MigrationCos(); cos.badSignedStatus = true;
  await assert.rejects(migrateMedia({ ...options(dataDir, cos), verifyDownloads: true }), error => /Signed COS URL verification failed/.test(error.message) && !error.message.includes('q-signature') && !error.message.includes('https:'));
  assert.deepEqual([...cos.objects.keys()], [mediaObjectKey(publicId)]);
});

test('CLI defaults to dry-run and accepts no credentials or accidental conflicting modes', () => {
  assert.deepEqual(parseMigrationArgs([], { PORTAL_DATA_DIR: '/var/lib/fearlab-portal' }), { dataDir: '/var/lib/fearlab-portal', apply: false, verifyDownloads: false });
  assert.equal(parseMigrationArgs(['--data-dir', '/data', '--apply', '--verify-downloads'], {}).apply, true);
  assert.throws(() => parseMigrationArgs(['--data-dir', '/data', '--apply', '--dry-run'], {}), /either/);
  assert.throws(() => parseMigrationArgs(['--secret-key', env.COS_SECRET_KEY], {}), error => !error.message.includes(env.COS_SECRET_KEY));
  assert.throws(() => parseMigrationArgs([], {}), /PORTAL_DATA_DIR/);
});
