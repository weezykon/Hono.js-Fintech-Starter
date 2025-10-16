import * as dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

dotenv.config();

import type { User } from "./types";

interface Database {
	users: User;
}

// Validate database connection string
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is required");
}

// Configure connection pool with proper settings
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 20, // Maximum number of clients in the pool
	idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
	connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
	maxUses: 7500, // Close and replace connections after 7500 uses
});

// Handle pool errors
pool.on("error", (err) => {
	console.error("Unexpected error on idle database client", err);
});

const dialect = new PostgresDialect({
	pool,
});

export const db = new Kysely<Database>({ dialect });

// Validate database connection on startup
export async function validateDatabaseConnection(): Promise<void> {
	try {
		// Just test the connection with a simple query, don't require tables to exist
		await db.selectNoFrom((eb) => eb.val(1).as("test")).execute();
		console.log("Database connection validated successfully");
	} catch (error) {
		console.error("Failed to connect to database:", error);
		throw new Error("Database connection failed");
	}
}
