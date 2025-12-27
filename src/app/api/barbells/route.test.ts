import { describe, it, expect } from "vitest";
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

describe("POST api/barbells", () => {
	it("should create a new barbell", async () => {
		const requestObj = {
			json: async () => ({ name: 'Test Barbell', weight: 10 }),
		} as NextRequest;
		const response = await POST(requestObj);
		expect(response.data).toBeDefined();
	});
});

describe("GET api/barbells", () => {
	it("should return a list of barbells", async () => {
		const response = await GET();
		expect(response.data).toBeDefined();
	});
});




