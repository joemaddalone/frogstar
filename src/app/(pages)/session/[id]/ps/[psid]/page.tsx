export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { PlannedSetForm } from "@/app/(pages)/session/_components/PlannedSetForm";
import { api } from "@/lib/api";
import type { Route } from "next";
export default async function AddPlannedSetPage(props: PageProps<"/session/[id]/ps/[psid]">) {
	const { id, psid } = await props.params;
	const { data: session } = await api.sessions.get(Number(id));
	if (!session) {
		return <div>Session not found</div>;
	}
	const exercises = api.exercises.list();
	const { data: plannedSet } = await api.planned_sets.get(Number(psid));
	if (!plannedSet) {
		return <div>Planned set not found</div>;
	}
	return (
		<>
			<Header label="Edit Planned Set" backPath={`/session/${id}` as Route} />
			<main>
				<PlannedSetForm exercises={exercises} sessionId={Number(id)} plannedSet={plannedSet} />
			</main>
		</>
	);
}
