"use client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardFooter, CardHeader, CommonCardFormActions } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Route } from "next";
import type {
  ApiResponse,
  Barbell,
  Exercise,
  InsertableExercise,
} from "@/lib/types";
import { useState } from "react";

type FormState = {
  exercise_name?: string;
  exercise_category?: string;
  equipment_type?: string;
};

const initialState: FormState = {
  exercise_name: "",
  exercise_category: "",
  equipment_type: "",
};

export const ExerciseForm = ({ item }: { item?: Exercise; }) => {
  const t = useTranslations();
  const router = useRouter();
  const [barbells, setBarbells] = useState<Barbell[]>([]);
  const [equipmentType, setEquipmentType] = useState(
    item?.equipmentType || "barbell",
  );

  const deleteExercise = async () => {
    if (item?.id) {
      if (!window.confirm(t("common.confirm_delete_exercise"))) {
        return;
      }
      const { error } = await api.exercises.delete(item.id);
      if (!error) {
        router.push(`/settings/exercises` as Route);
      }
    }
  };

  const action = async (state: FormState, formData: FormData) => {
    const name = formData.get("exercise_name")?.toString();
    const category = formData.get("exercise_category")?.toString();
    const equipmentType = formData.get("equipment_type")?.toString();
    const barbellId = formData.get("barbell_id")?.toString();
    let response: ApiResponse<Exercise>;

    const newExercise: Partial<Exercise> = {
      name: name,
      category: category,
      equipmentType: equipmentType,
      barbellId: Number(barbellId) || undefined,
    };
    const isNew = item?.id;

    if (isNew) {
      newExercise.id = item.id;
      response = await api.exercises.update(newExercise as Exercise);
    } else {
      response = await api.exercises.create(newExercise as InsertableExercise);
    }

    if (response.error) {
      return state;
    }
    if (!response.data?.id) {
      return state;
    }
    router.push(`/settings/exercises` as Route);
    return state;
  };

  useEffect(() => {
    // fetch barbells
    const doit = async () => {
      const { data } = await api.barbells.list();
      if (data) {
        setBarbells(data);
      }
    };
    doit();
  }, []);

  const [_plateData, formAction, pending] = useActionState(
    action,
    initialState,
  );

  return (
    <Card className="mb-2">
      <form action={formAction}>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                label={t("common.name")}
                name="exercise_name"
                type="text"
                size="sm"
                defaultValue={item?.name}
                placeholder="Bench Press Close-Grip"
              />
              <Input
                label={t("common.category")}
                name="exercise_category"
                type="text"
                size="sm"
                defaultValue={item?.category}
                placeholder="Push, Pull, Legs, etc."
              />
            </div>

            <Select
              label={t("common.equipment_type")}
              size="sm"
              onChange={(e) => setEquipmentType(e.target.value)}
              defaultValue={item?.equipmentType}
              name="equipment_type"
            >
              <option disabled={true}>Equipment Type</option>
              <option value="barbell">Barbell</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="cable">Cable</option>
              <option value="dumbbell">Dumbbell</option>
              <option value="machine">Machine</option>
            </Select>

            {equipmentType === "barbell" && (
              <Select
                label={t("common.barbell")}
                size="sm"
                defaultValue={Number(item?.barbellId) || 1}
                name="barbell_id"
              >
                <option disabled={true}>{t("common.barbell")}</option>
                {barbells.map((barbell) => (
                  <option key={barbell.id} value={barbell.id}>
                    {barbell.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between gap-2">
          <CommonCardFormActions
            onCancel={() => {
              router.push(`/settings/exercises` as Route);
            }}
            onDestroy={deleteExercise}
            showDestroy={Boolean(item?.id)}
            pending={pending}
          />
        </CardFooter>
      </form>
    </Card>
  );
};
