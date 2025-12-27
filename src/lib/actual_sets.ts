import { db } from "@/lib/database";
import { ActualSet, InsertableActualSet } from "@/lib/types";
import { actualSets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createActualSet(actualSet: InsertableActualSet): Promise<ActualSet> {
	const result = await db.insert(actualSets).values(actualSet).returning();
	return result[0];
}

export async function getActualSets(): Promise<ActualSet[]> {
	return await db.select().from(actualSets);
}

export async function getActualSet(id: number): Promise<ActualSet | null> {
	const result = await db.select().from(actualSets).where(eq(actualSets.id, id)).get();
	return result ?? null;
}

export async function updateActualSet(id: number, actualSet: InsertableActualSet): Promise<ActualSet | null> {
	const result = await db.update(actualSets).set(actualSet).where(eq(actualSets.id, id)).returning();
	return result[0] ?? null;
}

export async function deleteActualSet(id: number): Promise<void> {
	await db.delete(actualSets).where(eq(actualSets.id, id));
}

export async function deleteActualSetsByPlannedSetId(plannedSetId: number): Promise<void> {
	await db.delete(actualSets).where(eq(actualSets.plannedSetId, plannedSetId));
}

export async function getActualSetsByPlannedSetId(plannedSetId: number): Promise<ActualSet[]> {
	return await db.select().from(actualSets).where(eq(actualSets.plannedSetId, plannedSetId));
}




