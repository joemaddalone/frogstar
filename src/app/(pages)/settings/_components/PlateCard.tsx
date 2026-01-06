"use client";
import { Plate } from "@/db/schema";
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
  plate_pairs?: string;
  plate_weight?: string;
};

const initialState: FormState = {
  plate_pairs: '',
  plate_weight: '',
};


export const PlateCard = ({ plate }: { plate: Plate; }) => {
	const [showEdit, setShowEdit] = useState(false);
	const router = useRouter();
	const deletePlate = async () => {
		const { error } = await api.plates.delete(plate.id);
		if (!error) {
			router.refresh();
		}
	};

	const action = async (state: FormState, formData: FormData) => {
		const pairs = Number(formData.get("plate_pairs"));
		const weight = Number(formData.get("plate_weight"));
		const newPlate: Plate = {
			id: plate.id,
			pairs: pairs || plate.pairs,
			weight: weight || plate.weight,
		};
		const { data, error } = await api.plates.update(newPlate);
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
							<Button size="xs" variant="danger" onClick={deletePlate}>
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
									name="plate_weight"
									type="number"
									className="input"
									defaultValue={plate.weight}
									placeholder="Weight"
								/>
								<input
									name="plate_pairs"
									type="number"
									className="input"
									defaultValue={plate.pairs}
									placeholder="Pairs"
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
						{plate.weight} lbs - {plate.pairs} pairs
					</h1>
				)}
			</CardHeader>
		</Card>
	);
};