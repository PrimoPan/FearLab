import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { buildImageManifest } from './build-image-manifest.mjs';
import { migrateStaticImages } from './migrate-static-images.mjs';

const root = await realpath(await mkdtemp(join(tmpdir(), 'fearlab-image-migration-')));
after(() => rm(root, { recursive: true, force: true }));
await mkdir(join(root, 'assets'));
await mkdir(join(root, 'dist/assets'), { recursive: true });
await writeFile(join(root, 'assets/未公开原图.jpg'), 'original image');
await writeFile(join(root, 'assets/duplicate.jpg'), 'original image');
await writeFile(join(root, 'dist/assets/photo-a1b2c3.jpg'), 'web image');
const manifest = await buildImageManifest({ root });
const options = { root, apply: true, bucket: 'test-media-1234567890', region: 'ap-guangzhou' };

function fakeCos({ conflict = false, badHash = false, version = '', forbidden = false, race = false, failAcl = false, publicGranteeId = false } = {}) {
  const objects = new Map(), calls = [];
  return {
    objects, calls,
    async getBucketVersioning() { calls.push('versioning'); return { VersioningConfiguration: version ? { Status: version } : {} }; },
    async headObject({ Key }) {
      calls.push(`head:${Key}`);
      if (forbidden) throw { statusCode: 403, message: 'secret-must-not-leak' };
      if (conflict) return { headers: { 'content-length': '5', 'x-cos-meta-sha256': 'wrong' } };
      if (!objects.has(Key)) throw { statusCode: 404 };
      const object = objects.get(Key);
      return { headers: { 'content-length': String(object.Body.length), 'x-cos-meta-sha256': badHash ? 'wrong' : object.Headers['x-cos-meta-sha256'] } };
    },
    async putObject(parameters) {
      calls.push(`put:${parameters.Key}`);
      assert.equal(parameters.Headers['x-cos-forbid-overwrite'], 'true');
      assert.equal(parameters.ACL, parameters.Key.startsWith('fearlab/assets/') ? 'public-read' : 'private');
      assert.ok(!objects.has(parameters.Key));
      objects.set(parameters.Key, parameters);
      if (race) throw { statusCode: 409 };
    },
    async getObjectAcl({ Key }) {
      calls.push(`acl-get:${Key}`);
      if (failAcl) throw new Error('secret-must-not-leak');
      const ACL = objects.get(Key).ACL;
      return { ACL, Owner: { ID: 'owner' }, Grants: [
        { Grantee: { ID: 'owner' }, Permission: 'FULL_CONTROL' },
        ...(ACL === 'public-read' ? [{ Grantee: publicGranteeId ? { ID: 'qcs::cam::anyone:anyone' } : { URI: 'http://cam.qcloud.com/groups/global/AllUsers' }, Permission: 'READ' }] : [])
      ] };
    },
    async putObjectAcl({ Key, ACL }) {
      calls.push(`acl-put:${Key}`);
      objects.get(Key).ACL = ACL;
    }
  };
}

test('default dry-run validates local files without network and deduplicates identical archive objects', async () => {
  const client = fakeCos();
  const result = await migrateStaticImages(manifest, { root, client });
  assert.equal(result.mode, 'dry-run');
  assert.equal(result.objects, 2);
  assert.deepEqual(client.calls, []);
});

test('apply writes private blobs and public static images, verifies content and ACL, and reuses matching objects', async () => {
  const client = fakeCos();
  const result = await migrateStaticImages(manifest, { ...options, client });
  assert.equal(result.uploaded, 2);
  for (const [key, object] of client.objects) {
    assert.ok(client.calls.lastIndexOf(`head:${key}`) > client.calls.indexOf(`put:${key}`));
    assert.ok(key.startsWith('fearlab/'));
    if (key.startsWith('fearlab/archives/')) {
      assert.match(key, /^fearlab\/archives\/[a-f0-9]{64}\.blob$/);
      assert.equal(object.ContentType, 'application/octet-stream');
      assert.equal(object.CacheControl, 'private, no-store');
      assert.equal(object.ACL, 'private');
    } else {
      assert.equal(object.CacheControl, 'public, max-age=31536000, immutable');
      assert.equal(object.ACL, 'public-read');
    }
  }
  const retry = await migrateStaticImages(manifest, { ...options, client });
  assert.equal(retry.uploaded, 0);
  assert.equal(retry.existing, 2);
  assert.equal(retry.aclUpdated, 0);
  assert.equal(await readFile(join(root, 'assets/未公开原图.jpg'), 'utf8'), 'original image');
});

test('matching existing content still repairs and verifies ACLs without touching unrelated objects', async () => {
  const client = fakeCos();
  await migrateStaticImages(manifest, { ...options, client });
  const putsBefore = client.calls.filter(call => call.startsWith('put:')).length;
  for (const [key, object] of client.objects) object.ACL = key.startsWith('fearlab/assets/') ? 'private' : 'public-read';
  client.objects.set('other-app/private.jpg', { ACL: 'private' });
  const result = await migrateStaticImages(manifest, { ...options, client });
  assert.equal(result.aclUpdated, 2);
  assert.equal(result.uploaded, 0);
  assert.equal(result.existing, 2);
  assert.equal(client.calls.filter(call => call.startsWith('put:')).length, putsBefore);
  assert.equal(client.objects.get('other-app/private.jpg').ACL, 'private');
  assert.ok(!client.calls.some(call => call.includes('other-app/')));
});

test('SDK-supported anyone grantee IDs verify public-read ACLs without unnecessary ACL writes', async () => {
  const client = fakeCos({ publicGranteeId: true });
  assert.equal((await migrateStaticImages(manifest, { ...options, client })).uploaded, 2);
  assert.equal((await migrateStaticImages(manifest, { ...options, client })).existing, 2);
  assert.ok(!client.calls.some(call => call.startsWith('acl-put:')));
});

test('unverifiable ACLs fail without exposing SDK credentials or deleting data', async () => {
  const client = fakeCos({ failAcl: true });
  await assert.rejects(migrateStaticImages(manifest, { ...options, client }), error => /ACL was not verified/.test(error.message) && !error.message.includes('secret-must-not-leak'));
  assert.equal(client.objects.size, 1);
});

test('dist-only uploads contain no original archives', async () => {
  const client = fakeCos();
  const result = await migrateStaticImages(manifest, { ...options, client, distOnly: true });
  assert.equal(result.objects, 1);
  assert.ok([...client.objects.keys()].every(key => key.startsWith('fearlab/assets/')));
});

test('conflicts, denied reads and versioned buckets cannot result in an upload', async () => {
  for (const config of [{ conflict: true }, { forbidden: true }, { version: 'Enabled' }, { version: 'Suspended' }]) {
    const client = fakeCos(config);
    await assert.rejects(migrateStaticImages(manifest, { ...options, client }), error => !error.message.includes('secret-must-not-leak'));
    assert.ok(!client.calls.some(call => call.startsWith('put:')));
  }
});

test('post-upload integrity mismatch fails without deleting; identical racing uploads are verified', async () => {
  const bad = fakeCos({ badHash: true });
  await assert.rejects(migrateStaticImages(manifest, { ...options, client: bad }), /not verified/);
  assert.equal(bad.objects.size, 1);
  const race = fakeCos({ race: true });
  assert.equal((await migrateStaticImages(manifest, { ...options, client: race })).existing, 2);
});

test('changed files, public archive suffixes and escaping paths fail before contacting COS', async () => {
  for (const patch of [{ sha256: '0'.repeat(64) }, { objectKey: 'fearlab/archives/private.jpg' }, { objectKey: manifest.images[0].objectKey.replace('fearlab/', '') }, { path: '../outside.jpg' }, { path: 'dist/assets/photo-a1b2c3.jpg' }]) {
    const changed = structuredClone(manifest);
    Object.assign(changed.images[0], patch);
    const client = fakeCos();
    await assert.rejects(migrateStaticImages(changed, { ...options, client }));
    assert.deepEqual(client.calls, []);
  }
});
