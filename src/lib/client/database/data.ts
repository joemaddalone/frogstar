import pkg from "../../../../package.json";
import { db } from "@/lib/client/database/database";
import { barbells, plates, exercises, plannedSets, actualSets, sessions } from "@/db/schema";
import type { Barbell, Plate, Exercise, PlannedSet, ActualSet, Session } from "@/lib/types";

export const exportData = async () => {
	return {
		date: new Date().toISOString(),
		version: pkg.version,
		barbells: await db.select().from(barbells),
		plates: await db.select().from(plates),
		exercises: await db.select().from(exercises),
		planned_sets: await db.select().from(plannedSets),
		actual_sets: await db.select().from(actualSets),
		sessions: (await db.select().from(sessions)).map((s) => ({
			...s,
			date: s.date.getTime(),
		})),
	};
};

// data is the result of exportData
export const importData = async (data: {
	date: string;
	version: string;
	barbells: Barbell[];
	plates: Plate[];
	exercises: Exercise[];
	planned_sets: PlannedSet[];
	actual_sets: ActualSet[];
	sessions: (Omit<Session, "date"> & { date: number; })[];
}) => {
	await resetData();
	if (data.barbells.length > 0) await db.insert(barbells).values(data.barbells);
	if (data.plates.length > 0) await db.insert(plates).values(data.plates);
	if (data.exercises.length > 0) await db.insert(exercises).values(data.exercises);
	if (data.sessions.length > 0) {
		await db.insert(sessions).values(
			data.sessions.map((s) => ({
				...s,
				date: new Date(s.date),
			})),
		);
	}
	if (data.planned_sets.length > 0) await db.insert(plannedSets).values(data.planned_sets);
	if (data.actual_sets.length > 0) await db.insert(actualSets).values(data.actual_sets);
};

export const resetData = async () => {
	await db.delete(actualSets);
	await db.delete(plannedSets);
	await db.delete(exercises);
	await db.delete(sessions);
	await db.delete(barbells);
	await db.delete(plates);
};