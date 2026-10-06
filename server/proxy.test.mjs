import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.mjs';
import { requestIp } from './security.mjs';

const request = (peer = '127.0.0.1', forwarded = '198.51.100.10') => ({
  socket: { remoteAddress: peer }, headers: { 'x-real-ip': forwarded, 'x-forwarded-for': '203.0.113.99' },
});

test('client IP headers require explicit loopback trust', () => {
  for (const trust of [undefined, false, true, 'all']) assert.equal(requestIp(request(), trust), '127.0.0.1');
  for (const peer of ['127.0.0.1', '::1', '::ffff:127.0.0.1']) {
    assert.equal(requestIp(request(peer), 'loopback'), '198.51.100.10');
    assert.equal(requestIp(request(peer, '2001:db8::10'), 'loopback'), '2001:db8::10');
  }
  for (const peer of ['198.51.100.20', '192.168.1.1', '127.0.0.2', '::ffff:198.51.100.20']) {
    assert.equal(requestIp(request(peer), 'loopback'), peer);
  }
});

test('trusted proxy rejects malformed or multiple client IPs and never uses X-Forwarded-For', () => {
  for (const forwarded of ['', 'invalid', '198.51.100.1, 198.51.100.2', ' 198.51.100.1', '198.51.100.1:443', ['198.51.100.1']]) {
    assert.equal(requestIp(request('127.0.0.1', forwarded), 'loopback'), '127.0.0.1');
  }
  const missing = request();
  delete missing.headers['x-real-ip'];
  assert.equal(requestIp(missing, 'loopback'), '127.0.0.1');
  assert.equal(requestIp({ socket: {}, headers: { 'x-real-ip': '198.51.100.10' } }, 'loopback'), 'unknown');
});

for (const trustProxy of [undefined, 'loopback']) {
  test(`login and registration use the same client-IP policy (${trustProxy ?? 'untrusted'})`, async () => {
    const directory = await mkdtemp(join(tmpdir(), 'fearlab-proxy-'));
    const origin = 'https://fearlab.example';
    let app;
    try {
      app = await createApp({ dataDir: directory, allowedOrigins: [origin], trustProxy });
      await new Promise((resolve, reject) => { app.server.once('error', reject); app.server.listen(0, '127.0.0.1', resolve); });
      const base = `http://127.0.0.1:${app.server.address().port}`;
      const post = async (path, body, ip = '198.51.100.10') => {
        const response = await fetch(`${base}${path}`, {
          method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'X-Real-IP': ip }, body: JSON.stringify(body),
        });
        await response.arrayBuffer();
        return response.status;
      };
      // Distinct nonexistent usernames exercise the IP bucket rather than the username bucket.
      for (let index = 0; index < 30; index++) {
        assert.equal(await post('/api/auth/login', { username: `missing_${index}`, password: 'incorrect' }), 401);
      }
      assert.equal(await post('/api/auth/login', { username: 'limited', password: 'incorrect' }), 429);
      assert.equal(await post('/api/auth/login', { username: 'different_ip', password: 'incorrect' }, '198.51.100.11'), trustProxy ? 401 : 429);
      // Validation failures count too, without creating any applicant records or files.
      for (let index = 0; index < 12; index++) assert.equal(await post('/api/registrations', {}), 400);
      assert.equal(await post('/api/registrations', {}), 429);
      assert.equal(await post('/api/registrations', {}, '198.51.100.11'), trustProxy ? 400 : 429);
    } finally {
      if (app) await app.close();
      await rm(directory, { recursive: true, force: true });
    }
  });
}
