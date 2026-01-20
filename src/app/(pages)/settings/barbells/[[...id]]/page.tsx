export const dynamic = "force-dynamic";
import SettingsPageComponent from "@/app/(pages)/settings/_components/SettingsPageComponent";
import type { Barbell } from '@/lib/types';

interface PageProps {
  params: {
    id?: string[];
  };
}

export default async function BarbellsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <SettingsPageComponent
      id={id}
      titler={(item: Barbell) => `${item?.name} - ${item?.weight}`}
      type='barbells'
    />
  );
}
