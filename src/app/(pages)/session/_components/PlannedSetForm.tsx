"use client";
import { Exercise } from "@/db/schema";
import { use, useActionState, useState } from "react";
import { ApiResponse } from "@/lib/types";
import { api } from "@/lib/api";
import { InsertablePlannedSet } from "@/db/schema";
import { useRouter } from "next/navigation";

export const PlannedSetForm = ({ exercises, sessionId }: { exercises: Promise<ApiResponse<Exercise[]>>; sessionId: number; }) => {
	const router = useRouter();
	const { data: exerciseList } = use(exercises);

	const [equipmentType, setEquipmentType] = useState<string>('');

	if (!exerciseList) {
		return <div>Loading...</div>;
	}

	const action = async (state: any, formData: FormData) => {
		const newPlannedSet: InsertablePlannedSet = {
			sessionId,
			exerciseId: Number(formData.get("exercise")),
			intendedSets: Number(formData.get("intended_sets")),
			intendedReps: Number(formData.get("intended_reps")),
			targetWeight: Number(formData.get("target_weight")),
		};
		const { data, error } = await api.planned_sets.create(newPlannedSet);
		if (error) {
			return state;
		}
		if (!data?.id) {
			return state;
		}
		router.push(`/session/${sessionId}`);
		return state;
	};

	const cancel = () => {
		router.push(`/session/${sessionId}`);
	};

	const [sessionData, formAction, pending] = useActionState(action, null);

	return (
		<div>
			<h1>Planned Set Form</h1>
			<form action={formAction}>

				<fieldset className="fieldset">
					<legend className="fieldset-legend">Exercise</legend>
					<select className="select" name="exercise" id="exercise" onChange={(e) => setEquipmentType(exerciseList?.find(ex => ex.id === Number(e.target.value))?.equipmentType || '')}>
						{exerciseList?.map((exercise) => (
							<option key={exercise.id} value={exercise.id}>
								{exercise.name}
							</option>
						))}
					</select>
				</fieldset>

				<fieldset className="fieldset">
					<legend className="fieldset-legend">Intended Sets</legend>
					<input name="intended_sets" type="number" className="input" placeholder="Type here" />
				</fieldset>

				<fieldset className="fieldset">
					<legend className="fieldset-legend">Intended Reps</legend>
					<input name="intended_reps" type="number" className="input" placeholder="Type here" />
				</fieldset>
				{equipmentType !== "bodyweight" && (
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Target Weight</legend>
						<input name="target_weight" type="number" className="input" placeholder="Type here" />
					</fieldset>
				)}
				<button type="submit" className="btn btn-primary">Submit</button>
				<button type="button" className="btn btn btn-outline" onClick={cancel}>Cancel</button>
			</form>
		</div>
	);
};
