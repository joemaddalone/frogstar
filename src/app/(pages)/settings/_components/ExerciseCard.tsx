"use client";
import {
	Card,
	CardDescription,
	CardHeader,
	CardHeaderActions,
} from "@/components/ui/Card";
import { Exercise } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
export const ExerciseCard = ({ exercise }: { exercise: Exercise; }) => {
	const [showEdit, setShowEdit] = useState(false);

	const deleteExercise = () => {
		api.exercises.delete(exercise.id);
	};

	const formAction = async (formData: FormData) => {
		const name = formData.get("name");
		const category = formData.get("category");
		const equipmentType = formData.get("equipmentType");
		setShowEdit(false);
	};
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
							<Button
								size="xs"
								variant="danger"
								onClick={() => deleteExercise()}
							>
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
									name="name"
									type="text"
									className="input"
									defaultValue={exercise.name}
									placeholder="Name"
								/>
								<input
									name="category"
									type="text"
									className="input"
									defaultValue={exercise.category}
									placeholder="Category"
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
					<>
						{exercise.name} ({exercise.category})
						<CardDescription>{exercise.equipmentType}</CardDescription>
					</>
				)}
			</CardHeader>
		</Card>
	);
};
