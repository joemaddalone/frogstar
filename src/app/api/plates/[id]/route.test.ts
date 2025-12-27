import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { GET, PUT, DELETE } from "./route";

let id: number;
beforeAll(async () => {
	const plate = await dataClient.plates.create({
		weight: 1,
		pairs: 1,
	});
	id = plate.id;
});

describe("GET api/plates/:id", () => {
	it("should return a plate", async () => {
		const response = await GET({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("PUT api/plates/:id", () => {
	it("should update a plate", async () => {
		const requestObj = {
			json: async () => ({ weight: 1, pairs: 1 }),
		} as NextRequest;
		const response = await PUT(requestObj, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("DELETE api/plates/:id", () => {
	it("should delete a plate", async () => {
		const response = await DELETE({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeUndefined();
		expect(response.error).toBeUndefined();
	});
});