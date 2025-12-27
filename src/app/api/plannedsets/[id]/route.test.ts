import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { GET, PUT, DELETE } from "./route";

let id: number;
beforeAll(async () => {
	const session = await dataClient.sessions.create({
		date: new Date(),
	});
	const plannedSet = await dataClient.planned_sets.create({
		exerciseId: 1,
		sessionId: session.id,
		intendedReps: 1,
		intendedSets: 1,
		targetWeight: 1,
	});
	id = plannedSet.id;
});

describe("GET api/plannedsets/:id", () => {
	it("should return a plannedset", async () => {
		const response = await GET({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("PUT api/plannedsets/:id", () => {
	it("should update a plannedset", async () => {
		const requestObj = {
			json: async () => ({ exerciseId: 1, sessionId: 1, intendedReps: 1, intendedSets: 1, targetWeight: 1 }),
		} as NextRequest;
		const response = await PUT(requestObj, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("DELETE api/plannedsets/:id", () => {
	it("should delete a plannedset", async () => {
		const response = await DELETE({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeUndefined();
		expect(response.error).toBeUndefined();
	});
});
