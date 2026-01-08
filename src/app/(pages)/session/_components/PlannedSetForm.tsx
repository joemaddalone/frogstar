"use client";
import { use, useActionState, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ApiResponse, Exercise, InsertablePlannedSet } from "@/lib/types";
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

  const [_sessionData, formAction, _pending] = useActionState(action, initialState);

  if (!exerciseList) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <Select
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
        </Select>
        <div className="flex gap-2">
          <Input
            name="intended_sets"
            type="number"
            placeholder="Sets"
          />
          <Input
            name="intended_reps"
            type="number"
            placeholder="Reps"
          />
        </div>
        {equipmentType !== "bodyweight" && (
          <Input
            name="target_weight"
            type="number"
            placeholder="Weight"
          />
        )}
        <div className="flex justify-between gap-2">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={cancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
