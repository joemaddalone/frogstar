export const dynamic = "force-dynamic";
import SettingsPageComponent from "@/app/(pages)/settings/_components/SettingsPageComponent";
import type { Exercise } from '@/lib/types'

interface PageProps {
  params: {
    id?: string[];
  };
}

export default async function ExercisesPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <SettingsPageComponent
      id={id}
      route="exercises"
      titler={(item: Exercise) => `${item.name} (${item.category})`}
      comp='exercise'
      type='exercises'
    />
  );
}