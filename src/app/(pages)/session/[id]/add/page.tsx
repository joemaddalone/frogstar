export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { PlannedSetForm } from "@/app/(pages)/session/_components/PlannedSetForm";
import { api } from "@/lib/api";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Route } from "next";
export default async function AddPlannedSetPage(props: PageProps<"/session/[id]/add">) {
	const { id } = await props.params;
	const { data: session } = await api.sessions.get(Number(id));
	if (!session) {
		return <div>Session not found</div>;
	}
	const exercises = api.exercises.list();
	return (
		<>
			<Header label="Add Planned Set" backPath={`/session/${id}` as Route}>
				<Link
					href={`/session/${id}`}
					className="btn-primary flex items-center space-x-1 self-end"
				>
					<Plus className="h-4 w-4" />
				</Link>
			</Header>
			<main>
				<PlannedSetForm exercises={exercises} sessionId={Number(id)} />
			</main>
		</>
	);
}
