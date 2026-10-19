import { createApp } from './app.mjs';
import { mediaConfigFromEnv } from './media-store.mjs';
import { startMediaWorker } from './media-worker-supervisor.mjs';
const port = Number(process.env.PORT ?? 3002);
const host = process.env.HOST ?? '127.0.0.1';
const app = await createApp({
  dataDir: process.env.PORTAL_DATA_DIR ?? '.local-data',
  mediaConfig: mediaConfigFromEnv(),
  secureCookies: process.env.NODE_ENV === 'production',
  trustProxy: process.env.PORTAL_TRUST_PROXY === 'loopback' ? 'loopback' : undefined,
  ...(process.env.PORTAL_ORIGINS ? { allowedOrigins: process.env.PORTAL_ORIGINS.split(',').map(s => s.trim()).filter(Boolean) } : {}),
  onError: error => console.error('Portal request failed:', error.message),
});
let worker;
app.server.listen(port, host, () => {
  console.log(`FEAR Lab portal API listening at http://${host}:${port}`);
  if (!closing) worker = startMediaWorker({ onStatus: status => console.log('Media replication:', JSON.stringify(status)) });
});
let closing = false;
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => {
  if (closing) return;
  closing = true;
  await Promise.all([worker?.stop(), app.close()]);
  process.exit(0);
});
