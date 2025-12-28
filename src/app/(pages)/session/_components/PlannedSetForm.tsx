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
				<label htmlFor="exercise">Exercise</label>
				<select name="exercise" id="exercise" onChange={(e) => setEquipmentType(exerciseList?.find(ex => ex.id === Number(e.target.value))?.equipmentType || '')}>
					<option value="">Select an exercise</option>
					{exerciseList?.map((exercise) => (
						<option key={exercise.id} value={exercise.id}>
							{exercise.name}
						</option>
					))}
				</select>
				<label htmlFor="intended_sets">Intended Sets</label>
				<input type="number" name="intended_sets" id="intended_sets" />
				<label htmlFor="intended_reps">Intended Reps</label>
				<input type="number" name="intended_reps" id="intended_reps" />
				{equipmentType !== "bodyweight" && (
					<>
						<label htmlFor="target_weight">Target Weight</label>
						<input type="number" name="target_weight" id="target_weight" />
					</>
				)}
				<button type="submit">Submit</button>
				<button type="button" className="btn btn-danger" onClick={cancel}>Cancel</button>
			</form>
		</div>
	);
};
