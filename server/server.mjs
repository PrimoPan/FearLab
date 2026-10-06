import { createApp } from './app.mjs';
const port = Number(process.env.PORT ?? 3002);
const host = process.env.HOST ?? '127.0.0.1';
const app = await createApp({
  dataDir: process.env.PORTAL_DATA_DIR ?? '.local-data',
  secureCookies: process.env.NODE_ENV === 'production',
  trustProxy: process.env.PORTAL_TRUST_PROXY === 'loopback' ? 'loopback' : undefined,
  ...(process.env.PORTAL_ORIGINS ? { allowedOrigins: process.env.PORTAL_ORIGINS.split(',').map(s => s.trim()).filter(Boolean) } : {}),
  onError: error => console.error('Portal request failed:', error.message),
});
app.server.listen(port, host, () => console.log(`FEAR Lab portal API listening at http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await app.close(); process.exit(0); });
