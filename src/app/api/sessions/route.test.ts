import { describe, it, expect } from "vitest";
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

describe("POST api/sessions", () => {
	it("should create a new session", async () => {
		const requestObj = {
			json: async () => ({ date: new Date() }),
		} as NextRequest;
		const response = await POST(requestObj);
		expect(response.data).toBeDefined();
	});
});

describe("GET api/sessions", () => {
	it("should return a list of sessions", async () => {
		const response = await GET();
		expect(response.data).toBeDefined();
	});
});