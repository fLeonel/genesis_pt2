import { combosRepo } from "@/infrastructure/http/combosRepo";

export async function createCombo(data: any) {
  return await combosRepo.create(data);
}
