"use client";
import { Button } from "@/components/ui/Button";
import { Download, Trash, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/app/hooks/useToast";

export const Data = () => {
	const router = useRouter();
	const { showToast } = useToast();

	const handleResetData = async () => {
		console.log("Resetting data...");
		if (window.confirm("Are you sure you want to reset your data? This action cannot be undone.")) {
			const { error } = await api.data.resetData();
			if (error) {
				showToast("error", "Failed to reset data");
			} else {
				showToast("success", "Data reset successfully");
			}
			router.refresh();
		}
	};

	const handleExportData = async () => {
		const { data, error } = await api.data.exportData();
		if (error) {
			console.error("Error exporting data:", error);
			showToast("error", "Failed to export data");
			return;
		}

		if (!data) {
			console.error("No data exported");
			showToast("error", "No data to export");
			return;
		}

		const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `frogstar-backup-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
		showToast("success", "Data exported successfully");
	};

	const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!window.confirm("Are you sure you want to import data? This action cannot be undone.")) {
			return;
		}

		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = async (event) => {
			try {
				const data = JSON.parse(event.target?.result as string);
				const { data: importedData, error } = await api.data.importData(data);
				if (error) {
					console.error("Error importing data:", error);
					showToast("error", "Failed to import data");
					return;
				}

				if (!importedData) {
					console.error("No data imported");
					showToast("error", "Failed to import data");
					return;
				}

				showToast("success", "Data imported successfully");
			} catch (_e) {
				showToast("error", "Invalid file format");
			}
		};
		reader.readAsText(file);
	};

	return (
		<div>
			<div className="flex items-center justify-between my-4 mx-2">
				<h1 className="text-xl font-bold tracking-tight">Data Management</h1>
			</div>
			<div className="flex flex-col gap-4">
				<Card className="pt-4">
					<CardContent>
						<CardTitle>
							Export Data
						</CardTitle>
						<CardDescription>
							Download all your data as a backup file
						</CardDescription>
					</CardContent>
					<CardFooter>
						<Button size="sm" variant="primary" className="w-full" onClick={handleExportData}>
							<Download /> Export Data
						</Button>
					</CardFooter>
				</Card>

				<Card className="pt-4">
					<CardContent>
						<CardTitle>
							Import Data
						</CardTitle>
						<CardDescription>
							Upload a backup file to restore your data
						</CardDescription>
					</CardContent>
					<CardFooter>
						<Button size="sm" variant="outline" className="w-full" onClick={() => document.getElementById("import-data")?.click()}>
							<input
								type="file"
								accept=".json"
								onChange={handleImportData}
								id="import-data"
								className="hidden"
							/>
							<Upload /> Choose File
						</Button>
					</CardFooter>
				</Card>

				<Card className="pt-4 outline outline-red-500">
					<CardContent>
						<CardTitle>
							Reset Data
						</CardTitle>
						<CardDescription>
							Reset all your data
						</CardDescription>
					</CardContent>
					<CardFooter>
						<Button size="sm" onClick={handleResetData} variant="danger" className="w-full">
							<Trash /> Reset Data
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};
