"use client";
import { Barbell } from "@/db/schema";
import {
	Card,
	CardHeader,
	CardHeaderActions,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Edit, Trash } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";

type FormState = {
  barbell_name?: string;
  barbell_weight?: string;
};

const initialState: FormState = {
  barbell_name: '',
  barbell_weight: '',
};



export const BarbellCard = ({ barbell }: { barbell: Barbell; }) => {
	const [showEdit, setShowEdit] = useState(false);
	const router = useRouter();
	const deleteBarbell = async () => {
		const { error } = await api.barbells.delete(barbell.id);
		if (!error) {
			router.refresh();
		}
	};

	const action = async (state: FormState, formData: FormData) => {
		const name = formData.get("barbell_name")?.toString();
		const weight = Number(formData.get("barbell_weight"));
		const newBarbell: Barbell = {
			id: barbell.id,
			name: name || barbell.name,
			weight: weight || barbell.weight,
		};
		const { data, error } = await api.barbells.update(newBarbell);
		if (error) {
			return state;
		}
		if (!data?.id) {
			return state;
		}
		router.refresh();
		setShowEdit(false);
		return state;
	};

	const [barbellData, formAction, pending] = useActionState(action, initialState);

	return (
		<Card className="mb-2">
			<CardHeader>
				<CardHeaderActions>
					{!showEdit ? (
						<>
							<Button
								size="xs"
								variant="outline"
								onClick={() => setShowEdit(true)}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button size="xs" variant="danger" onClick={deleteBarbell}>
								<Trash className="h-4 w-4" />
							</Button>
						</>
					) : (
						<></>
					)}
				</CardHeaderActions>
				{showEdit ? (
					<form action={formAction}>
						<div className="space-y-2">
							<div className="flex gap-2">
								<input
									name="barbell_name"
									type="text"
									className="input"
									defaultValue={barbell.name}
									placeholder="Name"
								/>
								<input
									name="barbell_weight"
									type="number"
									className="input"
									defaultValue={barbell.weight}
									placeholder="Weight"
								/>
							</div>
							<div className="flex gap-2">
								<Button
									type="submit"
									className="w-45"
									size="xs"
									variant="primary"
								>
									Save
								</Button>
								<Button
									type="button"
									className="w-45"
									size="xs"
									variant="outline"
									onClick={() => setShowEdit(false)}
								>
									Cancel
								</Button>
							</div>
						</div>
					</form>
				) : (
					<h1>
						{barbell.name} - {barbell.weight} lbs
					</h1>
				)}
			</CardHeader>
		</Card>
	);
};
