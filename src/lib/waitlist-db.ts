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

  if (configuredPath) {
    return path.isAbsolute(configuredPath)
      ? configuredPath
      : path.join(process.cwd(), configuredPath);
  }

  if (process.env.VERCEL) {
    return '/tmp/waitlist.sqlite';
  }

  return path.join(process.cwd(), 'data', 'waitlist.sqlite');
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
        wallet TEXT,
        nickname TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add columns if table already exists from an older schema
    const cols = global.waitlistDb
      .prepare('PRAGMA table_info(waitlist_subscribers)')
      .all() as { name: string }[];
    const colNames = new Set(cols.map((c) => c.name));
    if (!colNames.has('wallet')) {
      global.waitlistDb.exec(
        'ALTER TABLE waitlist_subscribers ADD COLUMN wallet TEXT'
      );
    }
    if (!colNames.has('nickname')) {
      global.waitlistDb.exec(
        'ALTER TABLE waitlist_subscribers ADD COLUMN nickname TEXT'
      );
    }

    global.waitlistDb.__initialized = true;
  }

  return global.waitlistDb;
}

export function addWaitlistEmail(
  email: string,
  wallet?: string,
  nickname?: string
) {
  const db = getDb();

  try {
    db.prepare(
      'INSERT INTO waitlist_subscribers (email, wallet, nickname) VALUES (?, ?, ?)'
    ).run(email, wallet || null, nickname || null);
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
