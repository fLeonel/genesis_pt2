import { combosRepo } from "@/infrastructure/http/combosRepo";

export async function getComboById(id: string) {
  return await combosRepo.getById(id);
}
