// Explicit, one-time cancellation of the manually provisioned Mandi account.
// Never run at startup: an approved self-registration must remain enabled.
import { openStore } from './store.mjs';
const db = await openStore(process.env.PORTAL_DATA_DIR ?? '.local-data');
try {
  db.exec('BEGIN IMMEDIATE');
  const user = db.prepare("SELECT * FROM users WHERE username='mandi'").get();
  if (!user) console.log('No manually provisioned Mandi account exists.');
  else if (user.role !== 'member' || db.prepare('SELECT user_id FROM people_profiles WHERE user_id=?').get(user.id)) {
    throw new Error('Refusing to disable an administrator or an approved registration.');
  } else {
    db.prepare('UPDATE users SET disabled=1 WHERE id=?').run(user.id);
    db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
    console.log('Mandi seed account disabled and sessions revoked; records preserved.');
  }
  db.exec('COMMIT');
} catch (error) { db.exec('ROLLBACK'); throw error; }
finally { db.close(); }
