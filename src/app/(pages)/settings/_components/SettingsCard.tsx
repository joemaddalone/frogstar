"use client";
import { Card, CardHeader } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import type { Route } from "next";

export const SettingsCard = ({
  title,
  path,
}: {
  title: string;
  path: Route;
}) => {
  const router = useRouter();
  return (
    <Card className="cursor-pointer mb-2" onClick={() => router.push(path)}>
      <CardHeader>
        <h1>{title}</h1>
      </CardHeader>
    </Card>
  );
};
