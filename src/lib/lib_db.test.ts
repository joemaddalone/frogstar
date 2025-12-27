import { describe, it, expect } from "vitest";
import { createSession, deleteSession, updateSession, getSession } from "./sessions";
import { createPlannedSet, getPlannedSet } from "./planned_sets";
import { createActualSet, getActualSet } from "./actual_sets";
import { getExercises, createExercise } from "./exercises";
import { createBarbell } from "./barbells";

describe("db", () => {
	it("full lifecycle", async () => {

		// insert barbells
		const barbell = await createBarbell({
			name: "Test Barbell",
			weight: 10,
		});
		expect(barbell).toBeDefined();

		// insert exercises
		const exercise = await createExercise({
			name: "Test Exercise",
			category: "Push",
			equipmentType: "barbell",
			barbellId: barbell.id,
		});
		expect(exercise).toBeDefined();

		const allExercises = await getExercises();
		const exerciseId = allExercises[0].id;

		const session = await createSession({
			date: new Date(),
		});
		expect(session).toBeDefined();

		const plannedSet = await createPlannedSet({
			exerciseId,
			sessionId: session.id,
			intendedReps: 1,
			intendedSets: 1,
			targetWeight: 1,
		});

		expect(plannedSet).toBeDefined();

		const actualSet = await createActualSet({
			plannedSetId: plannedSet.id,
			actualReps: 1,
			actualWeight: 1,
		});
		expect(actualSet).toBeDefined();

		const gs = await getSession(session.id);
		expect(gs).toBeDefined();

		const gps = await getPlannedSet(plannedSet.id);
		expect(gps).toBeDefined();

		const gas = await getActualSet(actualSet.id);
		expect(gas).toBeDefined();

		const updatedSession = await updateSession(session.id, {
			date: new Date(),
		});
		expect(updatedSession).toBeDefined();

		await deleteSession(session.id);
		expect(await getSession(session.id)).toBeNull();

		const gps_1 = await getPlannedSet(plannedSet.id);
		expect(gps_1).toBeNull();

		const gas_1 = await getActualSet(actualSet.id);
		expect(gas_1).toBeNull();
	});
});