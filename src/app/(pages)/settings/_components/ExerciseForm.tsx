"use client";
import { Exercise, InsertableExercise } from "@/db/schema";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Route } from "next";
import { ApiResponse } from "@/lib/types";

type FormState = {
  exercise_name?: string;
  exercise_category?: string;
};

const initialState: FormState = {
  exercise_name: "",
  exercise_category: "",
};

export const ExerciseForm = ({ item }: { item?: Exercise }) => {
  const router = useRouter();

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
    let response: ApiResponse<Exercise>;

		const newExercise: Partial<Exercise> = {
      name: name,
			category:category
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

  const [plateData, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="mb-2">
      <CardHeader>
        <form action={formAction}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                name="exercise_name"
                type="text"
                className="input"
                defaultValue={item?.name}
                placeholder="Name"
              />
              <input
                name="exercise_category"
                type="text"
                className="input"
                defaultValue={item?.category}
                placeholder="Category"
              />
            </div>
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

              {item?.id  ? (
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
