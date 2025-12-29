export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { loadPlateCalculatorSettings } from "@/lib/plateCalculator";
import { SessionDatePicker } from "@/app/(pages)/session/_components/SessionDatePicker";
import { PlannedSetCard } from "@/app/(pages)/session/_components/PlannedSetCard";
import { SessionHeader } from "@/app/(pages)/session/_components/SessionHeader";
export default async function SessionPage(props: PageProps<"/session/[id]">) {
	const { id } = await props.params;
	const { data: session, error } = await api.sessions.get(Number(id));
	if (!session) {
		return <div>Session not found</div>;
	}
	const equipment = loadPlateCalculatorSettings();

	return (
		<div className="min-h-screen">
			<Header label="session">
				<SessionDatePicker session={session} />
				<SessionHeader session={session} />
			</Header>
			<div className="flex flex-col gap-4">
				{session.plannedSets.length === 0 && (
					<div className="flex items-center justify-center m-4">
						No planned sets found
					</div>
				)}
				{session.plannedSets.map((plannedSet) => (
					<PlannedSetCard key={plannedSet.id} plannedSet={plannedSet} equipmentLoader={equipment} />
				))}
			</div>
		</div>
	);
}
