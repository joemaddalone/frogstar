export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
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
