export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { loadPlateCalculatorSettings } from "@/lib/plateCalculator";
import { SessionDatePicker } from "@/app/(pages)/session/_components/SessionDatePicker";
import { PlannedSetCard } from "@/app/(pages)/session/_components/PlannedSetCard";
import { SessionHeader } from "@/app/(pages)/session/_components/SessionHeader";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Plus } from "lucide-react";
export default async function SessionPage(props: PageProps<"/session/[id]">) {
	const { id } = await props.params;
	const { data: session } = await api.sessions.get(Number(id));
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
				<ButtonLink className="mx-4" size="xs" variant="primary" href={`/session/${session.id}/add`}>
					<Plus className="h-4 w-4" /> Add Exercise
				</ButtonLink>
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
