"use client";
import { Card, CardHeader } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";

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
      <CardHeader className="flex-row items-center justify-between">
        <h1>{title}</h1>
        <ChevronRight className="h-5 w-5 text-base-content/20 group-hover:text-primary transition-colors" />
      </CardHeader>
    </Card>
  );
};
