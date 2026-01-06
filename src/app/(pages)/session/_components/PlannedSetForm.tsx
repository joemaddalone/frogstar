"use client";
import { Exercise } from "@/db/schema";
import { use, useActionState, useState } from "react";
import { ApiResponse } from "@/lib/types";
import { api } from "@/lib/api";
import { InsertablePlannedSet } from "@/db/schema";
import { useRouter } from "next/navigation";

type FormState = {
  exerciseId?: string;
  intendedSets?: string;
  intendedReps?: string;
  targetWeight?: string;
};

const initialState: FormState = {
  exerciseId: '',
  intendedSets: '',
  intendedReps: '',
  targetWeight: '',
};


export const PlannedSetForm = ({
  exercises,
  sessionId,
}: {
  exercises: Promise<ApiResponse<Exercise[]>>;
  sessionId: number;
}) => {
  const router = useRouter();
  const { data: exerciseList } = use(exercises);

  const [equipmentType, setEquipmentType] = useState<string>("");

  const action = async (state: FormState, formData: FormData) => {
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

  const [sessionData, formAction, pending] = useActionState(action, initialState);

  if (!exerciseList) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <select
          className="select w-full"
          name="exercise"
          id="exercise"
          onChange={(e) =>
            setEquipmentType(
              exerciseList?.find((ex) => ex.id === Number(e.target.value))
                ?.equipmentType || ""
            )
          }
        >
          {exerciseList?.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            name="intended_sets"
            type="number"
            className="input"
            placeholder="Sets"
          />
          <input
            name="intended_reps"
            type="number"
            className="input"
            placeholder="Reps"
          />
        </div>
        {equipmentType !== "bodyweight" && (
          <input
            name="target_weight"
            type="number"
            className="input w-full"
            placeholder="Weight"
          />
        )}
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary w-50">
            Submit
          </button>
          <button
            type="button"
            className="btn btn btn-outline w-50"
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
