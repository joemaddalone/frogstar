"use client";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import type { Route } from "next";
import type { ApiResponse, Barbell, InsertableBarbell } from "@/lib/types";


type FormState = {
  barbell_name?: string;
  barbell_weight?: string;
};

const initialState: FormState = {
  barbell_name: "",
  barbell_weight: "",
};

export const BarbellForm = ({ item }: { item?: Barbell; }) => {
  const router = useRouter();
  const deleteBarbell = async () => {
    if (item?.id) {
      const { error } = await api.barbells.delete(item.id);
      if (!error) {
        router.push(`/settings/barbells` as Route);
      }
    }
  };

  const action = async (state: FormState, formData: FormData) => {
    const name = formData.get("barbell_name")?.toString();
    const weight = Number(formData.get("barbell_weight"));
    let response: ApiResponse<Barbell>;
    const newBarbell: Partial<Barbell> = {
      name: name,
      weight: weight,
    };
    const isNew = item?.id;
    if (isNew) {
      newBarbell.id = item.id;
      response = await api.barbells.update(newBarbell as Barbell);
    } else {
      response = await api.barbells.create(newBarbell as InsertableBarbell);
    }
    if (response.error) {
      return state;
    }
    if (!response.data?.id) {
      return state;
    }
    router.push(`/settings/barbells` as Route);
    return state;
  };

  const [_barbellData, formAction, pending] = useActionState(
    action,
    initialState
  );

  return (
    <Card className="mb-2">
      <CardHeader>
        <form action={formAction}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                name="barbell_name"
                type="text"
                className="input"
                defaultValue={item?.name}
                placeholder="Name"
              />
              <input
                name="barbell_weight"
                type="number"
                className="input"
                defaultValue={item?.weight}
                placeholder="Weight"
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
                    router.push(`/settings/barbells` as Route);
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
                    onClick={deleteBarbell}
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
