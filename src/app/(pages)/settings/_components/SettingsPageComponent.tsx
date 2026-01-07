"use server";

import { api } from "@/lib/api";
import { BarbellForm } from "@/app/(pages)/settings/_components/BarbellForm";
import { PlateForm } from "@/app/(pages)/settings/_components/PlateForm";
import { ExerciseForm } from "@/app/(pages)/settings/_components/ExerciseForm";
import { SettingsCard } from "@/app/(pages)/settings/_components/SettingsCard";
import { Header } from "@/components/Header";
import { Plus } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { Barbell, Exercise, Plate } from "@/lib/types";

interface Props {
  id?: string[];
  route: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titler: (a: any) => string;
  comp: "barbell" | "plate" | "exercise";
}

const components = {
  barbell: BarbellForm,
  plate: PlateForm,
	exercise: ExerciseForm
};

export default async function SettingsPageComponent(props: Props) {
  const { data } = await api[props.type as keyof typeof api].list();
  const { id, comp, titler, route } = props;
  const Component = components[comp];
  const activeId = id ? id[0] : undefined;
  const foundItem = data?.find((b) => b.id.toString() === activeId);
  let activeItem: Plate | Exercise | Barbell;
  switch (comp) {
    case "barbell":
      activeItem = foundItem as Barbell;
			break;
    case "plate":
      activeItem = foundItem as Plate;
			break;
    case "exercise":
      activeItem = foundItem as Exercise;
			break;
  }


  return (
    <>
      <Header label="settings/barbells" backPath="/settings" />
      <div className="flex items-center justify-between my-4 mx-2">
        <h2 className="text-xl font-bold tracking-tight">{comp}</h2>
        {!activeId ? (
          <Link
            href={`/settings/${route}/new` as Route}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 transition-transform duration-100 btn btn-ghost hover:bg-base-200 h-9 px-3 text-xs"
          >
            <Plus className="mr-1" /> New
          </Link>
        ) : null}
      </div>
      {!activeId && data?.length ? (
        data?.map((item) => (
          <SettingsCard
            key={item.id}
            title={titler(item)}
            path={`/settings/${route}/${item.id}` as Route}
          />
        ))
      ) : (
        <Component key={activeId} item={activeItem} />
      )}
    </>
  );
}
