import { db } from "./database";
import { eq } from "drizzle-orm";
import type { SQLiteTableWithColumns, AnySQLiteColumn } from "drizzle-orm/sqlite-core";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyTable = SQLiteTableWithColumns<any> & { id: AnySQLiteColumn; };
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Creates a generic repository for a Drizzle table.
 * Assumes the table has an 'id' column of type number.
 */
export function createRepository<
	TTable extends AnyTable,
	TSelect = TTable["$inferSelect"],
	TInsert = TTable["$inferInsert"]
>(table: TTable) {
	return {
		async create(values: TInsert): Promise<TSelect> {
			// @ts-expect-error - Generic Drizzle types can be complex for the compiler to unify
			const result = await db.insert(table).values(values).returning();
			return (result as unknown as TSelect[])[0];
		},

		async list(): Promise<TSelect[]> {
			return await db.select().from(table) as unknown as TSelect[];
		},

		async get(id: number): Promise<TSelect | null> {
			const result = await db.select().from(table).where(eq(table.id, id)).get();
			return (result as unknown as TSelect) ?? null;
		},

		async update(id: number, values: Partial<TInsert>): Promise<TSelect | null> {
			const result = await db
				.update(table)
				// @ts-expect-error - Generic Drizzle types can be complex for the compiler to unify
				.set(values)
				.where(eq(table.id, id))
				.returning();
			return (result as unknown as TSelect[])[0] ?? null;
		},

		async remove(id: number): Promise<void> {
			await db.delete(table).where(eq(table.id, id));
		},
	};
}
