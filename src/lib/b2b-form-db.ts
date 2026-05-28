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
      CREATE TABLE IF NOT EXISTS b2b_form (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT,
        wallet TEXT,
        organization TEXT,
        role TEXT,
        workflow TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }

  return global.contactDb;
}

export async function addB2bForm(
  email: string,
  fullName?: string,
  wallet?: string | null,
  organization?: string,
  role?: string,
  workflow?: string,
) {
  const db = await getDb();

  try {
    await db`
      INSERT INTO b2b_form (email, full_name, wallet, organization, role, workflow)
      VALUES (${email}, ${fullName || null}, ${wallet || null}, ${organization || null}, ${role || null}, ${workflow || null})
    `;
    return { created: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("duplicate key") &&
      error.message.includes("b2b_form_email_key")
    ) {
      return { created: false };
    }

    throw error;
  }
}
