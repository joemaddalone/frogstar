export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { loadPlateCalculatorSettings } from "@/lib/plateCalculator";
import { SessionDatePicker } from "@/app/(pages)/session/_components/SessionDatePicker";
import { PlannedSetCard } from "@/app/(pages)/session/_components/PlannedSetCard";
import { SessionHeader } from "@/app/(pages)/session/_components/SessionHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function SessionPage(props: PageProps<"/session/[id]">) {
	const t = await getTranslations();
	const { id } = await props.params;
	const { data: session } = await api.sessions.get(Number(id));
	if (!session) {
		return (
			<div>
				{t("common.session")} {t("common.not_found")}
			</div>
		);
	}
	const equipment = loadPlateCalculatorSettings();

	return (
		<>
			<Header label={t("common.session")} backLink="/">
				<SessionHeader session={session} />
			</Header>
			<main className="flex flex-col gap-4">
				<SessionDatePicker session={session} />
				<ButtonLink variant="outline" href={`/session/${session.id}/ps`}>
					<Plus className="h-4 w-4" /> {t("common.planned_set")}
				</ButtonLink>


				{session.plannedSets.map((plannedSet) => (
					<PlannedSetCard
						key={plannedSet.id}
						plannedSet={plannedSet}
						equipmentLoader={equipment}
					/>
				))}
			</main>
		</>
	);
}
