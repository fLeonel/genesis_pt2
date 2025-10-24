import { combosRepo } from "@/infrastructure/http/combosRepo";

export async function deleteCombo(id: string) {
  return await combosRepo.delete(id);
}
