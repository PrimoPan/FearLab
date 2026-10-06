import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { hashPassword } from './security.mjs';

export const roster = [
  ['mirjana', 'Mirjana Prpa', 'admin'], ['hongni', 'Hongni Ye', 'member'],
  ['mengxu', 'Mengxu Pan', 'member'], ['primo', 'Dongyijie Primo Pan', 'admin'],
  ['qiyuan', 'Qiyuan Cheng', 'member'], ['xingyu', 'Xingyu Gao', 'member'], ['euphie', 'Euphie Yang', 'member'],
];
export async function openStore(dataDir) {
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  mkdirSync(join(dataDir, 'uploads'), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(join(dataDir, 'portal.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','member')),
      password_hash TEXT NOT NULL, must_change INTEGER NOT NULL DEFAULT 1, disabled INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id),
      status TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, feedback TEXT NOT NULL DEFAULT '',
      data TEXT NOT NULL, updated_at TEXT NOT NULL, published_at TEXT, sort_order INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS published(project_id TEXT PRIMARY KEY REFERENCES projects(id),
      snapshot TEXT NOT NULL, published_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS uploads(id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS project_owner ON projects(owner_id);
    CREATE INDEX IF NOT EXISTS session_user ON sessions(user_id);
    CREATE TABLE IF NOT EXISTS registrations(id TEXT PRIMARY KEY, username TEXT NOT NULL,
      password_hash TEXT NOT NULL, profile TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')),
      version INTEGER NOT NULL DEFAULT 1, feedback TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL,
      reviewed_at TEXT, reviewed_by TEXT REFERENCES users(id));
    CREATE UNIQUE INDEX IF NOT EXISTS pending_registration_username ON registrations(username) WHERE status='pending';
    CREATE TABLE IF NOT EXISTS registration_uploads(id TEXT PRIMARY KEY, registration_id TEXT NOT NULL REFERENCES registrations(id),
      name TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS people_profiles(user_id TEXT PRIMARY KEY REFERENCES users(id),
      registration_id TEXT UNIQUE NOT NULL REFERENCES registrations(id), profile TEXT NOT NULL, published_at TEXT NOT NULL);
  `);
  if (!db.prepare('PRAGMA table_info(users)').all().some(column => column.name === 'disabled')) {
    db.exec('ALTER TABLE users ADD COLUMN disabled INTEGER NOT NULL DEFAULT 0');
  }
  for (const [username, name, role] of roster) {
    if (!db.prepare('SELECT id FROM users WHERE username=?').get(username)) {
      db.prepare('INSERT INTO users(id,username,name,role,password_hash) VALUES(?,?,?,?,?)')
        .run(username, username, name, role, await hashPassword('123456'));
    }
    db.prepare('UPDATE users SET name=? WHERE username=?').run(name, username);
  }
  return db;
}
// Keep the existing database flag as credential metadata, not an access restriction.
export const publicUser = row => ({ id: row.id, username: row.username, name: row.name, role: row.role, usingInitialPassword: Boolean(row.must_change) });
export const projectFromRow = row => ({
  id: row.id, ownerId: row.owner_id, status: row.status, version: row.version, feedback: row.feedback,
  data: JSON.parse(row.data), updatedAt: row.updated_at, publishedAt: row.published_at, order: row.sort_order,
});
