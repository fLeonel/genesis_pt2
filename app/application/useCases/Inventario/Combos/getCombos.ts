import { combosRepo } from "@/infrastructure/http/combosRepo";

export async function getCombos() {
  return await combosRepo.getAll();
}
