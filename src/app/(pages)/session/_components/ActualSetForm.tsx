"use client";
import { useActionState } from "react";
import { api } from "@/lib/api";
import { InsertableActualSet, PlannedSet, ActualSet, Exercise } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";


type FormState = {
  actualReps?: string;
  actualWeight?: string;
};

const initialState: FormState = {
  actualReps: '',
  actualWeight: '',
};



export const ActualSetForm = ({ plannedSet, actualSetId, cancel }: { plannedSet: PlannedSet & { exercise: Exercise; actualSets: ActualSet[]; }; actualSetId?: number; cancel: () => void; }) => {
	const router = useRouter();
	const createActualSet = async (state: FormState, formData: FormData) => {
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

	const [state, newAction, pending] = useActionState(createActualSet, initialState);

	const formData = {
		intendedReps: actualSetId ? plannedSet.actualSets.find((actualSet) => actualSet.id === actualSetId)?.actualReps : plannedSet.intendedReps,
		intendedWeight: actualSetId ? plannedSet.actualSets.find((actualSet) => actualSet.id === actualSetId)?.actualWeight : plannedSet.targetWeight,
	};

	return (
		<div>
			<h1>Actual Set Form</h1>
			<form action={newAction}>
				<div className="flex gap-2 items-center">
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Reps</legend>
						<input defaultValue={formData.intendedReps || 0} type="number" name="actual_reps" id="actual_reps" className="input" placeholder="Type here" />
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Weight</legend>
						<input defaultValue={formData.intendedWeight || 0} type="number" name="actual_weight" id="actual_weight" className="input" placeholder="Type here" />
					</fieldset>
				</div>
				<div className="flex gap-2 mt-2">
					<Button type="submit" size="xs" variant="primary" className="w-45"><Check className="h-4 w-4" />Log</Button>
					<Button type="button" size="xs" onClick={cancel} variant="outline" className="w-45"><X className="h-4 w-4" />Cancel</Button>
				</div>
			</form>
		</div>
	);
};
