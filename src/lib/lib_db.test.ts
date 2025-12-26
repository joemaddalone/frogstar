import { describe, it, expect, beforeEach } from "vitest";
import { createSession, deleteSession, updateSession } from "./sessions";
import { createPlannedSet } from "./planned_sets";
import { createActualSet, getActualSets, getActualSetsByPlannedSetId } from "./actual_sets";
import { getSession } from "./sessions";
import { getPlannedSet, getPlannedSets } from "./planned_sets";
import { getActualSet } from "./actual_sets";
import { main } from "../db/seed";

describe("db", () => {

	beforeEach(async () => {
		await main();
	});

	it("full lifecycle", async () => {
		const session = await createSession({
			date: new Date(),
		});
		expect(session).toBeDefined();

		const plannedSet = await createPlannedSet({
			exerciseId: 1,
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

		const gps_1 = await getPlannedSets();
		expect(gps_1).toHaveLength(0);

		const gas_1 = await getActualSets();
		expect(gas_1).toHaveLength(0);
	});
});