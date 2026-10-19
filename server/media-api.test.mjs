import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.mjs';
import { createMediaStore } from './media-store.mjs';

const origin = 'http://127.0.0.1:3001';
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2fQAAAAASUVORK5CYII=';
const form = username => ({ username, password: 'A-new-member-password!', profile: {
  name: 'New Member', position: 'mphil', emails: ['new@example.org'], website: '', researchInterest: 'HCI', bioParagraphs: ['Research biography.'], lifePhotoAlt: 'At the beach.',
}, portrait: { name: 'portrait.png', data: png }, lifePhoto: { name: 'life.png', data: png } });
const project = hero => ({ title: 'Published work', subtitle: 'Summary', authors: 'Hongni', hero, heroAlt: 'Concept', leader: 'Hongni', supervisor: 'Mirjana', sections: [{ id: 'overview', layout: 'text', heading: 'Overview', body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Description' }] }] }, images: [], linkLabel: '', linkUrl: '' }] });

async function setup(t) {
  const directory = await mkdtemp(join(tmpdir(), 'fearlab-cos-api-'));
  const remote = new Map(), calls = { puts: 0, failPut: 0, redirects: 0 };
  const cos = {
    async putObject(params) { calls.puts++; remote.set(params.Key, params); if (calls.puts === calls.failPut) throw new Error('PUT failed after write'); },
    async deleteObject(params) { remote.delete(params.Key); },
    async headObject(params) { const object = remote.get(params.Key); if (!object) throw new Error('Missing'); return { headers: { 'content-length': object.Body.length } }; },
    getObjectUrl(params, callback) {
      assert.equal(params.Sign, true); assert.equal(params.Expires, 300); assert.equal(params.Protocol, 'https:');
      callback(null, { Url: `https://lingolift-1335262060.cos.ap-guangzhou.myqcloud.com/${params.Key}?q-signature=test` });
    },
  };
  const storage = await createMediaStore({ dataDir: directory, config: { mode: 'cos', bucket: 'lingolift-1335262060', region: 'ap-guangzhou' }, cosClient: cos });
  const redirect = storage.redirect;
  storage.redirect = media => { calls.redirects++; return redirect(media); };
  let app = await createApp({ dataDir: directory, allowedOrigins: [origin], storage }), base;
  async function listen() {
    await new Promise((resolve, reject) => { app.server.once('error', reject); app.server.listen(0, '127.0.0.1', resolve); });
    base = `http://127.0.0.1:${app.server.address().port}`;
  }
  await listen();
  t.after(async () => { await app.close(); await rm(directory, { recursive: true, force: true }); });
  async function request(path, { method = 'GET', body, auth } = {}) {
    const response = await fetch(`${base}${path}`, { method, redirect: 'manual', headers: {
      ...(method === 'GET' ? {} : { Origin: origin, 'Content-Type': 'application/json' }),
      ...(auth ? { Cookie: auth.cookie, 'X-CSRF-Token': auth.csrfToken } : {}),
    }, ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: response.status, headers: response.headers, cookie: response.headers.get('set-cookie')?.split(';')[0], body: response.headers.get('content-type')?.includes('json') ? await response.json() : Buffer.from(await response.arrayBuffer()) };
  }
  async function login(username) {
    const result = await request('/api/auth/login', { method: 'POST', body: { username, password: '123456' } });
    assert.equal(result.status, 200);
    return { ...result.body, cookie: result.cookie };
  }
  return { app, directory, remote, calls, request, login, async rollback() {
    await app.close(); app = await createApp({ dataDir: directory, allowedOrigins: [origin] }); await listen();
  } };
}

function signed(response) {
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const location = new URL(response.headers.get('location'));
  assert.equal(location.hostname, 'lingolift-1335262060.cos.ap-guangzhou.myqcloud.com');
  assert.match(location.pathname, /^\/fearlab\/uploads\/[a-f0-9-]{36}\.blob$/);
  assert.equal(location.searchParams.get('q-signature'), 'test');
}

test('COS redirects preserve draft/project/registration permissions, approval, disabling and local rollback', async t => {
  const ctx = await setup(t), { app, request, login } = ctx;
  const owner = await login('hongni'), other = await login('mengxu'), admin = await login('primo');
  const upload = await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'concept.png', data: png } });
  assert.equal(upload.status, 201);
  const image = upload.body.url;
  assert.equal((await request(image)).status, 404);
  assert.equal((await request(image, { auth: other })).status, 404);
  assert.equal(ctx.calls.redirects, 0, 'unauthorized requests must never reach the signer');
  signed(await request(image, { auth: owner }));
  signed(await request(image, { auth: admin }));
  let proposal = (await request('/api/projects', { method: 'POST', auth: owner, body: { project: project(image) } })).body.project;
  proposal = (await request(`/api/projects/${proposal.id}/submit`, { method: 'POST', auth: owner, body: { version: proposal.version } })).body.project;
  assert.equal((await request(image)).status, 404);
  assert.equal((await request(`/api/projects/${proposal.id}/review`, { method: 'POST', auth: admin, body: { version: proposal.version, decision: 'approve', feedback: '' } })).status, 200);
  signed(await request(image));

  const registered = await request('/api/registrations', { method: 'POST', body: form('cloudmember') });
  assert.equal(registered.status, 201);
  const registration = (await request('/api/registrations', { auth: admin })).body.registrations.find(row => row.id === registered.body.registration.id);
  assert.equal((await request(registration.profile.idPhoto)).status, 404);
  assert.equal((await request(registration.profile.lifePhoto, { auth: owner })).status, 404);
  signed(await request(registration.profile.idPhoto, { auth: admin }));
  assert.equal((await request(`/api/registrations/${registration.id}/review`, { method: 'POST', auth: admin, body: { version: 1, decision: 'approve', feedback: '' } })).status, 200);
  signed(await request(registration.profile.idPhoto));
  signed(await request(registration.profile.lifePhoto));
  app.db.prepare("UPDATE users SET disabled=1 WHERE username='cloudmember'").run();
  const before = ctx.calls.redirects;
  assert.equal((await request(registration.profile.idPhoto)).status, 404);
  assert.equal(ctx.calls.redirects, before, 'disabled profiles must stop issuing signed URLs');
  signed(await request(registration.profile.idPhoto, { auth: admin }));
  assert.ok([...ctx.remote.values()].every(object => object.ACL === 'private'));

  await ctx.rollback();
  const local = await request(image);
  assert.equal(local.status, 200); assert.deepEqual(local.body, Buffer.from(png, 'base64'));
  const newLocal = await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'after-rollback.png', data: png } });
  assert.equal(newLocal.status, 201);
  assert.equal((await request(newLocal.body.url, { auth: owner })).status, 200);
});

test('COS upload errors and database conflicts never commit incomplete media', async t => {
  const { app, directory, remote, calls, request, login } = await setup(t);
  const owner = await login('hongni');
  calls.failPut = 1;
  assert.equal((await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'failed.png', data: png } })).status, 500);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM uploads').get().total, 0);
  assert.equal(remote.size, 0); assert.deepEqual(await readdir(join(directory, 'uploads')), []);
  calls.failPut = calls.puts + 2;
  assert.equal((await request('/api/registrations', { method: 'POST', body: form('secondimagefails') })).status, 500);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM registrations').get().total, 0);
  assert.equal(remote.size, 0); assert.deepEqual(await readdir(join(directory, 'uploads')), []);
  app.db.exec("CREATE TRIGGER reject_upload BEFORE INSERT ON uploads BEGIN SELECT RAISE(FAIL, 'simulated database failure'); END");
  assert.equal((await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'database-fails.png', data: png } })).status, 500);
  assert.equal(remote.size, 0); assert.deepEqual(await readdir(join(directory, 'uploads')), []);
  app.db.exec('DROP TRIGGER reject_upload');
  const responses = await Promise.all([1, 2].map(() => request('/api/registrations', { method: 'POST', body: form('duplicatecloud') })));
  assert.deepEqual(responses.map(item => item.status).sort(), [201, 409]);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM registrations').get().total, 1);
  assert.equal(remote.size, 2); assert.equal((await readdir(join(directory, 'uploads'))).length, 2);
});
