import { recetasRepo } from "@/infrastructure/http/recetasRepo";

export async function createReceta(data: any) {
  return await recetasRepo.create(data);
}
