"use client";
import { User, Calculator, BicepsFlexed } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from 'next/navigation';
import { useTranslations } from "next-intl";

export const SettingsNav = () => {
	const pathname = usePathname();
	const t = useTranslations();

	return (
		<nav className="w-full border-b-1 border-gray-200">
			<div className="flex justify-around py-2">
				<Link href="/settings" className={pathname === "/settings" ? "bottom-nav-item active" : "bottom-nav-item"}>
					<User className="h-5 w-5" />
					<span className="text-xs mt-1">{t("common.preferences")}</span>
				</Link>
				<Link href={`/settings/barbells` as Route} className={pathname.includes("/settings/barbells") ? "bottom-nav-item active" : "bottom-nav-item"}>
					<Calculator className="h-5 w-5" />
					<span className="text-xs mt-1">{t("common.barbells")}</span>
				</Link>
				<Link href={`/settings/plates` as Route} className={pathname.includes("/settings/plates") ? "bottom-nav-item active" : "bottom-nav-item"}>
					<Calculator className="h-5 w-5" />
					<span className="text-xs mt-1">{t("common.plates")}</span>
				</Link>
				<Link href={`/settings/exercises` as Route} className={pathname.includes("/settings/exercises") ? "bottom-nav-item active" : "bottom-nav-item"}>
					<BicepsFlexed className="h-5 w-5" />
					<span className="text-xs mt-1">{t("common.exercises")}</span>
				</Link>
			</div>
		</nav>
	);
};
