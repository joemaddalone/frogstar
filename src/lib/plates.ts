import { plates } from "@/db/schema";
import { createRepository } from "./repository";

const repository = createRepository(plates);

export const createPlate = repository.create;
export const getPlates = repository.list;
export const getPlate = repository.get;
export const updatePlate = repository.update;
export const deletePlate = repository.remove;
