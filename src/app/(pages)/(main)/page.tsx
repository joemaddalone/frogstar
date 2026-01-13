export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { SessionList } from './_components/SessionList';
import type { ApiResponse, Barbell, Plate, Exercise, SessionWithDetails } from "@/lib/types";
export default async function HomePage() {
	const sessions = api.sessions.list();
	const equipment = Promise.all([
		api.barbells.list(),
		api.plates.list(),
		api.exercises.list(),
	]);
	return (
		<div className="min-h-screen">
			<Header label="frogstar" />
			<main className="space-y-8">
				<SessionList sessionsLoader={sessions as Promise<ApiResponse<SessionWithDetails[]>>} dataLoader={equipment as Promise<[{ data: Barbell[]; }, { data: Plate[]; }, { data: Exercise[]; }]>} />
			</main>
		</div>
	);
}
