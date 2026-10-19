import { resolve } from 'node:path';
import { createMediaReplicator } from './media-replication.mjs';
import { mediaConfigFromEnv } from './media-store.mjs';

// SDK transport errors have caused uncaught EPIPE in production. This process
// may die at any point: it never mutates the local retry source or the DB.
const exit = () => process.exit(1);
process.on('uncaughtException', exit);
process.on('unhandledRejection', exit);
process.once('disconnect', () => process.exit(0));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => process.exit(0));

try {
  const replicator = await createMediaReplicator({
    dataDir: resolve(process.env.PORTAL_DATA_DIR ?? '.local-data'), config: mediaConfigFromEnv(),
  });
  async function scan() {
    // Bound even a connection that never stalls long enough for SDK timeout.
    const watchdog = setTimeout(exit, 15 * 60 * 1000);
    try {
      const result = await replicator.runOnce();
      process.send?.({ type: 'cycle', ...result });
    } catch { process.send?.({ type: 'unavailable' }); }
    finally { clearTimeout(watchdog); }
    setTimeout(scan, 60000);
  }
  await scan();
} catch { exit(); }
