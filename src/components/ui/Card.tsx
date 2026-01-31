import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { useTranslations } from "next-intl";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"border border-base-300 bg-base-100 text-base-content shadow-sm overflow-hidden",
			className,
			"hover:shadow-md transition-all duration-200 group"
		)}
		{...props}
	/>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("relative flex flex-col space-y-1.5 p-5", className)}
		{...props}
	/>
));
CardHeader.displayName = "CardHeader";

const CardHeaderActions = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("absolute top-4 right-4 space-x-2", className)}
		{...props}
	/>
));
CardHeaderActions.displayName = "CardHeaderActions";

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"text-2xl font-semibold leading-none tracking-tight",
			className
		)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn("text-md text-base-content/60", className)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-5 pt-0", className)}
		{...props}
	/>
));
CardFooter.displayName = "CardFooter";

interface CardAffirmProps {
	pending?: boolean;
	label?: string;

}
const CardAffirm = ({ pending, label }: CardAffirmProps) => {
	const t = useTranslations();
	return (
		<Button
			type="submit"
			size="sm"
			variant="primary"
			disabled={pending}
		>
			{label || t('common.save')}
		</Button>
	);
};

interface CardCancelProps {
	onClick?: (e: React.PointerEvent<HTMLButtonElement>) => void;
	label?: string;
	pending?: boolean;
}

const CardCancel = ({ onClick, label, pending }: CardCancelProps) => {
	const t = useTranslations();
	return (
		<Button
			type="button"
			size="sm"
			variant="outline"
			onClick={onClick}
			disabled={pending}
		>
			{label || t('common.cancel')}
		</Button>
	);
};

interface CardDestroyProps {
	onClick?: (e: React.PointerEvent<HTMLButtonElement>) => void;
	label?: string;
	pending?: boolean;
}

const CardDestroy = ({ onClick, label, pending }: CardDestroyProps) => {
	const t = useTranslations();
	return (
		<Button
			type="button"
			size="sm"
			variant="danger"
			onClick={onClick}
			disabled={pending}
		>
			{label || t('common.delete')}
		</Button>
	);
};


const CommonCardFormActions = ({
	onCancel,
	onDestroy,
	showDestroy,
	pending,
}: {
	onCancel?: (e: React.PointerEvent<HTMLButtonElement>) => void;
	onDestroy?: (e: React.PointerEvent<HTMLButtonElement>) => void;
	showDestroy?: boolean;
	pending?: boolean;
}) => {
	return (
		<>
			<div className="space-x-2">
				<CardAffirm pending={pending} />
				<CardCancel
					onClick={onCancel}
					pending={pending}
				/>
			</div>

			{showDestroy && onDestroy ? (
				<CardDestroy pending={pending} onClick={onDestroy} />
			) : null}
		</>
	);
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardHeaderActions, CardAffirm, CardCancel, CardDestroy, CommonCardFormActions };
