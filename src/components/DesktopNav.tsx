"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CircleStar, BicepsFlexed, BarChart2, Plus, Dumbbell, Database, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Route } from 'next';
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { api } from "@/lib/api";
import type { InsertableSession } from "@/lib/types";
// import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const DesktopNav = () => {
	const pathname = usePathname();
	const router = useRouter();
	const t = useTranslations();
	const [creating, setCreating] = useState(false);

	const handleLogWorkout = async () => {
		if (creating) return;
		setCreating(true);
		try {
			const newSession: InsertableSession = {
				date: new Date(),
			};
			const { data } = await api.sessions.create(newSession);
			if (data?.id) {
				router.push(`/session/${data.id}`);
			}
		} catch (e) {
			console.error("Failed to create session", e);
		} finally {
			setCreating(false);
		}
	};

	const NAV_ITEMS = [
		{ label: t('common.sessions'), href: "/", icon: Home },
		{ label: "Stats", href: "/stats", icon: BarChart2 },
		{ label: "Barbells", href: "/settings/barbells", icon: Dumbbell },
		{ label: "Plates", href: "/settings/plates", icon: CircleStar },
		{ label: "Exercises", href: "/settings/exercises", icon: BicepsFlexed },
		{ label: "Data", href: "/settings/data", icon: Database },
		{ label: "About", href: "/about", icon: Info },
	];

	return (
		<aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-base-200 bg-base-100 z-50">
			<div className="p-6">
				<h1 className="text-2xl font-black tracking-tight text-primary">frogstar</h1>
			</div>

			<div className="px-4 mb-6">
				<Button
					onClick={handleLogWorkout}
					disabled={creating}
					className="w-full justify-start gap-2"
					size="lg"
				>
					<Plus className={cn("w-5 h-5", creating && "animate-spin")} />
					{creating ? "Creating..." : "New Session"}
				</Button>
			</div>

			<nav className="flex-1 px-4 space-y-2">
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = item.href === "/"
						? pathname === "/"
						: pathname.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href as Route}
							aria-current={isActive ? "page" : undefined}
							className={cn(
								"flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
								"text-base font-medium",
								isActive
									? "bg-primary/10 text-primary hover:bg-primary/15"
									: "text-base-content/70 hover:bg-base-200 hover:text-base-content"
							)}
						>
							<Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
							{item.label}
						</Link>
					);
				})}
			</nav>

			{/* <div className="p-4 border-t border-base-200">
				<div className="flex items-center justify-between px-2">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center font-bold">
							U
						</div>
						<div className="flex-1">
							<p className="text-sm font-medium">User</p>
							<p className="text-xs text-base-content/50">Free Account</p>
						</div>
					</div>

				</div>
			</div> */}
		</aside>
	);
};
