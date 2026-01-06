import { Elysia } from "elysia";
import dataClient from "@/lib/client/database";
import { NextResponse } from "next/server";

const wrap = async (fn: () => Promise<unknown>) => {
	try {
		const data = await fn();
		return NextResponse.json({ data, error: undefined });
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json({ data: undefined, error: error as Error });
	}
};

const app = new Elysia({ prefix: "/api" });

const resources = [
	{ path: "actualsets", client: dataClient.actual_sets },
	{ path: "barbells", client: dataClient.barbells },
	{ path: "exercises", client: dataClient.exercises },
	{ path: "plates", client: dataClient.plates },
	{ path: "plannedsets", client: dataClient.planned_sets },
	{ path: "sessions", client: dataClient.sessions },
] as const;

resources.forEach(({ path, client }) => {
	app.get(`/${path}`, () => wrap(() => client.get()))
		.post(`/${path}`, async ({ request }) => {
			const body = await request.json();
			return wrap(() => client.create(body));
		})
		.get(`/${path}/:id`, ({ params: { id } }) =>
			wrap(() => client.getById(parseInt(id)))
		)
		.put(`/${path}/:id`, async ({ params: { id }, request }) => {
			const body = await request.json();
			return wrap(() => client.update(parseInt(id), body));
		})
		.delete(`/${path}/:id`, ({ params: { id } }) =>
			wrap(async () => {
				await client.delete(parseInt(id));
				return undefined;
			})
		);
});

export { app };

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
