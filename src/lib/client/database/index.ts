import { barbells, plates, exercises, plannedSets, actualSets } from "@/db/schema";
import { createRepository } from "@/lib/client/database/repository";
import * as session from './sessions';
import * as progress from './progress';
import { importData, exportData, resetData } from "./data";

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
	},
	progress: {
		progressByWeight: progress.progressByWeight,
	},
	data: {
		exportData,
		importData,
		resetData,
	}
};

export default dataClient;