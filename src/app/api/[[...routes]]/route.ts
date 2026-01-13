import { Elysia } from "elysia";
import dataClient from "@/lib/client/database";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

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
	app
		.get(`/${path}`, () => wrap(() => client.get()))
		.post(`/${path}`, async ({ request }) => {
			const body = await request.json();
			return wrap(() => client.create(body));
		})
		.get(`/${path}/:id`, ({ params: { id } }) =>
			wrap(() => client.getById(parseInt(id, 10))),
		)
		.put(`/${path}/:id`, async ({ params: { id }, request }) => {
			const body = await request.json();
			return wrap(() => client.update(parseInt(id, 10), body));
		})
		.delete(`/${path}/:id`, ({ params: { id } }) =>
			wrap(async () => {
				await client.remove(parseInt(id, 10));
				return undefined;
			}),
		);
});

app.get(
	"/progress/:range/exercise/:exerciseId",
	({ params: { range, exerciseId } }) =>
		wrap(() =>
			dataClient.progress.progressByWeight(
				parseInt(range, 10),
				parseInt(exerciseId, 10),
			),
		),
);

app.get(
	"/data/export",
	() => wrap(() => dataClient.data.exportData()),
);

app.post(
	"/data/import",
	async ({ request }) => {
		const body = await request.json();
		await wrap(() => dataClient.data.importData(body));
		return NextResponse.json({ data: true, error: undefined });
	},
);

app.post(
	"/data/reset",
	async () => {
		await wrap(() => dataClient.data.resetData());
		return NextResponse.json({ data: true, error: undefined });
	},
);

app.post(
	"/data/seed",
	async () => {
		await wrap(() => dataClient.data.seed());
		revalidatePath("/api/data");
		return NextResponse.json({ data: true, error: undefined });
	},
);


export { app };

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
