"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/Card";

export const DataCard = ({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) => {
	return (
		<Card className="pt-4">
			<CardContent>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardContent>
			<CardFooter>{children}</CardFooter>
		</Card>
	);
};