import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { isIP } from 'node:net';

const scrypt = promisify(scryptCallback);
const loopbackPeers = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
export function requestIp(req, trustProxy) {
  const peer = req.socket.remoteAddress ?? 'unknown';
  const forwarded = req.headers['x-real-ip'];
  // Only the explicitly trusted local reverse proxy may replace the socket peer.
  // It must overwrite X-Real-IP; lists, duplicate headers and arbitrary XFF are ignored.
  if (trustProxy === 'loopback' && loopbackPeers.has(peer) && typeof forwarded === 'string' && isIP(forwarded)) return forwarded;
  return peer;
}
export const opaqueToken = () => randomBytes(32).toString('base64url');
export const digest = (value) => createHash('sha256').update(value).digest('hex');
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
  const [salt, value] = stored.split(':');
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(value, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function sameToken(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aa = Buffer.from(a), bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export function sessionCookie(token, secure = false, maxAge = 86400) {
  return `fearlab_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}
export function readSessionCookie(req) {
  const value = req.headers.cookie?.split(';').map(s => s.trim()).find(s => s.startsWith('fearlab_session='))?.slice(16);
  return value && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
}
export class LoginLimiter {
  constructor(now = Date.now) { this.now = now; this.entries = new Map(); }
  hit(key, maximum) {
    const now = this.now();
    if (this.entries.size > 10000) for (const [k, v] of this.entries) if (v.expires <= now) this.entries.delete(k);
    const previous = this.entries.get(key);
    const entry = previous && previous.expires > now ? previous : { count: 0, expires: now + 15 * 60 * 1000 };
    entry.count += 1;
    this.entries.set(key, entry);
    return entry.count <= maximum;
  }
}
