"use client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/Header";

export default function DesignSystemPage() {
	return (
		<div className="bg-base-200 min-h-screen pb-24">
			<Header title="Design System" />
			<main className="container-custom space-y-12 pt-20">
				{/* Typography */}
				<section className="space-y-4">
					<h2 className="text-2xl font-bold border-b pb-2">Typography</h2>
					<div className="space-y-2">
						<h1 className="text-4xl font-extrabold uppercase tracking-tight">Heading 1</h1>
						<h2 className="text-3xl font-bold tracking-tight">Heading 2</h2>
						<h3 className="text-2xl font-semibold">Heading 3</h3>
						<p className="text-base text-base-content/80 line-clamp-2">
							Body text with base content and opacity. This is a longer paragraph to test line clamping and readability of the Inter font.
						</p>
					</div>
				</section>

				{/* Buttons */}
				<section className="space-y-4">
					<h2 className="text-2xl font-bold border-b pb-2">Buttons</h2>
					<div className="flex flex-wrap gap-4">
						<Button variant="primary">Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="danger">Danger</Button>
					</div>
					<div className="flex flex-wrap gap-4 items-center">
						<Button size="sm">Small</Button>
						<Button size="default">Default</Button>
						<Button size="lg">Large</Button>
					</div>
				</section>

				{/* Cards */}
				<section className="space-y-4">
					<h2 className="text-2xl font-bold border-b pb-2">Cards</h2>
					<div className="grid gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Standard Card</CardTitle>
								<CardDescription>This is a description of the card.</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm">Main content area for the card.</p>
							</CardContent>
							<CardFooter className="justify-end gap-2">
								<Button variant="ghost">Cancel</Button>
								<Button>Confirm</Button>
							</CardFooter>
						</Card>
					</div>
				</section>

				{/* Badges */}
				<section className="space-y-4">
					<h2 className="text-2xl font-bold border-b pb-2">Badges</h2>
					<div className="flex flex-wrap gap-2">
						<Badge>Default</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="outline">Outline</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="error">Error</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="info">Info</Badge>
						<Badge variant="ghost">Ghost</Badge>
					</div>
				</section>

				{/* Inputs */}
				<section className="space-y-4">
					<h2 className="text-2xl font-bold border-b pb-2">Inputs</h2>
					<div className="space-y-4">
						<Input placeholder="Enter something..." />
						<Input type="email" placeholder="Email address" />
						<Input disabled placeholder="Disabled input" />
					</div>
				</section>
			</main>
		</div>
	);
}

