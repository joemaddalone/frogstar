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
import type { Barbell, InsertableBarbell } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useSettingsForm } from "@/app/hooks/useSettingsForm";

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
  const t = useTranslations();
  const { onDelete, createAction } = useSettingsForm<Barbell, InsertableBarbell, FormState>("barbells", item);

  const action = createAction((formData) => ({
    name: formData.get("barbell_name")?.toString(),
    weight: Number(formData.get("barbell_weight")),
  }));

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
                label={t("common.name")}
                name="barbell_name"
                type="text"
                size="sm"
                className="w-60"
                defaultValue={item?.name}
                placeholder="EZ Curl Bar"
              />

              <Input
                label={t("common.weight")}
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
            onDestroy={() => onDelete()}
            showDestroy={Boolean(item?.id)}
            pending={pending}
          />
        </CardFooter>
      </form>
    </Card>
  );
};
