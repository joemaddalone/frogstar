"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Route } from 'next';
import { useTranslations } from "next-intl";

export const BottomNav = () => {
	const pathname = usePathname();
	const t = useTranslations();

	const NAV_ITEMS = [
		{ label: t('common.home'), href: "/", icon: Home },
		// { label: "Stats", href: "/stats", icon: BarChart2 },
		{ label: t('common.settings'), href: "/settings", icon: Settings },
	];


	return (
		<footer className="bottom-nav">
			<nav className="flex items-center justify-around h-[72px]">
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = item.href === "/"
						? pathname === "/"
						: pathname.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href as Route}
							className={cn("bottom-nav-item", isActive && "active")}
						>
							<Icon className={cn("h-6 w-6 mb-1 transition-transform", isActive && "scale-110")} />
							<span className="text-[11px] font-bold uppercase tracking-wider">
								{item.label}
							</span>
						</Link>
					);
				})}
			</nav>
		</footer>
	);
};
