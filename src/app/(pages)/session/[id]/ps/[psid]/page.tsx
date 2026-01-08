export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { PlannedSetForm } from "@/app/(pages)/session/_components/PlannedSetForm";
import { api } from "@/lib/api";
import type { Route } from "next";
import { getTranslations } from "next-intl/server";
export default async function AddPlannedSetPage(props: PageProps<"/session/[id]/ps/[psid]">) {
	const t = await getTranslations();
	const { id, psid } = await props.params;
	const { data: session } = await api.sessions.get(Number(id));
	if (!session) {
		return <div>{t("common.session")} {t("common.not_found")}</div>;
	}
	const exercises = api.exercises.list();
	const { data: plannedSet } = await api.planned_sets.get(Number(psid));
	if (!plannedSet) {
		return <div>{t("common.planned_set")} {t("common.not_found")}</div>;
	}
	return (
		<>
			<Header label={t("common.planned_set")} backPath={`/session/${id}` as Route} />
			<main>
				<PlannedSetForm exercises={exercises} sessionId={Number(id)} plannedSet={plannedSet} />
			</main>
		</>
	);
}
