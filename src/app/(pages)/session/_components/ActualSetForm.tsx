"use client";
import { useActionState } from "react";
import { api } from "@/lib/api";
import { InsertableActualSet, PlannedSet, ActualSet, Exercise } from "@/lib/types";
import { useRouter } from "next/navigation";

export const ActualSetForm = ({ plannedSet, actualSetId, cancel }: { plannedSet: PlannedSet & { exercise: Exercise; actualSets: ActualSet[]; }; actualSetId?: number; cancel: () => void; }) => {
	const router = useRouter();
	const createActualSet = async (state: any, formData: FormData) => {
		const newActualSet: InsertableActualSet | ActualSet = {
			plannedSetId: plannedSet.id,
			actualReps: Number(formData.get("actual_reps")),
			actualWeight: Number(formData.get("actual_weight")),
		};

		if (actualSetId) {
			(newActualSet as ActualSet).id = actualSetId;
			const { data, error } = await api.actual_sets.update(newActualSet as ActualSet);
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

			const { data, error } = await api.actual_sets.create(newActualSet as InsertableActualSet);
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

	const [state, newAction, pending] = useActionState(createActualSet, null);

	const formData = {
		intendedReps: actualSetId ? plannedSet.actualSets.find((actualSet) => actualSet.id === actualSetId)?.actualReps : plannedSet.intendedReps,
		intendedWeight: actualSetId ? plannedSet.actualSets.find((actualSet) => actualSet.id === actualSetId)?.actualWeight : plannedSet.targetWeight,
	};

	return (
		<div>
			<h1>Actual Set Form</h1>
			<form action={newAction}>
				<label htmlFor="actual_reps">Actual Reps</label>
				<input defaultValue={formData.intendedReps || 0} type="number" name="actual_reps" id="actual_reps" />
				<label htmlFor="actual_weight">Actual Weight</label>
				<input defaultValue={formData.intendedWeight || 0} type="number" name="actual_weight" id="actual_weight" />
				<button type="submit">Submit</button>
				<button type="button" className="btn btn-danger" onClick={cancel}>Cancel</button>
			</form>
		</div>
	);
};
