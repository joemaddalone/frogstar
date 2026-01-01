export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { loadPlateCalculatorSettings } from "@/lib/plateCalculator";
import { SessionDatePicker } from "@/app/(pages)/session/_components/SessionDatePicker";
import { PlannedSetCard } from "@/app/(pages)/session/_components/PlannedSetCard";
import { SessionHeader } from "@/app/(pages)/session/_components/SessionHeader";
import Link from "next/link";
import { Plus, Trash } from "lucide-react";
export default async function SessionPage(props: PageProps<"/session/[id]">) {
	const { id } = await props.params;
	const { data: session, error } = await api.sessions.get(Number(id));
	if (!session) {
		return <div>Session not found</div>;
	}
	const equipment = loadPlateCalculatorSettings();

	return (
		<>
			<Header label="session">
				<SessionDatePicker session={session} />
				<SessionHeader session={session} />
			</Header>
			<main className="flex flex-col gap-4">
				<Link
					href={`/session/${session.id}/add`}
					className="btn btn-xs w-full btn-primary flex items-center space-x-1 self-end"
				>
					<Plus className="h-4 w-4" /> Add Exercise
				</Link>
				{session.plannedSets.length === 0 && (
					<div className="flex items-center justify-center m-4">
						No planned sets found
					</div>
				)}
				{session.plannedSets.map((plannedSet) => (
					<PlannedSetCard key={plannedSet.id} plannedSet={plannedSet} equipmentLoader={equipment} />
				))}
			</main>
		</>
	);
}
