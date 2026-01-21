"use client";
import { Dumbbell, CircleStar, BicepsFlexed, Database } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from 'next/navigation';
import { useTranslations } from "next-intl";

export const SettingsNav = () => {
	const pathname = usePathname();
	const t = useTranslations();

	const items = [
		{
			href: "/settings/barbells",
			icon: Dumbbell,
			label: t("common.barbells"),
		},
		{
			href: "/settings/plates",
			icon: CircleStar,
			label: t("common.plates"),
		},
		{
			href: "/settings/exercises",
			icon: BicepsFlexed,
			label: t("common.exercises"),
		},
		{
			href: "/settings/data",
			icon: Database,
			label: t("common.data"),
		},
	];

	const isActive = (href: string) => {
		if (href === "/settings/barbells" && pathname === '/settings') {
			return true;
		}
		return pathname.includes(href);
	};

	return (
		<nav className="w-full border-b-1 border-gray-200">
			<div className="flex justify-around py-2">
				{
					items.map((item) => (
						<Link key={item.href} href={item.href as Route} className={isActive(item.href) ? "bottom-nav-item active" : "bottom-nav-item"}>
							<item.icon className="h-5 w-5" />
							<span className="text-xs mt-1">{item.label}</span>
						</Link>
					))
				}
			</div>
		</nav>
	);
};
