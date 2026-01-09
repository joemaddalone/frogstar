"use client";
import { User, Dumbbell, CircleStar, BicepsFlexed } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from 'next/navigation';
import { useTranslations } from "next-intl";

export const SettingsNav = () => {
	const pathname = usePathname();
	const t = useTranslations();

	const items = [
		{
			href: "/settings",
			icon: User,
			label: t("common.preferences"),
		},
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
	];

	return (
		<nav className="w-full border-b-1 border-gray-200">
			<div className="flex justify-around py-2">
				{
					items.map((item) => (
						<Link key={item.href} href={item.href as Route} className={pathname === item.href ? "bottom-nav-item active" : "bottom-nav-item"}>
							<item.icon className="h-5 w-5" />
							<span className="text-xs mt-1">{item.label}</span>
						</Link>
					))
				}
			</div>
		</nav>
	);
};
