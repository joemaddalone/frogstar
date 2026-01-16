import { Header } from "@/components/Header";
import { version } from "../../../../package.json";

export default function AboutPage() {
	return (
		<div className="min-h-screen">
			<Header label="about frogstar" />
			<main className="space-y-4">
				<p><span className="font-bold">Version:</span> {version}</p>
				<p><span className="font-bold">Source:</span> <a className="link" href="https://github.com/joemaddalone/frogstar" target="_blank" rel="noopener noreferrer">https://github.com/joemaddalone/frogstar</a></p>
				<p><span className="font-bold">Author:</span> <a className="link" href="https://github.com/joemaddalone" target="_blank" rel="noopener noreferrer">Joe Maddalone</a></p>
				<p><span className="font-bold">Like this software?</span> <a className="link" href="https://buymeacoffee.com/joemaddalone" target="_blank" rel="noopener noreferrer">Buy me a coffee</a></p>
			</main>
		</div>
	);
}
