"use client";
import {
  Card,
  CardHeader,
  CardFooter,
  CommonCardFormActions,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import type { Route } from "next";
import type { Plate, InsertablePlate } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useSettingsForm } from "@/app/hooks/useSettingsForm";

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
  const t = useTranslations();
  const { onDelete, createAction } = useSettingsForm<Plate, InsertablePlate, FormState>("plates", item);

  const action = createAction((formData) => ({
    pairs: Number(formData.get("plate_pairs")),
    weight: Number(formData.get("plate_weight")),
  }));

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
                label={t("common.weight")}
                name="plate_weight"
                type="number"
                size="sm"
                step="any"
                defaultValue={item?.weight}
                placeholder={t("common.weight")}
              />

              <Input
                label={t("common.pairs")}
                name="plate_pairs"
                type="number"
                size="sm"
                defaultValue={item?.pairs}
                placeholder={t("common.pairs")}
              />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between gap-2">
          <CommonCardFormActions
            onCancel={() => {
              router.push(`/settings/plates` as Route);
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
