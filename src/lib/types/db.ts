export type {
	Barbell,
	Plate,
	Exercise,
	PlannedSet,
	ActualSet,
	Session,
	InsertableSession,
	InsertableExercise,
	InsertablePlannedSet,
	InsertableActualSet,
	InsertableBarbell,
	InsertablePlate,
} from "@/db/schema";

import type { Session, PlannedSet, Exercise, ActualSet } from "@/db/schema";

export type PlannedSetWithDetails = PlannedSet & {
	exercise: Exercise;
	actualSets: ActualSet[];
};

export type SessionWithDetails = Session & {
	plannedSets: PlannedSetWithDetails[];
	planned_exercises: number;
	completed_sets: number;
	completed_reps: number;
	planned_sets: number;
	planned_reps: number;
};
