import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { GET, PUT, DELETE } from "./route";

let id: number;
beforeAll(async () => {
	const exercise = await dataClient.exercises.create({
		name: "Test Exercise",
		category: "Push",
		equipmentType: "barbell",
		barbellId: 1,
	});
	id = exercise.id;
});

describe("GET api/exercises/:id", () => {
	it("should return an exercise", async () => {
		const response = await GET({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("PUT api/exercises/:id", () => {
	it("should update an exercise", async () => {
		const requestObj = {
			json: async () => ({ name: "Test Exercise", category: "Push", equipmentType: "barbell", barbellId: 1 }),
		} as NextRequest;
		const response = await PUT(requestObj, { params: Promise.resolve({ id }) });
		expect(response.data).toBeDefined();
	});
});

describe("DELETE api/exercises/:id", () => {
	it("should delete an exercise", async () => {
		const response = await DELETE({} as NextRequest, { params: Promise.resolve({ id }) });
		expect(response.data).toBeUndefined();
		expect(response.error).toBeUndefined();
	});
});