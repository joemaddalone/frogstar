"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Route } from 'next'

const NAV_ITEMS = [
	{ label: "Home", href: "/", icon: Home },
	{ label: "Stats", href: "/stats", icon: BarChart2 },
	{ label: "Settings", href: "/settings", icon: Settings },
];

export const BottomNav = () => {
	const pathname = usePathname();

	return (
		<footer className="bottom-nav">
			<nav className="flex items-center justify-around h-[64px]">
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
							<Icon className="h-5 w-5 mb-1" />
							<span className="text-[10px] font-medium uppercase tracking-tighter">
								{item.label}
							</span>
						</Link>
					);
				})}
			</nav>
		</footer>
	);
};
