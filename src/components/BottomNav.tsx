"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Settings, BarChart2, Plus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Route } from 'next';
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/api";
import type { InsertableSession } from "@/lib/types";

export const BottomNav = () => {
	const pathname = usePathname();
	const router = useRouter();
	const t = useTranslations();
	const [creating, setCreating] = useState(false);

	const handleLogWorkout = async (e: React.MouseEvent) => {
		e.preventDefault();
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
		{
			label: t('common.home'),
			href: "/",
			icon: Home
		},
		{
			label: "Stats",
			href: "/stats",
			icon: BarChart2
		},
		{
			label: "Log",
			href: "#",
			icon: Plus,
			isFab: true,
			onClick: handleLogWorkout
		},
		{
			label: t('common.settings'),
			href: "/settings",
			icon: Settings
		},
		{
			label: "About",
			href: "/about",
			icon: Info
		},
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-200 pb-[env(safe-area-inset-bottom)]">
			<div className="flex items-center justify-around h-16 px-2">
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = item.href === "/"
						? pathname === "/"
						: pathname.startsWith(item.href) && item.href !== "#";

					if (item.isFab) {
						return (
							<div key="fab" className="relative -top-8">
								<button
									type="button"
									onClick={item.onClick}
									disabled={creating}
									className={cn(
										"flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform active:scale-95",
										"bg-primary text-primary-content hover:bg-primary-focus border-4 border-base-200 outline outline-1 outline-base-400",
										creating && "opacity-70 cursor-wait"
									)}
									aria-label="Log Workout"
								>
									<Icon className={cn("w-8 h-8", creating && "animate-spin")} />
								</button>
							</div>
						);
					}

					return (
						<Link
							key={item.href}
							href={item.href as Route}
							aria-current={isActive ? "page" : undefined}
							className={cn(
								"flex flex-col items-center justify-center w-full h-full space-y-[2px]",
								"text-base-content/50 hover:text-base-content transition-colors",
								isActive && "text-primary"
							)}
						>
							<Icon
								className={cn(
									"w-6 h-6 transition-all duration-200",
									isActive ? "stroke-[2.5px]" : "stroke-2"
								)}
							/>
							<span className={cn(
								"text-[10px] font-medium transition-all",
								isActive ? "font-bold scale-105" : ""
							)}>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};
