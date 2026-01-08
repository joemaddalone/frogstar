import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
	"flex w-full border border-base-300 bg-base-100 px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base-content/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
	{
		variants: {
			variant: {
				default: "rounded-xl",
				ghost: "border-0 bg-base-200/50 focus-visible:bg-base-100",
			},
			size: {
				default: "h-12",
				sm: "h-10 px-3 text-sm",
				lg: "h-14 px-6 text-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
	VariantProps<typeof inputVariants> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, size, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input, inputVariants };
