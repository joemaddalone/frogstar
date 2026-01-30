export const dynamic = "force-dynamic";
import { PlannedSetForm } from "@/app/(pages)/session/_components/PlannedSetForm";
import { EditPlannedSetModal } from "@/app/(pages)/session/_components/EditPlannedSetModal";
import { api } from "@/lib/api";
import { getTranslations } from "next-intl/server";

export default async function EditPlannedSetModalPage(props: PageProps<"/session/[id]/ps/[psid]">) {
	const t = await getTranslations();
	const { id, psid } = await props.params;

	const exercises = api.exercises.list();
	const { data: plannedSet } = await api.planned_sets.get(Number(psid));

	if (!plannedSet) {
		return null;
	}

	return (
		<EditPlannedSetModal title={t("common.planned_set")}>
			<PlannedSetForm
				isModal
				exercises={exercises}
				sessionId={Number(id)}
				plannedSet={plannedSet}
			/>
		</EditPlannedSetModal>
	);
}
