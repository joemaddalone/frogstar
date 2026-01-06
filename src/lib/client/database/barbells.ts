import { barbells } from "@/db/schema";
import { createRepository } from "@/lib/client/database/repository";

const repository = createRepository(barbells);

export const createBarbell = repository.create;
export const getBarbells = repository.list;
export const getBarbell = repository.get;
export const updateBarbell = repository.update;
export const deleteBarbell = repository.remove;

