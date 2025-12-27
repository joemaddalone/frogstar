import { db } from "@/lib/database";
import { Barbell, InsertableBarbell } from "@/lib/types";
import { barbells } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createBarbell(barbell: InsertableBarbell): Promise<Barbell> {
	const result = await db.insert(barbells).values(barbell).returning();
	return result[0];
}

export async function getBarbells(): Promise<Barbell[]> {
	return await db.select().from(barbells);
}

export async function getBarbell(id: number): Promise<Barbell | null> {
	const result = await db.select().from(barbells).where(eq(barbells.id, id)).get();
	return result ?? null;
}

export async function updateBarbell(id: number, barbell: InsertableBarbell): Promise<Barbell | null> {
	const result = await db.update(barbells).set(barbell).where(eq(barbells.id, id)).returning();
	return result[0] ?? null;
}

export async function deleteBarbell(id: number): Promise<void> {
	await db.delete(barbells).where(eq(barbells.id, id));
}
