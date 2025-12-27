import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { GET, PUT, DELETE } from "./route";

let id: number;
beforeAll(async () => {
	const barbell = await dataClient.barbells.create({
		name: "Test Barbell",
		weight: 1,
	});
	id = barbell.id;
});

describe("GET api/barbells/:id", () => {
	it("should return a barbell", async () => {
		const response = await GET({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("PUT api/barbells/:id", () => {
	it("should update a barbell", async () => {
		const requestObj = {
			json: async () => ({ name: "Test Barbell", weight: 1 }),
		} as NextRequest;
		const response = await PUT(requestObj, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("DELETE api/barbells/:id", () => {
	it("should delete a barbell", async () => {
		const response = await DELETE({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeUndefined();
		expect(response.error).toBeUndefined();
	});
});