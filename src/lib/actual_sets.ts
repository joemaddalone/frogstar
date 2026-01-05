import { actualSets } from "@/db/schema";
import { createRepository } from "./repository";
import { db } from "@/lib/database";
import { eq } from "drizzle-orm";
import { ActualSet } from "@/lib/types";

const repository = createRepository(actualSets);

export const createActualSet = repository.create;
export const getActualSets = repository.list;
export const getActualSet = repository.get;
export const updateActualSet = repository.update;
export const deleteActualSet = repository.remove;

export async function deleteActualSetsByPlannedSetId(plannedSetId: number): Promise<void> {
	await db.delete(actualSets).where(eq(actualSets.plannedSetId, plannedSetId));
}

export async function getActualSetsByPlannedSetId(plannedSetId: number): Promise<ActualSet[]> {
	return await db.select().from(actualSets).where(eq(actualSets.plannedSetId, plannedSetId));
}




