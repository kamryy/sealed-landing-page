import postgres from "postgres";

type DbConnection = postgres.Sql;

declare global {
  var contactDb: DbConnection | undefined;
  var dbInitialized: boolean | undefined;
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
  if (global.contactDb) {
    return global.contactDb;
  }

  const connectionString = getConnectionString();
  global.contactDb = postgres(connectionString, {
    max: 1,
  });

  // Initialize table if it doesn't exist
  if (!global.dbInitialized) {
    try {
      await global.contactDb`
        CREATE TABLE IF NOT EXISTS contact_form (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          wallet TEXT,
          message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      global.dbInitialized = true;
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  return global.contactDb;
}

export async function addContactForm(
  email: string,
  wallet?: string,
  message?: string,
) {
  const db = await getDb();

  try {
    await db`
      INSERT INTO contact_form (email, wallet, message)
      VALUES (${email}, ${wallet || null}, ${message || null})
    `;
    return { created: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("duplicate key") &&
      error.message.includes("contact_form_email_key")
    ) {
      return { created: false };
    }

    throw error;
  }
}
