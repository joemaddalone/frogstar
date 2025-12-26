import { db } from "./database";
import { PlannedSet, InsertablePlannedSet } from "@/lib/types";
import { plannedSets, actualSets } from "../db/schema";
import { deleteActualSetsByPlannedSetId } from "./actual_sets";
import { eq } from "drizzle-orm";

export async function createPlannedSet(plannedSet: InsertablePlannedSet): Promise<PlannedSet> {
	const result = await db.insert(plannedSets).values(plannedSet).returning();
	return result[0];
}

export async function getPlannedSets(): Promise<PlannedSet[]> {
	return await db.select().from(plannedSets);
}

export async function getPlannedSet(id: number): Promise<PlannedSet | null> {
	const result = await db.select().from(plannedSets).where(eq(plannedSets.id, id)).get();
	return result ?? null;
}

export async function updatePlannedSet(id: number, plannedSet: InsertablePlannedSet): Promise<PlannedSet | null> {
	const result = await db.update(plannedSets).set(plannedSet).where(eq(plannedSets.id, id)).returning();
	return result[0] ?? null;
}

export async function deletePlannedSet(id: number): Promise<void> {
	await db.delete(plannedSets).where(eq(plannedSets.id, id));
}

export async function deletePlannedSetsBySessionId(sessionId: number): Promise<void> {
	await db.delete(plannedSets).where(eq(plannedSets.sessionId, sessionId));
}