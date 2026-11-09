import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.mjs';
import { hashPassword } from './security.mjs';

const origin = 'http://127.0.0.1:3001';
const password = 'isolated-course-test-password';
let app, base, directory, clock = Date.now();
before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'fearlab-course-'));
  app = await createApp({ dataDir: directory, now: () => clock, secureCookies: true, coursePasswordHash: await hashPassword(password) });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${app.server.address().port}`;
});
after(async () => { await app?.close(); await rm(directory, { recursive: true, force: true }); });

async function request(path, { method = 'GET', body, cookie, source = origin } = {}) {
  const response = await fetch(`${base}/api/course/${path}`, {
    method, headers: { Origin: source, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, headers: response.headers, body: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
const login = (cookie) => request('login', { method: 'POST', body: { password }, cookie });

test('anonymous requests, forged sessions, wrong passwords, and foreign origins cannot read course data', async () => {
  for (const cookie of [undefined, 'fearlab_course=true', `fearlab_course=${'a'.repeat(43)}`, `fearlab_session=${'a'.repeat(43)}`]) {
    const response = await request('content', { cookie });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(Object.keys(response.body), ['error']);
  }
  assert.equal((await request('login', { method: 'POST', body: { password: 'wrong' } })).status, 401);
  assert.equal((await request('login', { method: 'POST', body: { password }, source: 'https://untrusted.example' })).status, 403);
  assert.equal((await request('login', { method: 'POST', body: { password: {} } })).status, 400);
});

test('correct password issues a secure browser session, preserves content, and does not grant member access', async () => {
  const signed = await login();
  assert.equal(signed.status, 200);
  const cookie = signed.headers.get('set-cookie');
  for (const flag of ['HttpOnly', 'SameSite=Strict', 'Secure', 'Path=/api/course']) assert.ok(cookie.includes(flag));
  assert.ok(!cookie.includes('Max-Age='));
  assert.equal(signed.body.courseProjects.length, 6);
  assert.equal(signed.body.courseProjects.flatMap(project => project.students).length, 21);
  assert.deepEqual((await request('content', { cookie: signed.cookie })).body, signed.body);
  const member = await fetch(`${base}/api/auth/session`, { headers: { Cookie: signed.cookie } });
  assert.equal((await member.json()).user, null);
  assert.ok(!JSON.stringify(signed.body).includes(password));
});

test('rotation, logout, and expiry revoke access on the server', async () => {
  const first = await login(), second = await login(first.cookie);
  assert.notEqual(first.cookie, second.cookie);
  assert.equal((await request('content', { cookie: first.cookie })).status, 401);
  assert.equal((await request('logout', { method: 'POST', body: {}, cookie: second.cookie, source: 'https://untrusted.example' })).status, 403);
  const locked = await request('logout', { method: 'POST', body: {}, cookie: second.cookie });
  assert.equal(locked.status, 200);
  assert.match(locked.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await request('content', { cookie: second.cookie })).status, 401);
  const expired = await login();
  clock = expired.body.expiresAt + 1;
  assert.equal((await request('content', { cookie: expired.cookie })).status, 401);
});

test('password attempts are rate limited and recover after the time window', async () => {
  clock += 16 * 60 * 1000;
  for (let i = 0; i < 60; i++) assert.equal((await request('login', { method: 'POST', body: { password: 'wrong' } })).status, 401);
  assert.equal((await login()).status, 429);
  clock += 16 * 60 * 1000;
  assert.equal((await login()).status, 200);
});
