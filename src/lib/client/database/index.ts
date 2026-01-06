import { barbells, plates, exercises, plannedSets, actualSets } from "@/db/schema";
import { createRepository } from "@/lib/client/database/repository";
import * as session from './sessions'


const dataClient = {
	barbells: {
		...createRepository(barbells)
	},
	plates: {
		...createRepository(plates)
	},
	exercises: {
		...createRepository(exercises)
	},
	planned_sets: {
		...createRepository(plannedSets)
	},
	actual_sets: {
		...createRepository(actualSets)
	},
	sessions: {
		get: session.get,
		getById: session.getById,
		create: session.create,
		remove: session.remove,
		update: session.update
	}
};

export default dataClient;