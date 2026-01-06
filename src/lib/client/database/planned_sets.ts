import { plannedSets } from "@/db/schema";
import { createRepository } from "@/lib/client/database/repository";
import { db } from "@/lib/client/database/database";
import { eq } from "drizzle-orm";

const repository = createRepository(plannedSets);

export const createPlannedSet = repository.create;
export const getPlannedSets = repository.list;
export const getPlannedSet = repository.get;
export const updatePlannedSet = repository.update;
export const deletePlannedSet = repository.remove;


export async function deletePlannedSetsBySessionId(sessionId: number): Promise<void> {
	await db.delete(plannedSets).where(eq(plannedSets.sessionId, sessionId));
}