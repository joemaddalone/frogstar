import * as React from "react";
import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./Button";
import type { Route } from "next";

export interface ButtonLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
	VariantProps<typeof buttonVariants> {
	href: string | Route;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
	({ className, variant, size, href, ...props }, ref) => {
		return (
			<Link
				href={href as Route}
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
ButtonLink.displayName = "ButtonLink";

export { ButtonLink };
