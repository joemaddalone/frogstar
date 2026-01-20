"use client";

interface HeaderProps {
	title?: string;
	label?: string;
	children?: React.ReactNode;
}

export const Header = ({ title, label, children }: HeaderProps) => {
	const displayTitle = title || label || "Frogstar";
	return (
		<header className="top-nav">
			<nav className="flex items-center justify-between px-4 h-[64px]">
				<div className="flex items-center gap-2">
					<h1 className="text-xl font-extrabold tracking-tight capitalize">
						{displayTitle}
					</h1>
				</div>
				<div className="flex items-center gap-2">
					{children}
				</div>
			</nav>
		</header>
	);
};
