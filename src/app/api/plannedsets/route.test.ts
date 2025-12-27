import { describe, it, expect } from "vitest";
import { GET, POST } from "./route";
import { NextRequest } from "next/server";


describe("POST api/plannedsets", () => {
	it("should create a new plannedset", async () => {
		const requestObj = {
			json: async () => ({ exerciseId: 1, intendedReps: 1, intendedSets: 1, targetWeight: 1, sessionId: 1 }),
		} as NextRequest;
		const response = await POST(requestObj);
		expect(response.data).toBeDefined();
	});
});

describe("GET api/plannedsets", () => {
	it("should return a list of plannedsets", async () => {
		const response = await GET();
		expect(response.data).toBeDefined();
	});
});

