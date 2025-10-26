import { Combo } from "@/domain/models/Combo";
import { combosRepo } from "@/infrastructure/http/combosRepo";

export async function createCombo(data: Combo) {
  return await combosRepo.create(data);
}
