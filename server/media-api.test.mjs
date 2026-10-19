import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.mjs';
import { createHash } from 'node:crypto';
import { createMediaStore, mediaObjectKey } from './media-store.mjs';

const origin = 'http://127.0.0.1:3001';
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2fQAAAAASUVORK5CYII=';
const form = username => ({ username, password: 'A-new-member-password!', profile: {
  name: 'New Member', position: 'mphil', emails: ['new@example.org'], website: '', researchInterest: 'HCI', bioParagraphs: ['Research biography.'], lifePhotoAlt: 'At the beach.',
}, portrait: { name: 'portrait.png', data: png }, lifePhoto: { name: 'life.png', data: png } });
const project = hero => ({ title: 'Published work', subtitle: 'Summary', authors: 'Hongni', hero, heroAlt: 'Concept', leader: 'Hongni', supervisor: 'Mirjana', sections: [{ id: 'overview', layout: 'text', heading: 'Overview', body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Description' }] }] }, images: [], linkLabel: '', linkUrl: '' }] });

async function setup(t) {
  const directory = await mkdtemp(join(tmpdir(), 'fearlab-cos-api-'));
  const remote = new Map(), calls = { puts: 0, redirects: 0 };
  const cos = {
    async putObject() { calls.puts++; throw new Error('SDK write must not run in API'); },
    async deleteObject() { throw new Error('SDK delete must not run in API'); },
    async headObject() { throw new Error('SDK HEAD must not run in API'); },
    getObjectUrl(params, callback) {
      assert.equal(params.Sign, true); assert.equal(params.Expires, 300); assert.equal(params.Protocol, 'https:');
      callback(null, { Url: `https://lingolift-1335262060.cos.ap-guangzhou.myqcloud.com/${params.Key}?q-signature=test` });
    },
  };
  const fetchHead = async url => {
    const object = remote.get(new URL(url).pathname.slice(1));
    if (!object) return new Response(null, { status: 404 });
    return new Response(null, { status: 200, headers: {
      'content-length': object.Body.length, 'content-type': object.ContentType,
      'x-cos-meta-sha256': createHash('sha256').update(object.Body).digest('hex'),
    } });
  };
  let cloudNow = Date.now();
  const storage = await createMediaStore({ dataDir: directory, config: { mode: 'cos', bucket: 'lingolift-1335262060', region: 'ap-guangzhou' }, cosClient: cos, fetchHead, now: () => cloudNow });
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
  return { app, directory, remote, calls, storage, request, login, async replicate() {
    for (const row of app.db.prepare('SELECT id,mime FROM uploads UNION SELECT id,mime FROM registration_uploads').all()) {
      remote.set(mediaObjectKey(row.id), { ACL: 'private', ContentType: row.mime, Body: await readFile(join(directory, 'uploads', row.id)) });
    }
    cloudNow += 6000;
  }, async rollback() {
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
  assert.equal((await request(image, { auth: owner })).status, 200, 'pending replication serves locally');
  await ctx.replicate();
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
  await ctx.replicate();
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

test('offline COS never blocks successful uploads or registration; failed DB writes still roll back locally', async t => {
  const { app, directory, remote, calls, request, login } = await setup(t);
  const owner = await login('hongni');
  const uploaded = await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'offline.png', data: png } });
  assert.equal(uploaded.status, 201);
  assert.equal((await request(uploaded.body.url, { auth: owner })).status, 200);
  assert.equal((await request('/api/registrations', { method: 'POST', body: form('offlinecloud') })).status, 201);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM uploads').get().total, 1);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM registrations').get().total, 1);
  assert.equal(remote.size, 0); assert.equal(calls.puts, 0);
  assert.equal((await readdir(join(directory, 'uploads'))).length, 3);
  app.db.exec("CREATE TRIGGER reject_upload BEFORE INSERT ON uploads BEGIN SELECT RAISE(FAIL, 'simulated database failure'); END");
  assert.equal((await request('/api/uploads', { method: 'POST', auth: owner, body: { name: 'database-fails.png', data: png } })).status, 500);
  assert.equal((await readdir(join(directory, 'uploads'))).length, 3);
  app.db.exec('DROP TRIGGER reject_upload');
  const responses = await Promise.all([1, 2].map(() => request('/api/registrations', { method: 'POST', body: form('duplicatecloud') })));
  assert.deepEqual(responses.map(item => item.status).sort(), [201, 409]);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM registrations').get().total, 2);
  assert.equal(remote.size, 0); assert.equal(calls.puts, 0);
  assert.equal((await readdir(join(directory, 'uploads'))).length, 5);
});

test('partial local registration failure leaves neither a registration nor its first image', async t => {
  const { app, directory, storage, request } = await setup(t);
  const save = storage.save;
  let writes = 0;
  storage.save = image => { if (++writes === 2) throw new Error('Local storage unavailable'); return save(image); };
  assert.equal((await request('/api/registrations', { method: 'POST', body: form('localfailure') })).status, 500);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM registrations').get().total, 0);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM registration_uploads').get().total, 0);
  assert.deepEqual(await readdir(join(directory, 'uploads')), []);
});

test('public directory signs only approved portraits and retains stable local fallback URLs', async t => {
  const ctx = await setup(t), { app, request, login } = ctx;
  const admin = await login('primo');
  const registration = (await request('/api/registrations', { method: 'POST', body: form('directorymember') })).body.registration;
  const pending = (await request('/api/registrations', { auth: admin })).body.registrations.find(row => row.id === registration.id);
  await ctx.replicate();
  assert.deepEqual((await request('/api/public/people')).body.people, []);
  assert.equal(ctx.calls.redirects, 0, 'pending profiles must never reach the signer');
  assert.equal((await request(`/api/registrations/${registration.id}/review`, { method: 'POST', auth: admin, body: { version: 1, decision: 'approve', feedback: '' } })).status, 200);
  const directory = await request('/api/public/people');
  assert.equal(directory.headers.get('cache-control'), 'no-store');
  const [person] = directory.body.people;
  assert.equal(person.idPhoto, pending.profile.idPhoto, 'keep the authorization route as an expiry/outage fallback');
  assert.equal(person.lifePhoto, pending.profile.lifePhoto, 'do not load the lifestyle photo on the directory critical path');
  const signedPortrait = new URL(person.idPhotoUrl);
  assert.equal(signedPortrait.hostname, 'lingolift-1335262060.cos.ap-guangzhou.myqcloud.com');
  assert.equal(signedPortrait.pathname, `/fearlab/uploads/${person.idPhoto.split('/').pop()}.blob`);
  assert.equal(signedPortrait.searchParams.get('q-signature'), 'test');
  assert.equal(ctx.calls.redirects, 1);
  assert.equal((await request('/api/public/people')).body.people[0].idPhotoUrl, person.idPhotoUrl, 'reuse a still-valid URL for browser caching');
  app.db.prepare("UPDATE users SET disabled=1 WHERE username='directorymember'").run();
  const before = ctx.calls.redirects;
  assert.deepEqual((await request('/api/public/people')).body.people, []);
  assert.equal(ctx.calls.redirects, before, 'disabled profiles must never reach the signer');
  assert.equal((await request(person.idPhoto)).status, 404);
  assert.ok([...ctx.remote.values()].every(object => object.ACL === 'private'));
});

test('public directory remains usable during COS failure and rechecks visibility after verification', async t => {
  const { app, storage, request, login } = await setup(t);
  const admin = await login('primo');
  const registration = (await request('/api/registrations', { method: 'POST', body: form('slowdirectory') })).body.registration;
  assert.equal((await request(`/api/registrations/${registration.id}/review`, { method: 'POST', auth: admin, body: { version: 1, decision: 'approve', feedback: '' } })).status, 200);
  storage.redirect = async () => { throw new Error('COS unavailable'); };
  const fallback = await request('/api/public/people');
  assert.equal(fallback.status, 200);
  assert.match(fallback.body.people[0].idPhoto, /^\/api\/media\//);
  assert.equal(fallback.body.people[0].idPhotoUrl, undefined);

  let finish, started;
  const verificationStarted = new Promise(resolve => { started = resolve; });
  storage.redirect = () => { started(); return new Promise(resolve => { finish = resolve; }); };
  const inFlight = request('/api/public/people');
  await verificationStarted;
  app.db.prepare("UPDATE users SET disabled=1 WHERE username='slowdirectory'").run();
  finish('https://lingolift-1335262060.cos.ap-guangzhou.myqcloud.com/fearlab/uploads/example.blob?q-signature=test');
  assert.deepEqual((await inFlight).body.people, [], 'a profile disabled during verification must not leak in the response');
});
