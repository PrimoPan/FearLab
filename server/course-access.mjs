import { readFileSync } from 'node:fs';
import { digest, opaqueToken, verifyPassword, LoginLimiter } from './security.mjs';
import { fail } from './validation.mjs';
import { defaultCoursePasswordHash } from './course-password.mjs';

const content = JSON.parse(readFileSync(new URL('./course-content.json', import.meta.url), 'utf8'));
const lifetime = 8 * 60 * 60 * 1000;
const cookieName = 'fearlab_course';

export function createCourseAccess({ now, secureCookies, getRequestIp, jsonBody, json, passwordHash = process.env.COURSE_PASSWORD_HASH ?? defaultCoursePasswordHash }) {
  if (!/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(passwordHash)) throw new Error('Invalid COURSE_PASSWORD_HASH configuration.');
  const sessions = new Map();
  const limiter = new LoginLimiter(now);

  function readToken(req) {
    const token = req.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
  }

  function cookie(token, clear = false) {
    return `${cookieName}=${token}; Path=/api/course; HttpOnly; SameSite=Strict${secureCookies ? '; Secure' : ''}${clear ? '; Max-Age=0' : ''}`;
  }

  function session(req) {
    const token = readToken(req);
    if (!token) return null;
    const key = digest(token), expiresAt = sessions.get(key);
    if (!expiresAt || expiresAt <= now()) { sessions.delete(key); return null; }
    return { key, expiresAt };
  }

  return {
    async handle(req, res, path, method) {
      if (!path.startsWith('/api/course/')) return false;
      if (path === '/api/course/content' && method === 'GET') {
        const current = session(req);
        if (!current) fail(401, 'Enter the course password to continue.');
        json(res, 200, { ...content, expiresAt: current.expiresAt });
        return true;
      }
      if (path === '/api/course/login' && method === 'POST') {
        const body = await jsonBody(req, 2048);
        if (typeof body.password !== 'string' || !body.password || body.password.length > 128) fail(400, 'Enter the course password.');
        if (!limiter.hit(`course:${getRequestIp(req)}`, 60)) fail(429, 'Too many attempts. Please try again in 15 minutes.');
        if (!await verifyPassword(body.password, passwordHash)) fail(401, 'Incorrect password. Please try again.');
        for (const [key, expiresAt] of sessions) if (expiresAt <= now()) sessions.delete(key);
        const old = readToken(req);
        if (old) sessions.delete(digest(old));
        const token = opaqueToken(), expiresAt = now() + lifetime;
        sessions.set(digest(token), expiresAt);
        json(res, 200, { ...content, expiresAt }, { 'Set-Cookie': cookie(token) });
        return true;
      }
      if (path === '/api/course/logout' && method === 'POST') {
        await jsonBody(req, 1024);
        const token = readToken(req);
        if (token) sessions.delete(digest(token));
        json(res, 200, { ok: true }, { 'Set-Cookie': cookie('', true) });
        return true;
      }
      fail(404, 'Endpoint not found.');
    },
  };
}
