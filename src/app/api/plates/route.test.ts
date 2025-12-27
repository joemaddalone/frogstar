import { describe, it, expect } from "vitest";
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

describe("POST api/plates", () => {
	it("should create a new plate", async () => {
		const requestObj = {
			json: async () => ({ weight: 1, pairs: 1 }),
		} as NextRequest;
		const response = await POST(requestObj);
		expect(response.data).toBeDefined();
	});
});

describe("GET api/plates", () => {
	it("should return a list of plates", async () => {
		const response = await GET();
		expect(response.data).toBeDefined();
	});
});