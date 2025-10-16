import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable("users")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("email", "varchar(255)", (col) => col.notNull().unique())
		.addColumn("password", "varchar(255)", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable("users").execute();
}
