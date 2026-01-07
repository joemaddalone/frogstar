"use client";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import type { Route } from "next";
import type { ApiResponse, Barbell, Exercise, InsertableExercise } from "@/lib/types";
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
  const router = useRouter();
  const [barbells, setBarbells] = useState<Barbell[]>([]);
  const [equipmentType, setEquipmentType] = useState(item?.equipmentType || "barbell");

  const deleteExercise = async () => {
    if (item?.id) {
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
      barbellId: Number(barbellId) || undefined
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

  const [_plateData, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="mb-2">
      <CardHeader>
        <form action={formAction}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Name</legend>
                <input
                  name="exercise_name"
                  type="text"
                  className="input"
                  defaultValue={item?.name}
                  placeholder="Bench Press Close-Grip"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Category</legend>
                <input
                  name="exercise_category"
                  type="text"
                  className="input"
                  defaultValue={item?.category}
                  placeholder="Push, Pull, Legs, etc."
                />
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Equipment Type</legend>
              <select onChange={(e) => setEquipmentType(e.target.value)} defaultValue={item?.equipmentType} name="equipment_type" className="select w-full">
                <option disabled={true}>Equipment Type</option>
                <option value="barbell">Barbell</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="cable">Cable</option>
                <option value="dumbbell">Dumbbell</option>
                <option value="machine">Machine</option>
              </select>
            </fieldset>
            {equipmentType === "barbell" && (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Barbell</legend>
                <select defaultValue={Number(item?.barbellId) || 1} name="barbell_id" className="select w-full">
                  <option disabled={true}>Barbell</option>
                  {barbells.map((barbell) => (
                    <option key={barbell.id} value={barbell.id}>
                      {barbell.name}
                    </option>
                  ))}
                </select>
              </fieldset>
            )}

            <div className="flex justify-between gap-2">
              <div className="space-x-2">
                <Button
                  type="submit"
                  size="xs"
                  variant="primary"
                  disabled={pending}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/settings/exercises` as Route);
                  }}
                >
                  Cancel
                </Button>
              </div>

              {item?.id ? (
                <div>
                  <Button
                    type="button"
                    size="xs"
                    variant="danger"
                    disabled={pending}
                    onClick={deleteExercise}
                  >
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </CardHeader>
    </Card>
  );
};
