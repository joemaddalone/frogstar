"use server";

import { api } from "@/lib/api";
import { BarbellForm } from "@/app/(pages)/settings/_components/BarbellForm";
import { PlateForm } from "@/app/(pages)/settings/_components/PlateForm";
import { ExerciseForm } from "@/app/(pages)/settings/_components/ExerciseForm";
import { SettingsCard } from "@/app/(pages)/settings/_components/SettingsCard";
import { Header } from "@/components/Header";
import { Plus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { Barbell, Exercise, Plate } from "@/lib/types";

type SettingsApiEndpoint = "barbells" | "plates" | "exercises";

interface Props {
  id?: string;
  type?: SettingsApiEndpoint;
  // biome-ignore lint/suspicious/noExplicitAny: i dont care
  titler: (a: any) => string;
}

// sorts
const sorters = {
  barbells: (a: Barbell, b: Barbell) => b.weight - a.weight,
  plates: (a: Plate, b: Plate) => b.weight - a.weight,
  exercises: (a: Exercise, b: Exercise) => a.name.localeCompare(b.name),
};

export default async function SettingsPageComponent(props: Props) {
  if (!props.type) return null;

  const { data } = await api[props.type].list();
  // biome-ignore lint/suspicious/noExplicitAny: i dont care
  const sortedData = data?.sort(sorters[props.type] as any);

  const { id, titler, type } = props;

  const activeId = id;
  const foundItem = sortedData?.find(
    (b: Barbell | Plate | Exercise) => b.id.toString() === activeId,
  );

  return (
    <>
      <Header label={type} />
      <div className="flex items-center justify-end my-4 mx-2">
        {!activeId ? (
          <Link
            href={`/settings/${type}/new` as Route}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 transition-transform duration-100 btn btn-ghost hover:bg-base-200 h-9 px-3 text-xs"
          >
            <Plus className="mr-1" /> New
          </Link>
        ) : null}
      </div>
      {!activeId && sortedData?.length ? (
        sortedData?.map((item: Barbell | Plate | Exercise) => (
          <SettingsCard
            key={item.id}
            title={titler(item)}
            path={`/settings/${type}/${item.id}` as Route}
          />
        ))
      ) : type === "barbells" ? (
        <BarbellForm key={activeId} item={foundItem as Barbell | undefined} />
      ) : type === "plates" ? (
        <PlateForm key={activeId} item={foundItem as Plate | undefined} />
      ) : type === "exercises" ? (
        <ExerciseForm key={activeId} item={foundItem as Exercise | undefined} />
      ) : null}
    </>
  );
}
