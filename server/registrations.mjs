import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { writeFile, unlink } from 'node:fs/promises';
import { fail, plainObject, safeLink } from './validation.mjs';
import { decodeUpload } from './images.mjs';
import { hashPassword, LoginLimiter } from './security.mjs';

const positions = { phd: 'PhD Student', mphil: 'MPhil Student', ra: 'Research Assistant' };
function text(value, label, maximum, optional = false) {
  if (optional && value === undefined) return '';
  if (typeof value !== 'string' || value.length > maximum || (!optional && !value.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) fail(400, `Enter a valid ${label}.`);
  return value.trim();
}
export function registrationProfile(value) {
  if (!plainObject(value)) fail(400, 'A profile is required.');
  if (!Object.hasOwn(positions, value.position)) fail(400, 'Choose PhD, MPhil or Research Assistant.');
  if (!Array.isArray(value.emails) || value.emails.length < 1 || value.emails.length > 3) fail(400, 'Add one to three public email addresses.');
  const emails = value.emails.map(email => text(email, 'email address', 254));
  if (emails.some(email => !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) || new Set(emails.map(email => email.toLowerCase())).size !== emails.length) fail(400, 'Enter distinct, valid email addresses.');
  if (!Array.isArray(value.bioParagraphs) || value.bioParagraphs.length < 1 || value.bioParagraphs.length > 12) fail(400, 'Add one to twelve biography paragraphs.');
  const bioParagraphs = value.bioParagraphs.map(paragraph => text(paragraph, 'biography paragraph', 8000));
  if (bioParagraphs.join('\n\n').length > 8000) fail(400, 'Keep the biography within 8,000 characters.');
  return {
    name: text(value.name, 'full name', 120), position: value.position, emails,
    website: safeLink(text(value.website, 'website', 2000, true)),
    researchInterest: text(value.researchInterest, 'research interests', 1000), bioParagraphs,
    lifePhotoAlt: text(value.lifePhotoAlt, 'lifestyle photo description', 300),
  };
}
function registrationFromRow(row) {
  return { id: row.id, username: row.username, status: row.status, version: row.version,
    profile: JSON.parse(row.profile), feedback: row.feedback, createdAt: row.created_at, reviewedAt: row.reviewed_at };
}
function personFromProfile(username, profile) {
  return { slug: `member-${username}`, name: profile.name, groupKey: profile.position,
    positionLabel: positions[profile.position], emails: profile.emails, website: profile.website,
    researchInterest: profile.researchInterest, bioParagraphs: profile.bioParagraphs,
    idPhoto: profile.idPhoto, lifePhoto: profile.lifePhoto, lifePhotoAlt: profile.lifePhotoAlt,
    storySide: 'right', photoPositionDesktop: '50% 50%', photoPositionMobile: '50% 50%' };
}

export function createRegistrationService({ db, dataDir, now, jsonBody, json, authenticate, getRequestIp }) {
  const limiter = new LoginLimiter(now);
  const timestamp = () => new Date(now()).toISOString();
  const rowById = id => db.prepare('SELECT * FROM registrations WHERE id=?').get(id);
  const people = () => db.prepare('SELECT profile FROM people_profiles JOIN users ON users.id=people_profiles.user_id WHERE users.disabled=0 ORDER BY published_at, user_id').all().map(row => JSON.parse(row.profile));
  function available(username) {
    const user = db.prepare('SELECT role,disabled FROM users WHERE username=?').get(username);
    // Disabled members can reapply; administrator identities can never be claimed.
    if (username === 'dongyijie' || user && (!user.disabled || user.role !== 'member') || db.prepare("SELECT id FROM registrations WHERE username=? AND status='pending'").get(username)) {
      fail(409, 'This username is already in use or awaiting review. Choose another username.');
    }
  }
  function admin(req) {
    const user = authenticate(req);
    if (user.role !== 'admin') fail(403, 'Administrator access is required.');
    return user;
  }
  async function submit(req, res) {
    const ip = getRequestIp(req);
    if (!limiter.hit(`registration:${ip}`, 12)) fail(429, 'Too many registration attempts. Try again in 15 minutes.');
    const body = await jsonBody(req, 24 * 1024 * 1024);
    const username = text(body.username, 'username', 40).toLowerCase();
    if (!/^[a-z][a-z0-9_-]{2,39}$/.test(username)) fail(400, 'Use 3–40 letters, numbers, underscores or hyphens, starting with a letter.');
    if (typeof body.password !== 'string' || body.password.length < 10 || body.password.length > 128) fail(400, 'Choose a password with 10–128 characters.');
    const profile = registrationProfile(body.profile);
    available(username);
    const images = ['portrait', 'lifePhoto'].map(key => {
      const image = body[key];
      if (!plainObject(image)) fail(400, 'Upload both a portrait and a lifestyle photo.');
      const name = text(image.name, 'image filename', 200);
      return { ...decodeUpload(image.data), name, id: randomUUID() };
    });
    const id = randomUUID(), written = [], passwordHash = await hashPassword(body.password);
    profile.idPhoto = `/api/media/${images[0].id}`;
    profile.lifePhoto = `/api/media/${images[1].id}`;
    try {
      for (const image of images) {
        const file = join(dataDir, 'uploads', image.id);
        await writeFile(file, image.bytes, { mode: 0o600, flag: 'wx' });
        written.push(file);
      }
      db.exec('BEGIN IMMEDIATE');
      try {
        available(username);
        const date = timestamp();
        db.prepare("INSERT INTO registrations(id,username,password_hash,profile,status,created_at) VALUES(?,?,?,?,'pending',?)").run(id, username, passwordHash, JSON.stringify(profile), date);
        for (const image of images) db.prepare('INSERT INTO registration_uploads VALUES(?,?,?,?,?,?)').run(image.id, id, image.name, image.mime, image.bytes.length, date);
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    } catch (error) {
      await Promise.all(written.map(file => unlink(file).catch(() => {})));
      throw error;
    }
    json(res, 201, { registration: { id, status: 'pending', username } });
  }
  async function review(req, res, id) {
    const reviewer = admin(req), body = await jsonBody(req, 8192);
    if (!['approve', 'reject'].includes(body.decision) || !Number.isInteger(body.version) || body.version < 1) fail(400, 'Choose a valid review decision and version.');
    const feedback = text(body.feedback, 'review feedback', 4000, true);
    if (body.decision === 'reject' && !feedback) fail(400, 'Explain why this registration was rejected.');
    db.exec('BEGIN IMMEDIATE');
    try {
      const row = rowById(id);
      if (!row) fail(404, 'Registration not found.');
      if (row.status !== 'pending' || row.version !== body.version) fail(409, 'This registration has changed or already been reviewed. Reload it before trying again.');
      const profile = JSON.parse(row.profile), date = timestamp();
      if (body.decision === 'approve') {
        const existing = db.prepare('SELECT * FROM users WHERE username=?').get(row.username);
        if (existing && (!existing.disabled || existing.role !== 'member')) fail(409, 'This username is already assigned to an active account.');
        const userId = existing?.id ?? randomUUID();
        if (existing) {
          db.prepare('UPDATE users SET name=?,password_hash=?,must_change=0,disabled=0 WHERE id=? AND disabled=1 AND role=\'member\'').run(profile.name, row.password_hash, userId);
          db.prepare('DELETE FROM sessions WHERE user_id=?').run(userId);
        } else {
          db.prepare("INSERT INTO users(id,username,name,role,password_hash,must_change,disabled) VALUES(?,?,?,'member',?,0,0)").run(userId, row.username, profile.name, row.password_hash);
        }
        db.prepare('INSERT INTO people_profiles(user_id,registration_id,profile,published_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET registration_id=excluded.registration_id,profile=excluded.profile,published_at=excluded.published_at').run(userId, id, JSON.stringify(personFromProfile(row.username, profile)), date);
        db.prepare('INSERT INTO uploads(id,owner_id,name,mime,size,created_at) SELECT id,?,name,mime,size,created_at FROM registration_uploads WHERE registration_id=?').run(userId, id);
        db.prepare('DELETE FROM registration_uploads WHERE registration_id=?').run(id);
      }
      db.prepare('UPDATE registrations SET status=?,feedback=?,version=version+1,reviewed_at=?,reviewed_by=? WHERE id=?').run(body.decision === 'approve' ? 'approved' : 'rejected', feedback, date, reviewer.id, id);
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    json(res, 200, { registration: registrationFromRow(rowById(id)) });
  }
  return {
    isPublicMedia: id => people().some(person => [person.idPhoto, person.lifePhoto].includes(`/api/media/${id}`)),
    async handle(req, res, path, method) {
      if (path === '/api/public/people' && method === 'GET') { json(res, 200, { people: people() }); return true; }
      if (path === '/api/registrations' && method === 'POST') { await submit(req, res); return true; }
      if (path === '/api/registrations' && method === 'GET') {
        admin(req);
        json(res, 200, { registrations: db.prepare('SELECT * FROM registrations ORDER BY created_at DESC, id').all().map(registrationFromRow) });
        return true;
      }
      const match = path.match(/^\/api\/registrations\/([a-f0-9-]{36})\/review$/);
      if (match && method === 'POST') { await review(req, res, match[1]); return true; }
      return false;
    },
  };
}
