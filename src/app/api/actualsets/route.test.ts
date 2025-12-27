import { describe, it, expect } from "vitest";
import { GET, POST } from "./route";
import { NextRequest } from "next/server";


describe("POST api/actualsets", () => {
	it("should create a new actualset", async () => {
		const requestObj = {
			json: async () => ({ plannedSetId: 1, actualReps: 1, actualWeight: 1 }),
		} as NextRequest;
		const response = await POST(requestObj);
		expect(response.data).toBeDefined();
	});
});

describe("GET api/actualsets", () => {
	it("should return a list of actualsets", async () => {
		const response = await GET();
		expect(response.data).toBeDefined();
	});
});

