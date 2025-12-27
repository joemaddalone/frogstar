import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { GET, PUT, DELETE } from "./route";

let id: number;
beforeAll(async () => {
	const session = await dataClient.sessions.create({
		date: new Date(),
	});
	const plannetSet = await dataClient.planned_sets.create({
		exerciseId: 1,
		sessionId: session.id,
		intendedReps: 1,
		intendedSets: 1,
		targetWeight: 1,
	});
	const actualSet = await dataClient.actual_sets.create({
		plannedSetId: plannetSet.id,
		actualReps: 1,
		actualWeight: 1,
	});
	id = actualSet.id;
});

describe("GET api/actualsets/:id", () => {
	it("should return an actualset", async () => {
		const response = await GET({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("PUT api/actualsets/:id", () => {
	it("should update an actualset", async () => {
		const requestObj = {
			json: async () => ({ plannedSetId: 1, actualReps: 1, actualWeight: 1 }),
		} as NextRequest;
		const response = await PUT(requestObj, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("DELETE api/actualsets/:id", () => {
	it("should delete an actualset", async () => {
		const response = await DELETE({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeUndefined();
		expect(response.error).toBeUndefined();
	});
});


