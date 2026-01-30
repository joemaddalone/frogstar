"use client";
import { use, useActionState, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type {
  ApiResponse,
  Exercise,
  InsertablePlannedSet,
  PlannedSet,
} from "@/lib/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type FormState = {
  exerciseId?: string;
  intendedSets?: string;
  intendedReps?: string;
  targetWeight?: string;
};

const initialState: FormState = {
  exerciseId: "",
  intendedSets: "",
  intendedReps: "",
  targetWeight: "",
};

export const PlannedSetForm = ({
  exercises,
  sessionId,
  plannedSet,
  isModal,
}: {
  exercises: Promise<ApiResponse<Exercise[]>>;
  sessionId: number;
  plannedSet?: PlannedSet;
  isModal?: boolean;
}) => {
  const router = useRouter();
  const t = useTranslations();
  const { data: exerciseList } = use(exercises);

  const [equipmentType, setEquipmentType] = useState<string>(
    plannedSet
      ? exerciseList?.find((ex) => ex.id === plannedSet.exerciseId)
        ?.equipmentType || ""
      : "",
  );

  const completeAction = () => {
    if (isModal) {
      router.back();
      router.refresh();
    } else {
      router.refresh();
      router.push(`/session/${sessionId}`);
    }
  };

  const action = async (state: FormState, formData: FormData) => {
    const newPlannedSet: InsertablePlannedSet | PlannedSet = {
      sessionId,
      exerciseId: Number(formData.get("exercise")),
      intendedSets: Number(formData.get("intended_sets")),
      intendedReps: Number(formData.get("intended_reps")),
      targetWeight: Number(formData.get("target_weight")),
    };

    if (plannedSet) {
      (newPlannedSet as PlannedSet).id = plannedSet.id;
      const { data, error } = await api.planned_sets.update(
        newPlannedSet as PlannedSet,
      );
      if (error) {
        return state;
      }
      if (!data?.id) {
        return state;
      }
      completeAction();
      return state;
    } else {
      const { data, error } = await api.planned_sets.create(newPlannedSet);
      if (error) {
        return state;
      }
      if (!data?.id) {
        return state;
      }
      completeAction();
      return state;
    }
  };

  const cancel = () => {
    if (isModal) {
      router.back();
    } else {
      router.push(`/session/${sessionId}`);
    }
  };

  const [_sessionData, formAction, _pending] = useActionState(
    action,
    initialState,
  );

  const deletePlannedSet = async () => {
    if (!plannedSet) {
      return;
    }
    const { error } = await api.planned_sets.delete(plannedSet.id);
    if (!error) {
      completeAction();
    }
  };

  if (!exerciseList) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <Select
          name="exercise"
          id="exercise"
          defaultValue={plannedSet?.exerciseId || ""}
          onChange={(e) =>
            setEquipmentType(
              exerciseList?.find((ex) => ex.id === Number(e.target.value))
                ?.equipmentType || "",
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
            defaultValue={plannedSet?.intendedSets || ""}
            name="intended_sets"
            type="number"
            placeholder={t('common.sets')}
          />
          <Input
            defaultValue={plannedSet?.intendedReps || ""}
            name="intended_reps"
            type="number"
            placeholder={t('common.reps')}
          />
        </div>
        {equipmentType !== "bodyweight" && (
          <Input
            defaultValue={plannedSet?.targetWeight || ""}
            name="target_weight"
            type="number"
            placeholder={t('common.weight')}
          />
        )}
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              {t('common.save')}
            </Button>
            <Button variant="outline" type="button" onClick={cancel}>
              {t('common.cancel')}
            </Button>
          </div>
          {plannedSet ? (

            <Button type="button" variant="danger" onClick={deletePlannedSet}>
              {t('common.delete')}
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
};
