import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { join, resolve } from 'node:path';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { openStore, publicUser, projectFromRow } from './store.mjs';
import { opaqueToken, digest, hashPassword, verifyPassword, sameToken, sessionCookie, readSessionCookie, LoginLimiter, requestIp } from './security.mjs';
import { ApiError, fail, plainObject, projectData, mediaIds, readyToSubmit, version } from './validation.mjs';
import { decodeUpload } from './images.mjs';
import { createRegistrationService } from './registrations.mjs';

async function jsonBody(req, max = 1024 * 1024) {
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] ?? '')) fail(415, 'Use application/json.');
  if (Number(req.headers['content-length']) > max) fail(413, 'Request is too large.');
  const chunks = []; let length = 0;
  for await (const chunk of req) { length += chunk.length; if (length > max) fail(413, 'Request is too large.'); chunks.push(chunk); }
  try { const body = JSON.parse(Buffer.concat(chunks).toString('utf8')); if (!plainObject(body)) fail(400, 'A JSON object is required.'); return body; }
  catch (error) { if (error instanceof ApiError) throw error; fail(400, 'Invalid JSON.'); }
}
function json(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
  res.end(JSON.stringify(body));
}
function conflict() { fail(409, 'This project has changed. Reload it before trying again.'); }

export async function createApp(options = {}) {
  const dataDir = resolve(options.dataDir ?? '.local-data');
  const db = await openStore(dataDir);
  const now = options.now ?? Date.now;
  const timestamp = () => new Date(now()).toISOString();
  const allowedOrigins = new Set(options.allowedOrigins ?? ['http://127.0.0.1:3001', 'http://localhost:3001', 'http://127.0.0.1:3002', 'http://localhost:3002']);
  const secureCookies = options.secureCookies ?? false;
  const limiter = new LoginLimiter(now);
  const getRequestIp = req => requestIp(req, options.trustProxy);
  const getRow = id => db.prepare('SELECT * FROM projects WHERE id=?').get(id);
  const listRows = user => user.role === 'admin'
    ? db.prepare('SELECT * FROM projects ORDER BY sort_order, updated_at DESC').all()
    : db.prepare('SELECT * FROM projects WHERE owner_id=? ORDER BY sort_order, updated_at DESC').all(user.id);
  function getSession(req) {
    const token = readSessionCookie(req);
    if (!token) return null;
    const row = db.prepare(`SELECT users.*, sessions.csrf, sessions.token_hash FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.token_hash=? AND sessions.expires>? AND users.disabled=0`).get(digest(token), now());
    return row ?? null;
  }
  function authenticate(req) {
    const user = getSession(req);
    if (!user) fail(401, 'Sign in to continue.');
    if (req.method !== 'GET' && !sameToken(req.headers['x-csrf-token'], user.csrf)) fail(403, 'Invalid security token. Reload and try again.');
    return user;
  }
  function sessionResponse(res, user, status = 200) {
    const token = opaqueToken(), csrfToken = opaqueToken();
    db.prepare('DELETE FROM sessions WHERE expires<=?').run(now());
    db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(digest(token), user.id, csrfToken, now() + 86400000);
    json(res, status, { user: publicUser(user), csrfToken }, { 'Set-Cookie': sessionCookie(token, secureCookies) });
  }
  function ownedProject(id, user) {
    const row = getRow(id);
    if (!row || row.owner_id !== user.id && user.role !== 'admin') fail(404, 'Project not found.');
    return row;
  }
  function checkMedia(data, user, previousData) {
    const previousIds = previousData ? new Set(mediaIds(previousData)) : new Set();
    for (const id of mediaIds(data)) {
      const media = db.prepare('SELECT owner_id FROM uploads WHERE id=?').get(id);
      if (!media || media.owner_id !== user.id && user.role !== 'admin' && !previousIds.has(id)) fail(400, 'A project image is unavailable or belongs to another account.');
    }
  }
  function isPublishedMedia(id) {
    return registrations.isPublicMedia(id) || db.prepare('SELECT snapshot FROM published').all().some(row => mediaIds(JSON.parse(row.snapshot).data).includes(id));
  }
  function approvedList() {
    return db.prepare('SELECT published.snapshot, projects.sort_order FROM published JOIN projects ON projects.id=published.project_id ORDER BY projects.sort_order, published.published_at DESC').all()
      .map(row => ({ ...JSON.parse(row.snapshot), order: row.sort_order }));
  }
  const registrations = createRegistrationService({ db, dataDir, now, jsonBody, json, authenticate, getRequestIp });
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const method = req.method;
      if (!['GET', 'POST', 'PATCH'].includes(method)) fail(405, 'Method not allowed.');
      if (method !== 'GET' && !allowedOrigins.has(req.headers.origin)) fail(403, 'Request origin is not allowed.');
      if (await registrations.handle(req, res, path, method)) return;

      if (path === '/api/auth/session' && method === 'GET') {
        const session = getSession(req);
        return json(res, 200, session ? { user: publicUser(session), csrfToken: session.csrf } : { user: null, csrfToken: null });
      }
      if (path === '/api/auth/login' && method === 'POST') {
        const body = await jsonBody(req, 8192);
        if (typeof body.username !== 'string' || typeof body.password !== 'string' || body.username.length > 80 || body.password.length > 128) fail(400, 'Enter a username and password.');
        let username = body.username.trim().toLowerCase();
        if (username === 'dongyijie') username = 'primo';
        const ip = getRequestIp(req);
        if (!limiter.hit(`ip:${ip}`, 30) || !limiter.hit(`user:${username}`, 6)) fail(429, 'Too many sign-in attempts. Try again in 15 minutes.');
        const user = db.prepare('SELECT * FROM users WHERE username=?').get(username);
        // Always run scrypt, including when a name does not exist.
        const stored = user?.password_hash ?? db.prepare('SELECT password_hash FROM users LIMIT 1').get().password_hash;
        const valid = await verifyPassword(body.password, stored);
        if (!user || user.disabled || !valid) fail(401, 'Incorrect username or password.');
        const old = readSessionCookie(req);
        if (old) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(digest(old));
        return sessionResponse(res, user);
      }
      if (path === '/api/auth/logout' && method === 'POST') {
        const user = authenticate(req);
        db.prepare('DELETE FROM sessions WHERE token_hash=?').run(user.token_hash);
        return json(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie('', secureCookies, 0) });
      }
      if (path === '/api/auth/password' && method === 'POST') {
        const user = authenticate(req), body = await jsonBody(req, 8192);
        if (typeof body.currentPassword !== 'string' || typeof body.newPassword !== 'string' || body.currentPassword.length > 128 || body.newPassword.length < 10 || body.newPassword.length > 128 || body.currentPassword === body.newPassword) fail(400, 'Choose a different password with 10–128 characters.');
        if (!await verifyPassword(body.currentPassword, user.password_hash)) fail(401, 'Current password is incorrect.');
        const hash = await hashPassword(body.newPassword);
        db.exec('BEGIN IMMEDIATE');
        try {
          const changed = db.prepare('UPDATE users SET password_hash=?,must_change=0 WHERE id=? AND password_hash=?').run(hash, user.id, user.password_hash);
          if (!changed.changes) conflict();
          db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
          db.exec('COMMIT');
        } catch (error) { db.exec('ROLLBACK'); throw error; }
        return sessionResponse(res, db.prepare('SELECT * FROM users WHERE id=?').get(user.id));
      }
      if (path === '/api/public/projects' && method === 'GET') return json(res, 200, { projects: approvedList() });
      const publicMatch = path.match(/^\/api\/public\/projects\/([a-f0-9-]{36})$/);
      if (publicMatch && method === 'GET') {
        const project = approvedList().find(p => p.id === publicMatch[1]);
        if (!project) fail(404, 'Project not found.');
        return json(res, 200, { project });
      }
      const mediaMatch = path.match(/^\/api\/media\/([a-f0-9-]{36})$/);
      if (mediaMatch && method === 'GET') {
        const media = db.prepare('SELECT * FROM uploads WHERE id=?').get(mediaMatch[1])
          ?? db.prepare("SELECT id,'registration:'||registration_id AS owner_id,name,mime,size,created_at FROM registration_uploads WHERE id=?").get(mediaMatch[1]);
        if (!media) fail(404, 'Image not found.');
        const user = getSession(req), visible = isPublishedMedia(media.id);
        const ownProjectImage = user && db.prepare('SELECT data FROM projects WHERE owner_id=?').all(user.id).some(row => mediaIds(JSON.parse(row.data)).includes(media.id));
        if (!visible && (!user || user.role !== 'admin' && user.id !== media.owner_id && !ownProjectImage)) fail(404, 'Image not found.');
        let bytes;
        try { bytes = await readFile(join(dataDir, 'uploads', media.id)); } catch { fail(404, 'Image not found.'); }
        res.writeHead(200, { 'Content-Type': media.mime, 'Content-Length': bytes.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox", 'Content-Disposition': 'inline', 'Cross-Origin-Resource-Policy': 'same-origin' });
        return res.end(bytes);
      }
      if (path === '/api/uploads' && method === 'POST') {
        const user = authenticate(req), body = await jsonBody(req, 12 * 1024 * 1024);
        if (typeof body.name !== 'string' || body.name.length > 200) fail(400, 'An image filename is required.');
        const { bytes, mime } = decodeUpload(body.data), id = randomUUID();
        const file = join(dataDir, 'uploads', id);
        await writeFile(file, bytes, { mode: 0o600, flag: 'wx' });
        try { db.prepare('INSERT INTO uploads VALUES(?,?,?,?,?,?)').run(id, user.id, body.name, mime, bytes.length, timestamp()); }
        catch (error) { await unlink(file); throw error; }
        return json(res, 201, { url: `/api/media/${id}` });
      }
      if (path === '/api/projects/order' && method === 'PATCH') {
        const user = authenticate(req);
        if (user.role !== 'admin') fail(403, 'Administrator access is required.');
        const body = await jsonBody(req), current = db.prepare('SELECT id FROM projects').all().map(p => p.id);
        if (!Array.isArray(body.ids) || body.ids.length !== current.length || new Set(body.ids).size !== current.length || body.ids.some(id => !current.includes(id))) fail(400, 'The order must include every project exactly once.');
        db.exec('BEGIN IMMEDIATE');
        try { body.ids.forEach((id, index) => db.prepare('UPDATE projects SET sort_order=? WHERE id=?').run(index, id)); db.exec('COMMIT'); }
        catch (error) { db.exec('ROLLBACK'); throw error; }
        return json(res, 200, { projects: listRows(user).map(projectFromRow) });
      }
      if (path === '/api/projects' && method === 'GET') {
        const user = authenticate(req);
        return json(res, 200, { projects: listRows(user).map(projectFromRow) });
      }
      if (path === '/api/projects' && method === 'POST') {
        const user = authenticate(req), body = await jsonBody(req), data = projectData(body.project);
        checkMedia(data, user);
        const id = randomUUID(), order = db.prepare('SELECT COALESCE(MAX(sort_order),-1)+1 AS next FROM projects').get().next;
        db.prepare('INSERT INTO projects(id,owner_id,status,data,updated_at,sort_order) VALUES(?,?,?,?,?,?)').run(id, user.id, 'draft', JSON.stringify(data), timestamp(), order);
        return json(res, 201, { project: projectFromRow(getRow(id)) });
      }
      const projectMatch = path.match(/^\/api\/projects\/([a-f0-9-]{36})(?:\/(submit|review))?$/);
      if (projectMatch) {
        const user = authenticate(req), row = ownedProject(projectMatch[1], user), action = projectMatch[2];
        if (method === 'GET' && !action) return json(res, 200, { project: projectFromRow(row) });
        const body = await jsonBody(req), expected = version(body.version);
        if (row.version !== expected) conflict();
        if (method === 'PATCH' && !action) {
          const data = projectData(body.project); checkMedia(data, user, JSON.parse(row.data));
          // An author save withdraws a submission; its new version invalidates pending reviews.
          // Administrator edits stay submitted so reviewers can save and then approve.
          const nextStatus = user.role === 'admin' && row.status === 'submitted' ? 'submitted' : 'draft';
          const result = db.prepare('UPDATE projects SET data=?,status=?,version=version+1,updated_at=? WHERE id=? AND version=?').run(JSON.stringify(data), nextStatus, timestamp(), row.id, expected);
          if (!result.changes) conflict();
          return json(res, 200, { project: projectFromRow(getRow(row.id)) });
        }
        if (method === 'POST' && action === 'submit') {
          if (!['draft', 'changes'].includes(row.status)) fail(409, 'Only drafts and requested revisions can be submitted.');
          const data = JSON.parse(row.data); readyToSubmit(data);
          const result = db.prepare("UPDATE projects SET status='submitted',feedback='',version=version+1,updated_at=? WHERE id=? AND version=?").run(timestamp(), row.id, expected);
          if (!result.changes) conflict();
          return json(res, 200, { project: projectFromRow(getRow(row.id)) });
        }
        if (method === 'POST' && action === 'review') {
          if (user.role !== 'admin') fail(403, 'Administrator access is required.');
          if (row.status !== 'submitted') fail(409, 'Only submitted projects can be reviewed.');
          if (!['approve', 'changes'].includes(body.decision) || typeof body.feedback !== 'string' || body.feedback.length > 4000) fail(400, 'Invalid review decision or feedback.');
          if (body.decision === 'changes' && !body.feedback.trim()) fail(400, 'Explain the requested changes.');
          const data = JSON.parse(row.data); if (body.decision === 'approve') readyToSubmit(data);
          const date = timestamp(), status = body.decision === 'approve' ? 'approved' : 'changes';
          db.exec('BEGIN IMMEDIATE');
          try {
            const result = db.prepare('UPDATE projects SET status=?,feedback=?,version=version+1,updated_at=?,published_at=CASE WHEN ?=1 THEN ? ELSE published_at END WHERE id=? AND version=? AND status=\'submitted\'').run(status, body.feedback.trim(), date, status === 'approved' ? 1 : 0, date, row.id, expected);
            if (!result.changes) conflict();
            if (status === 'approved') {
              const approved = projectFromRow(getRow(row.id));
              delete approved.feedback;
              db.prepare('INSERT INTO published VALUES(?,?,?) ON CONFLICT(project_id) DO UPDATE SET snapshot=excluded.snapshot,published_at=excluded.published_at').run(row.id, JSON.stringify(approved), date);
            }
            db.exec('COMMIT');
          } catch (error) { db.exec('ROLLBACK'); throw error; }
          return json(res, 200, { project: projectFromRow(getRow(row.id)) });
        }
      }
      fail(404, 'Endpoint not found.');
    } catch (error) {
      if (res.headersSent) return res.end();
      if (!(error instanceof ApiError)) options.onError?.(error);
      json(res, error instanceof ApiError ? error.status : 500, { error: error instanceof ApiError ? error.message : 'The server could not complete the request.' });
    }
  });
  server.requestTimeout = 30000;
  server.headersTimeout = 15000;
  return { server, db, dataDir, close: async () => { if (server.listening) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); db.close(); } };
}
