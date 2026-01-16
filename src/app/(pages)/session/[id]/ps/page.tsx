export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { PlannedSetForm } from "@/app/(pages)/session/_components/PlannedSetForm";
import { api } from "@/lib/api";
import { getTranslations } from "next-intl/server";
export default async function AddPlannedSetPage(props: PageProps<"/session/[id]/ps">) {
	const t = await getTranslations();
	const { id } = await props.params;
	const { data: session } = await api.sessions.get(Number(id));
	if (!session) {
		return <div>{t("common.session")} {t("common.not_found")}</div>;
	}
	const exercises = api.exercises.list();
	return (
		<>
			<Header label={t("common.planned_set")} />
			<main>
				<PlannedSetForm exercises={exercises} sessionId={Number(id)} />
			</main>
		</>
	);
}
