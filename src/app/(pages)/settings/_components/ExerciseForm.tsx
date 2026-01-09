"use client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardFooter, CardHeader, CommonCardFormActions } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSettingsForm } from "@/app/hooks/useSettingsForm";
import type { Route } from "next";
import type {
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

  const { onDelete, createAction } = useSettingsForm<Exercise, InsertableExercise, FormState>("exercises", item);

  const action = createAction((formData) => ({
    name: formData.get("exercise_name")?.toString(),
    category: formData.get("exercise_category")?.toString(),
    equipmentType: formData.get("equipment_type")?.toString(),
    barbellId: Number(formData.get("barbell_id")) || undefined,
  }));

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
            onDestroy={() => onDelete()}
            showDestroy={Boolean(item?.id)}
            pending={pending}
          />
        </CardFooter>
      </form>
    </Card>
  );
};
