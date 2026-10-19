import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { fork } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startMediaWorker } from './media-worker-supervisor.mjs';

function fixture() {
  const children = [], timers = new Map(), statuses = [];
  return { children, timers, statuses, options: {
    env: { PORTAL_MEDIA_STORAGE: 'cos', COS_SECRET_KEY: 'never-log-this' },
    forkChild(path, argv, options) {
      const child = new EventEmitter(); child.signals = []; child.pid = 123;
      child.kill = signal => { child.signals.push(signal); if (!child.ignoreTerm || signal === 'SIGKILL') child.emit('exit', 0, signal); return true; };
      children.push({ child, path, argv, options }); return child;
    },
    setTimer(callback, delay) { const token = {}; timers.set(token, { callback, delay }); return token; },
    clearTimer(token) { timers.delete(token); },
    onStatus(status) { statuses.push(status); },
  } };
}

test('local rollback starts no worker; COS forks without credentials in argv or SDK output channels', async () => {
  const ctx = fixture();
  await startMediaWorker({ ...ctx.options, env: {} }).stop();
  assert.equal(ctx.children.length, 0);
  const supervisor = startMediaWorker(ctx.options);
  const { options, argv, path, child } = ctx.children[0];
  assert.match(path, /media-worker\.mjs$/); assert.deepEqual(argv, []);
  assert.deepEqual(options.execArgv, []); assert.deepEqual(options.stdio, ['ignore', 'ignore', 'ignore', 'ipc']);
  child.emit('message', { type: 'unavailable', detail: 'never-log-this' });
  child.emit('message', { type: 'cycle', objects: 3, verified: 2, failed: 1, deferred: 0, secret: 'never-log-this' });
  child.emit('message', { type: 'cycle', objects: 'never-log-this' });
  assert.equal(ctx.statuses.length, 2); assert.equal(JSON.stringify(ctx.statuses).includes('never-log-this'), false);
  await supervisor.stop(); assert.deepEqual(child.signals, ['SIGTERM']);
});

test('a child crash schedules one delayed restart and shutdown cancels future restarts', async () => {
  const ctx = fixture(), supervisor = startMediaWorker(ctx.options);
  ctx.children[0].child.emit('exit', 1);
  const [token, timer] = [...ctx.timers][0];
  assert.equal(timer.delay, 30000); assert.equal(ctx.children.length, 1);
  ctx.timers.delete(token); timer.callback();
  assert.equal(ctx.children.length, 2);
  ctx.children[1].child.emit('exit', 1);
  await supervisor.stop();
  assert.equal(ctx.timers.size, 0);
});

test('shutdown kills an unresponsive child after five seconds and waits for its exit', async () => {
  const ctx = fixture(), supervisor = startMediaWorker(ctx.options), child = ctx.children[0].child;
  child.ignoreTerm = true;
  const stopping = supervisor.stop();
  assert.equal(supervisor.stop(), stopping);
  assert.deepEqual(child.signals, ['SIGTERM']);
  const timer = [...ctx.timers.values()][0]; assert.equal(timer.delay, 5000);
  timer.callback(); await stopping;
  assert.deepEqual(child.signals, ['SIGTERM', 'SIGKILL']); assert.equal(ctx.timers.size, 0);
  assert.equal(ctx.statuses.length, 0);
});

test('a real uncaught child failure cannot terminate the parent or expose raw SDK diagnostics', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'fearlab-worker-crash-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const entry = join(directory, 'crash.mjs');
  await writeFile(entry, "process.send({type:'unavailable', detail:'fake-sensitive-url'}); setTimeout(() => { throw new Error('fake-sensitive-url'); }, 5);\n");
  const statuses = [];
  let crashed;
  const crash = new Promise(resolve => { crashed = resolve; });
  const supervisor = startMediaWorker({ env: { ...process.env, PORTAL_MEDIA_STORAGE: 'cos' },
    forkChild(_entry, argv, options) {
      const child = fork(entry, argv, options);
      assert.equal(child.stdout, null); assert.equal(child.stderr, null);
      return child;
    },
    onStatus(status) { statuses.push(status); if (status.type === 'restarting') crashed(); },
  });
  t.after(() => supervisor.stop());
  await crash;
  await supervisor.stop();
  assert.deepEqual(statuses, [{ type: 'unavailable' }, { type: 'restarting' }]);
});
