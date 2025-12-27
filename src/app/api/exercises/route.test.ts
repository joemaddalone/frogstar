import { describe, it, expect } from "vitest";
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

describe("POST api/exercises", () => {
	it("should create a new exercise", async () => {
		const requestObj = {
			json: async () => ({ name: 'Test Exercise', category: 'Push', equipmentType: 'barbell', barbellId: 1 }),
		} as NextRequest;
		const response = await POST(requestObj);
		expect(response.data).toBeDefined();
	});
});

describe("GET api/exercises", () => {
	it("should return a list of exercises", async () => {
		const response = await GET();
		expect(response.data).toBeDefined();
	});
});





