export const dynamic = "force-dynamic";
import SettingsPageComponent from "@/app/(pages)/settings/_components/SettingsPageComponent";
import type { Plate } from '@/lib/types';

interface PageProps {
  params: {
    id?: string[];
  };
}

export default async function PlatesPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <SettingsPageComponent
      id={id}
      route="plates"
      titler={(item: Plate) => `${item.weight} - ${item.pairs} pairs`}
      comp='plate'
      type='plates'
    />
  );
}