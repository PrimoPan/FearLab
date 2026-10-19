import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Keep raw child stdout/stderr and SDK error objects out of application logs.
// Credentials are inherited through the environment, never placed in argv.
export function startMediaWorker({ env = process.env, forkChild = fork, setTimer = setTimeout, clearTimer = clearTimeout,
  onStatus = () => {}, restartDelay = 30000, stopTimeout = 5000 } = {}) {
  if (env.PORTAL_MEDIA_STORAGE !== 'cos') return { stop: async () => {} };
  let child, restart, stopped = false, stopping;
  function launch() {
    if (stopped) return;
    let current;
    try {
      current = forkChild(fileURLToPath(new URL('./media-worker.mjs', import.meta.url)), [], {
        env, execArgv: [], stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
      });
    } catch { scheduleRestart(); return; }
    child = current;
    let ended = false;
    function end() {
      if (ended) return;
      ended = true;
      if (child === current) child = undefined;
      scheduleRestart();
    }
    current.once('exit', end);
    let failed = false;
    current.on('error', () => {
      if (failed) return;
      failed = true;
      // An IPC error need not mean the child has exited. Kill and wait before
      // restarting, so there can never be two replication processes at once.
      if (current.pid) current.kill('SIGKILL');
      else end();
    });
    current.on('message', message => {
      if (message?.type === 'unavailable') onStatus({ type: 'unavailable' });
      else if (message?.type === 'cycle' && ['objects', 'verified', 'failed', 'deferred'].every(key => Number.isSafeInteger(message[key]) && message[key] >= 0)) {
        onStatus({ type: 'cycle', objects: message.objects, verified: message.verified, failed: message.failed, deferred: message.deferred });
      }
    });
  }
  function scheduleRestart() {
    if (stopped || restart) return;
    onStatus({ type: 'restarting' });
    restart = setTimer(() => { restart = undefined; launch(); }, restartDelay);
  }
  launch();
  return {
    stop() {
      if (stopping) return stopping;
      stopped = true;
      if (restart) { clearTimer(restart); restart = undefined; }
      const current = child;
      if (!current) return Promise.resolve();
      stopping = new Promise(resolve => {
        const finish = () => { clearTimer(killTimer); resolve(); };
        const killTimer = setTimer(() => { current.kill('SIGKILL'); }, stopTimeout);
        current.once('exit', finish);
        current.kill('SIGTERM');
      });
      return stopping;
    },
  };
}
