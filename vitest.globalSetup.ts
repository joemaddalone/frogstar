import { reset } from "@/db/reset";
import { main } from "@/db/seed";


export async function setup() {
	await reset();
	await main();

	return async function teardown() {
		await reset();
	};
}

