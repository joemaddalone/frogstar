export const dynamic = "force-dynamic";
import { PlannedSetForm } from "@/app/(pages)/session/_components/PlannedSetForm";
import { EditPlannedSetModal } from "@/app/(pages)/session/_components/EditPlannedSetModal";
import { api } from "@/lib/api";
import { getTranslations } from "next-intl/server";

export default async function AddPlannedSetModalPage(props: PageProps<"/session/[id]/ps">) {
	const t = await getTranslations();
	const { id } = await props.params;

	const exercises = api.exercises.list();

	return (
		<EditPlannedSetModal title={t("common.planned_set")}>
			<PlannedSetForm
				isModal
				exercises={exercises}
				sessionId={Number(id)}
			/>
		</EditPlannedSetModal>
	);
}
