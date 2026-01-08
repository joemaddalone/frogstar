"use client";
import {
  Card,
  CardHeader,
  CardFooter,
  CommonCardFormActions,
} from "@/components/ui/Card";
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
                label="Weight"
                name="plate_weight"
                type="number"
                size="sm"
                step="any"
                defaultValue={item?.weight}
                placeholder="Weight"
              />

              <Input
                label="Pairs"
                name="plate_pairs"
                type="number"
                size="sm"
                defaultValue={item?.pairs}
                placeholder="Pairs"
              />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between gap-2">
          <CommonCardFormActions
            onCancel={() => {
              router.push(`/settings/plates` as Route);
            }}
            onDestroy={deletePlate}
            showDestroy={Boolean(item?.id)}
            pending={pending}
          />
        </CardFooter>
      </form>
    </Card>
  );
};
