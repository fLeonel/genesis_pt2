import { Combo } from "@/domain/models/Combo";
import { combosRepo } from "@/infrastructure/http/combosRepo";

export async function updateCombo(id: string, data: Combo) {
  return await combosRepo.update(id, data);
}
