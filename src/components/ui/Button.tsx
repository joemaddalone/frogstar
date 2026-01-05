import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 transition-transform duration-100",
	{
		variants: {
			variant: {
				primary: "btn btn-primary text-white hover:brightness-110",
				secondary: "btn btn-secondary text-white hover:brightness-110",
				ghost: "btn btn-ghost hover:bg-base-200",
				outline: "btn btn-outline border-base-300 hover:bg-base-200",
				danger: "btn btn-error text-white hover:brightness-110",
			},
			size: {
				default: "h-11 px-6",
				sm: "h-9 px-3 text-xs",
				lg: "h-12 px-8 text-base",
				icon: "h-10 w-10",
				xs: "h-6 px-2 text-xs",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	}
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
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
