"use client";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import type { Route } from "next";
import type { ApiResponse, Plate, InsertablePlate } from "@/lib/types";

type FormState = {
  plate_pairs?: string;
  plate_weight?: string;
};

const initialState: FormState = {
  plate_pairs: "",
  plate_weight: "",
};

export const PlateForm = ({ item }: { item?: Plate; }) => {
  const router = useRouter();

  const deletePlate = async () => {
    if (item?.id) {
      const { error } = await api.plates.delete(item.id);
      if (!error) {
        router.push(`/settings/plates` as Route);
      }
    }
  };

  const action = async (state: FormState, formData: FormData) => {
    const pairs = Number(formData.get("plate_pairs"));
    const weight = Number(formData.get("plate_weight"));
    let response: ApiResponse<Plate>;
    const newPlate: Partial<Plate> = {
      pairs: pairs,
      weight: weight,
    };
    const isNew = item?.id;

    if (isNew) {
      newPlate.id = item.id;
      response = await api.plates.update(newPlate as Plate);
    } else {
      response = await api.plates.create(newPlate as InsertablePlate);
    }

    if (response.error) {
      return state;
    }
    if (!response.data?.id) {
      return state;
    }
    router.push(`/settings/plates` as Route);
    return state;
  };

  const [_plateData, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="mb-2">
      <CardHeader>
        <form action={formAction}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Weight</legend>
                <Input
                  name="plate_weight"
                  type="number"
                  size="sm"
                  step="any"
                  defaultValue={item?.weight}
                  placeholder="Weight"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Pairs</legend>
                <Input
                  name="plate_pairs"
                  type="number"
                  size="sm"
                  defaultValue={item?.pairs}
                  placeholder="Pairs"
                />
              </fieldset>
            </div>
            <div className="flex justify-between gap-2 mt-5">
              <div className="space-x-2">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={pending}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/settings/plates` as Route);
                  }}
                >
                  Cancel
                </Button>
              </div>

              {item?.id ? (
                <div>
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    disabled={pending}
                    onClick={deletePlate}
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
