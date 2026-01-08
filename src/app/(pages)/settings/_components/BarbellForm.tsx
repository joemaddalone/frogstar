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
    initialState,
  );

  return (
    <Card className="mb-2">
      <form action={formAction}>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                label="Name"
                name="barbell_name"
                type="text"
                size="sm"
                className="w-60"
                defaultValue={item?.name}
                placeholder="EZ Curl Bar"
              />

              <Input
                label="Weight"
                name="barbell_weight"
                type="number"
                size="sm"
                className="w-20"
                defaultValue={item?.weight}
                placeholder="25"
              />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between gap-2">
          <CommonCardFormActions
            onCancel={() => {
              router.push(`/settings/barbells` as Route);
            }}
            onDestroy={deleteBarbell}
            showDestroy={Boolean(item?.id)}
            pending={pending}
          />
        </CardFooter>
      </form>
    </Card>
  );
};
