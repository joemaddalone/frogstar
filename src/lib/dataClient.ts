import * as barbell from "@/lib/barbells";
import * as plate from "@/lib/plates";
import * as session from "@/lib/sessions";
import * as exercise from "@/lib/exercises";
import * as planned_set from "@/lib/planned_sets";
import * as actual_set from "@/lib/actual_sets";

export const dataClient = {
	barbells: {
		create: barbell.createBarbell,
		get: barbell.getBarbells,
		getById: barbell.getBarbell,
		update: barbell.updateBarbell,
		delete: barbell.deleteBarbell,
	},
	plates: {
		create: plate.createPlate,
		get: plate.getPlates,
		getById: plate.getPlate,
		update: plate.updatePlate,
		delete: plate.deletePlate,
	},
	sessions: {
		create: session.createSession,
		get: session.getSessions,
		getById: session.getSession,
		update: session.updateSession,
		delete: session.deleteSession,
	},
	exercises: {
		create: exercise.createExercise,
		get: exercise.getExercises,
		getById: exercise.getExercise,
		update: exercise.updateExercise,
		delete: exercise.deleteExercise,
	},
	planned_sets: {
		create: planned_set.createPlannedSet,
		get: planned_set.getPlannedSets,
		getById: planned_set.getPlannedSet,
		update: planned_set.updatePlannedSet,
		delete: planned_set.deletePlannedSet,
	},
	actual_sets: {
		create: actual_set.createActualSet,
		get: actual_set.getActualSets,
		getById: actual_set.getActualSet,
		update: actual_set.updateActualSet,
		delete: actual_set.deleteActualSet,
	},
};