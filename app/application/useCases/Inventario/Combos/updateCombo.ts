import { combosRepo } from "@/infrastructure/http/combosRepo";

export async function updateCombo(id: string, data: any) {
  return await combosRepo.update(id, data);
}
