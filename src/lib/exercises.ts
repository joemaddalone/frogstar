import { exercises } from "@/db/schema";
import { createRepository } from "./repository";

const repository = createRepository(exercises);

export const createExercise = repository.create;
export const getExercises = repository.list;
export const getExercise = repository.get;
export const updateExercise = repository.update;
export const deleteExercise = repository.remove;
