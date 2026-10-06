import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.mjs';
import { hashPassword } from './security.mjs';

const origin = 'http://127.0.0.1:3001';
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2fQAAAAASUVORK5CYII=';
const password = 'A-new-member-password!';
const form = (username = 'newmember') => ({ username, password, role: 'admin', profile: {
  name: 'New Lab Member', position: 'phd', emails: ['member@example.org'], website: 'https://example.org',
  researchInterest: 'Human-computer interaction.', bioParagraphs: ['I study everyday interaction.'], lifePhotoAlt: 'Walking outdoors.',
}, portrait: { name: 'portrait.png', data: png }, lifePhoto: { name: 'life.png', data: png } });
let app, directory, base, admin, member, clock = Date.now();
async function listen() {
  await new Promise((resolve, reject) => { app.server.once('error', reject); app.server.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${app.server.address().port}`;
}
async function request(path, { method = 'GET', body, auth, extra = {} } = {}) {
  const response = await fetch(`${base}${path}`, { method, headers: {
    ...(method !== 'GET' ? { Origin: origin, 'Content-Type': 'application/json' } : {}),
    ...(auth ? { Cookie: auth.cookie, 'X-CSRF-Token': auth.csrfToken } : {}), ...extra,
  }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  const json = response.headers.get('content-type')?.includes('application/json');
  return { status: response.status, body: json ? await response.json() : await response.arrayBuffer(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
async function login(username, supplied = '123456') {
  const result = await request('/api/auth/login', { method: 'POST', body: { username, password: supplied } });
  assert.equal(result.status, 200);
  return { ...result.body, cookie: result.cookie };
}
async function register(username, overrides = {}) {
  const result = await request('/api/registrations', { method: 'POST', body: { ...form(username), ...overrides } });
  assert.equal(result.status, 201);
  return result.body.registration;
}
async function pending(id) {
  const response = await request('/api/registrations', { auth: admin });
  assert.equal(response.status, 200);
  assert.equal(JSON.stringify(response.body).includes('password_hash'), false);
  assert.equal(JSON.stringify(response.body).includes(password), false);
  return response.body.registrations.find(item => item.id === id);
}
const review = (registration, decision = 'approve', overrides = {}) => request(`/api/registrations/${registration.id}/review`, {
  method: 'POST', auth: admin, body: { decision, version: registration.version ?? 1, feedback: decision === 'reject' ? 'Please check the profile information.' : '', ...overrides },
});
before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'fearlab-registration-'));
  app = await createApp({ dataDir: directory, allowedOrigins: [origin], now: () => clock, onError: error => console.error(error) });
  await listen();
  admin = await login('primo'); member = await login('hongni');
});
beforeEach(() => { clock += 16 * 60 * 1000; });
after(async () => { await app.close(); await rm(directory, { recursive: true, force: true }); });

test('pending registration has no account or project access and photos are private to administrators', async () => {
  const created = await register('NewMember');
  assert.deepEqual(Object.keys(created).sort(), ['id', 'status', 'username']);
  assert.equal(created.username, 'newmember'); assert.equal(created.status, 'pending');
  assert.equal(app.db.prepare('SELECT id FROM users WHERE username=?').get('newmember'), undefined);
  assert.equal((await request('/api/auth/login', { method: 'POST', body: { username: 'newmember', password } })).status, 401);
  assert.equal((await request('/api/projects')).status, 401);
  assert.equal((await request('/api/projects', { method: 'POST', body: {} })).status, 401);
  assert.equal((await request('/api/registrations')).status, 401);
  assert.equal((await request('/api/registrations', { auth: member })).status, 403);
  const row = await pending(created.id);
  assert.equal((await request(row.profile.idPhoto)).status, 404);
  assert.equal((await request(row.profile.lifePhoto, { auth: member })).status, 404);
  assert.equal((await request(row.profile.idPhoto, { auth: admin })).status, 200);
  assert.deepEqual((await request('/api/public/people')).body.people, []);
  assert.equal((await request(`/api/registrations/${created.id}/review`, { method: 'POST', auth: member, body: { version: 1, decision: 'approve', feedback: '' } })).status, 403);
  assert.equal((await request(`/api/registrations/${created.id}/review`, { method: 'POST', auth: admin, extra: { 'X-CSRF-Token': 'wrong' }, body: { version: 1, decision: 'approve', feedback: '' } })).status, 403);
  const approval = await review(row);
  assert.equal(approval.status, 200); assert.equal(approval.body.registration.status, 'approved');
  const auth = await login('NeWmEmBeR', password);
  assert.equal(auth.user.role, 'member'); assert.equal(auth.user.usingInitialPassword, false);
  assert.equal((await request('/api/projects', { auth })).status, 200);
  const people = (await request('/api/public/people')).body.people;
  assert.equal(people.length, 1); assert.equal(people[0].slug, 'member-newmember');
  assert.equal(people[0].positionLabel, 'PhD Student'); assert.deepEqual(people[0].emails, ['member@example.org']);
  assert.equal((await request(people[0].idPhoto)).status, 200);
  assert.equal((await request(people[0].lifePhoto)).status, 200);
  for (const privateField of ['password', 'password_hash', 'username', 'disabled', 'role', 'feedback', 'must_change']) assert.equal(privateField in people[0], false);
});

test('rejection requires feedback, keeps account unavailable, and permits a new application', async () => {
  const created = await register('rejectedmember');
  const row = await pending(created.id);
  assert.equal((await review(row, 'reject', { feedback: '' })).status, 400);
  const rejected = await review(row, 'reject');
  assert.equal(rejected.status, 200); assert.equal(rejected.body.registration.status, 'rejected');
  assert.equal((await request(row.profile.idPhoto)).status, 404);
  assert.equal((await request('/api/auth/login', { method: 'POST', body: { username: 'rejectedmember', password } })).status, 401);
  assert.equal((await review(rejected.body.registration)).status, 409);
  const again = await register('RejectedMember');
  assert.notEqual(again.id, created.id);
});

test('active aliases and pending usernames cannot be claimed; concurrent duplicate uploads are cleaned up', async () => {
  for (const username of ['Primo', 'Mirjana', 'Dongyijie', 'newmember', 'rejectedmember']) {
    assert.equal((await request('/api/registrations', { method: 'POST', body: form(username) })).status, 409);
  }
  const before = (await readdir(join(directory, 'uploads'))).length;
  const responses = await Promise.all([1, 2].map(() => request('/api/registrations', { method: 'POST', body: form('simultaneous') })));
  assert.deepEqual(responses.map(response => response.status).sort(), [201, 409]);
  assert.equal((await readdir(join(directory, 'uploads'))).length, before + 2);
  assert.equal(app.db.prepare("SELECT COUNT(*) AS total FROM registrations WHERE username='simultaneous'").get().total, 1);
});

test('stale and simultaneous reviews enable exactly one account and People record', async () => {
  const created = await register('reviewmember', { profile: { ...form().profile, position: 'mphil' } });
  const row = await pending(created.id);
  assert.equal((await review(row, 'approve', { version: 2 })).status, 409);
  const outcomes = await Promise.all([review(row), review(row)]);
  assert.deepEqual(outcomes.map(result => result.status).sort(), [200, 409]);
  assert.equal(app.db.prepare("SELECT COUNT(*) AS total FROM users WHERE username='reviewmember'").get().total, 1);
  assert.equal((await request('/api/public/people')).body.people.filter(person => person.slug === 'member-reviewmember').length, 1);
  assert.equal((await request('/api/public/people')).body.people.find(person => person.slug === 'member-reviewmember').groupKey, 'mphil');
});

test('invalid origins, fields, photos and too-short passwords create no records or files', async () => {
  const before = (await readdir(join(directory, 'uploads'))).length;
  assert.equal((await request('/api/registrations', { method: 'POST', body: form('bad'), extra: { Origin: 'https://other.example' } })).status, 403);
  const candidates = [
    { password: '123456' }, { username: '../bad' }, { profile: { ...form().profile, position: 'admin' } },
    { profile: { ...form().profile, website: 'javascript:alert(1)' } },
    { profile: { ...form().profile, emails: ['invalid'] } },
    { portrait: { name: 'fake.png', data: Buffer.from('<html>Not an image</html>').toString('base64') } },
    { lifePhoto: { name: 'truncated.png', data: Buffer.from(png, 'base64').subarray(0, 40).toString('base64') } },
  ];
  for (const invalid of candidates) assert.equal((await request('/api/registrations', { method: 'POST', body: { ...form('invalid'), ...invalid } })).status, 400);
  assert.equal((await readdir(join(directory, 'uploads'))).length, before);
  assert.equal(app.db.prepare("SELECT COUNT(*) AS total FROM registrations WHERE username='invalid'").get().total, 0);
});

test('disabled Mandi credentials and existing sessions are blocked, approval re-enables only member access', async () => {
  assert.equal(app.db.prepare("SELECT id FROM users WHERE username='mandi'").get(), undefined);
  app.db.prepare("INSERT INTO users(id,username,name,role,password_hash) VALUES('mandi','mandi','Mandi','member',?)").run(await hashPassword('123456'));
  const old = await login('mandi');
  app.db.prepare("UPDATE users SET disabled=1 WHERE username='mandi'").run();
  assert.equal((await request('/api/auth/session', { auth: old })).body.user, null);
  assert.equal((await request('/api/projects', { auth: old })).status, 401);
  assert.equal((await request('/api/auth/login', { method: 'POST', body: { username: 'mandi', password: '123456' } })).status, 401);
  const created = await register('MaNdI', { profile: { ...form().profile, name: 'Mandi', position: 'ra' } });
  assert.equal((await review(await pending(created.id))).status, 200);
  const current = await login('MANDI', password);
  assert.equal(current.user.role, 'member'); assert.equal(current.user.id, 'mandi');
  assert.equal((await request('/api/auth/session', { auth: old })).body.user, null);
  assert.equal((await request('/api/auth/login', { method: 'POST', body: { username: 'mandi', password: '123456' } })).status, 401);
  assert.equal((await request('/api/public/people')).body.people.find(person => person.name === 'Mandi').positionLabel, 'Research Assistant');
});

test('registration attempts are bounded before hashing or saving uploads', async () => {
  for (let index = 0; index < 12; index++) assert.equal((await request('/api/registrations', { method: 'POST', body: {} })).status, 400);
  assert.equal((await request('/api/registrations', { method: 'POST', body: {} })).status, 429);
});

test('approved accounts and People records survive reopening; pending passwords are never listed', async () => {
  await app.close();
  app = await createApp({ dataDir: directory, allowedOrigins: [origin], now: () => clock });
  await listen();
  assert.equal((await login('mandi', password)).user.role, 'member');
  assert.ok((await request('/api/public/people')).body.people.some(person => person.slug === 'member-mandi'));
  const listed = await request('/api/registrations', { auth: admin });
  assert.equal(listed.status, 200);
  assert.equal(JSON.stringify(listed.body).includes('password_hash'), false);
});
