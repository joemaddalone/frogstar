"use client";
import { useActionState } from "react";
import { api } from "@/lib/api";
import type {
	InsertableActualSet,
	PlannedSet,
	ActualSet,
	Exercise,
} from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Check, X, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

type FormState = {
	actualReps?: string;
	actualWeight?: string;
};

const initialState: FormState = {
	actualReps: "",
	actualWeight: "",
};

export const ActualSetForm = ({
	plannedSet,
	showWeight,
	actualSetId,
	cancel,
	deleteActualSet,
}: {
	plannedSet: PlannedSet & { exercise: Exercise; actualSets: ActualSet[]; };
	showWeight: boolean;
	actualSetId?: number;
	cancel: () => void;
	deleteActualSet: (actualSetId: number) => void;
}) => {
	const router = useRouter();
	const t = useTranslations();
	const createActualSet = async (state: FormState, formData: FormData) => {
		const newActualSet: InsertableActualSet | ActualSet = {
			plannedSetId: plannedSet.id,
			actualReps: Number(formData.get("actual_reps")),
			actualWeight: Number(formData.get("actual_weight")),
		};

		if (actualSetId) {
			(newActualSet as ActualSet).id = actualSetId;
			const { data, error } = await api.actual_sets.update(
				newActualSet as ActualSet,
			);
			if (error) {
				return state;
			}
			if (!data?.id) {
				return state;
			}
			cancel();
			router.refresh();
			return state;
		} else {
			const { data, error } = await api.actual_sets.create(
				newActualSet as InsertableActualSet,
			);
			if (error) {
				return state;
			}
			if (!data?.id) {
				return state;
			}
			cancel();
			router.refresh();
			return state;
		}
	};

	const [_state, newAction, _pending] = useActionState(
		createActualSet,
		initialState,
	);

	const formData = {
		intendedReps: actualSetId
			? plannedSet.actualSets.find((actualSet) => actualSet.id === actualSetId)
				?.actualReps
			: plannedSet.intendedReps,
		intendedWeight: actualSetId
			? plannedSet.actualSets.find((actualSet) => actualSet.id === actualSetId)
				?.actualWeight
			: plannedSet.targetWeight,
	};

	return (
		<form action={newAction} className="w-full">
			<div className="flex gap-2 items-center">
				<Input
					label={t("common.reps")}
					defaultValue={formData.intendedReps || 0}
					type="number"
					name="actual_reps"
					id="actual_reps"
					placeholder={t("common.reps")}
				/>
				{showWeight && (
					<Input
						label={t("common.weight")}
						defaultValue={formData.intendedWeight || 0}
						type="number"
						name="actual_weight"
						id="actual_weight"
						placeholder={t("common.weight")}
					/>
				)}
			</div>
			<div className="flex justify-between gap-2 mt-2 w-full">
				<div className="flex gap-2">
					<Button type="submit" size="sm" variant="primary">
						<Check className="h-4 w-4" />
						{t("common.log")}
					</Button>
					<Button type="button" size="sm" onClick={cancel} variant="outline">
						<X className="h-4 w-4" />
						{t("common.cancel")}
					</Button>
				</div>
				{actualSetId ? (
					<Button
						type="button"
						size="sm"
						variant="danger"
						onClick={() => deleteActualSet(actualSetId)}
					>
						<Trash className="h-4 w-4" />
						{t("common.delete")}
					</Button>
				) : null}
			</div>
		</form>
	);
};
