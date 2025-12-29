"use client";
import { User, Calculator, BicepsFlexed } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const SettingsNav = () => {
	const pathname = usePathname();

	return (
		<nav className="w-full border-b-1 border-gray-200">
			<div className="flex justify-around py-2">
				<Link href="/settings" className={pathname === "/settings" ? "bottom-nav-item active" : "bottom-nav-item"}>
					<User className="h-5 w-5" />
					<span className="text-xs mt-1">Preferences</span>
				</Link>
				<Link href="/settings/barbells" className={pathname === "/settings/barbells" ? "bottom-nav-item active" : "bottom-nav-item"}>
					<Calculator className="h-5 w-5" />
					<span className="text-xs mt-1">Barbells</span>
				</Link>
				<Link href="/settings/plates" className={pathname === "/settings/plates" ? "bottom-nav-item active" : "bottom-nav-item"}>
					<Calculator className="h-5 w-5" />
					<span className="text-xs mt-1">Plates</span>
				</Link>
				<Link href="/settings/exercises" className={pathname === "/settings/exercises" ? "bottom-nav-item active" : "bottom-nav-item"}>
					<BicepsFlexed className="h-5 w-5" />
					<span className="text-xs mt-1">Exercises</span>
				</Link>
			</div>
		</nav>
	);
};
