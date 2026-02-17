import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

type DatabaseWithInit = Database.Database & {
  __initialized?: boolean;
};

declare global {
  var waitlistDb: DatabaseWithInit | undefined;
}

function getDatabasePath() {
  const configuredPath = process.env.WAITLIST_DB_PATH?.trim();
  return configuredPath || path.join(process.cwd(), 'data', 'waitlist.sqlite');
}

function getDb() {
  if (!global.waitlistDb) {
    const dbPath = getDatabasePath();
    mkdirSync(path.dirname(dbPath), { recursive: true });
    global.waitlistDb = new Database(dbPath);
  }

  if (!global.waitlistDb.__initialized) {
    global.waitlistDb.exec(`
      CREATE TABLE IF NOT EXISTS waitlist_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    global.waitlistDb.__initialized = true;
  }

  return global.waitlistDb;
}

export function addWaitlistEmail(email: string) {
  const db = getDb();

  try {
    db.prepare('INSERT INTO waitlist_subscribers (email) VALUES (?)').run(
      email
    );
    return { created: true };
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'SQLITE_CONSTRAINT_UNIQUE'
    ) {
      return { created: false };
    }

    throw error;
  }
}
