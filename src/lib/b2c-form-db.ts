import postgres from "postgres";

type DbConnection = postgres.Sql;

declare global {
  var contactDb: DbConnection | undefined;
  var lastDatabaseUrl: string | undefined;
}

function getConnectionString(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please configure your Neon connection string.",
    );
  }

  return databaseUrl;
}

async function getDb(): Promise<DbConnection> {
  const connectionString = getConnectionString();

  // If DATABASE_URL changed or connection doesn't exist, create new one
  if (!global.contactDb || global.lastDatabaseUrl !== connectionString) {
    global.contactDb = postgres(connectionString, {
      max: 1,
    });
    global.lastDatabaseUrl = connectionString;
  }

  // Always try to ensure table exists
  try {
    await global.contactDb`
      CREATE TABLE IF NOT EXISTS b2c_form (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        wallet TEXT,
        platform TEXT,
        handle TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }

  return global.contactDb;
}

export async function addB2cForm(
  email: string,
  wallet?: string | null,
  platform?: string,
  handle?: string,
) {
  const db = await getDb();

  try {
    await db`
      INSERT INTO b2c_form (email, wallet, platform, handle)
      VALUES (${email}, ${wallet || null}, ${platform || null}, ${handle || null})
    `;
    return { created: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("duplicate key") &&
      error.message.includes("b2c_form_email_key")
    ) {
      return { created: false };
    }

    throw error;
  }
}
