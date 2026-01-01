export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SessionForm } from "@/app/(pages)/session/_components/SessionForm";
export default async function SessionPage() {

	return (
		<>
			<Header label="new session" backPath="/" />
			<main>
				<SessionForm />
			</main>
		</>
	);
}
