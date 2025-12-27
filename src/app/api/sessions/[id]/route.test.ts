import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { GET, PUT, DELETE } from "./route";

let id: number;
beforeAll(async () => {
	const session = await dataClient.sessions.create({
		date: new Date(),
	});
	id = session.id;
});

describe("GET api/sessions/:id", () => {
	it("should return a session", async () => {
		const response = await GET({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("PUT api/sessions/:id", () => {
	it("should update a session", async () => {
		const requestObj = {
			json: async () => ({ date: new Date() }),
		} as NextRequest;
		const response = await PUT(requestObj, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("DELETE api/sessions/:id", () => {
	it("should delete a session", async () => {
		const response = await DELETE({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeUndefined();
		expect(response.error).toBeUndefined();
	});
});