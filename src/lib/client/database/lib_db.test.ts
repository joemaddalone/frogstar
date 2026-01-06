import { describe, it, expect } from "vitest";

import db from './index'

describe("db", () => {
	it("full lifecycle", async () => {

		// insert barbells
		const barbell = await db.barbells.create({
			name: "Test Barbell",
			weight: 10,
		});
		expect(barbell).toBeDefined();

		// insert exercises
		const exercise = await db.exercises.create({
			name: "Test Exercise",
			category: "Push",
			equipmentType: "barbell",
			barbellId: barbell.id,
		});
		expect(exercise).toBeDefined();

		const allExercises = await db.exercises.get();
		const exerciseId = allExercises[0].id;

		const session = await db.sessions.create({
			date: new Date(),
		});
		expect(session).toBeDefined();

		const plannedSet = await db.planned_sets.create({
			exerciseId,
			sessionId: session.id,
			intendedReps: 1,
			intendedSets: 1,
			targetWeight: 1,
		});

		expect(plannedSet).toBeDefined();

		const actualSet = await db.actual_sets.create({
			plannedSetId: plannedSet.id,
			actualReps: 1,
			actualWeight: 1,
		});
		expect(actualSet).toBeDefined();

		const gs = await db.sessions.getById(session.id);
		expect(gs).toBeDefined();

		const gps = await db.planned_sets.getById(plannedSet.id);
		expect(gps).toBeDefined();

		const gas = await db.actual_sets.getById(actualSet.id);
		expect(gas).toBeDefined();

		const updatedSession = await db.sessions.update(session.id, {
			date: new Date(),
		});
		expect(updatedSession).toBeDefined();

		await db.sessions.remove(session.id);
		expect(await db.sessions.getById(session.id)).toBeNull();

		const gps_1 = await db.planned_sets.getById(plannedSet.id);
		expect(gps_1).toBeNull();

		const gas_1 = await db.actual_sets.getById(actualSet.id);
		expect(gas_1).toBeNull();
	});
});