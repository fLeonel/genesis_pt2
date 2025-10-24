import { recetasRepo } from "@/infrastructure/http/recetasRepo";

export async function updateReceta(id: string, data: any) {
  return await recetasRepo.update(id, data);
}
