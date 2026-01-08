import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-95 duration-100",
	{
		variants: {
			variant: {
				primary:
					"btn btn-primary text-white hover:brightness-105 active:brightness-95",
				secondary:
					"btn btn-secondary text-white hover:brightness-105 active:brightness-95",
				ghost: "btn btn-ghost hover:bg-base-200 active:bg-base-300",
				outline:
					"btn btn-outline border-base-300 hover:bg-base-200 active:bg-base-300",
				danger:
					"btn btn-error text-white hover:brightness-105 active:brightness-95",
			},
			size: {
				default: "h-12 px-6",
				sm: "h-10 px-4 text-xs",
				lg: "h-14 px-8 text-base",
				icon: "h-11 w-11",
				xs: "h-8 px-3 text-xs",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
