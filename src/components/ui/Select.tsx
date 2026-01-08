import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
	"flex w-full select border border-base-300 bg-base-100 px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
	{
		variants: {
			variant: {
				default: "rounded-xl",
				// ghost: "border-0 bg-base-200/50 focus-visible:bg-base-100",
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

export interface SelectProps
	extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
	VariantProps<typeof selectVariants> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, variant, size, children, ...props }, ref) => {
		return (
			<select
				className={cn(selectVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			>
				{children}
			</select>
		);
	}
);
Select.displayName = "Select";

export { Select, selectVariants };
