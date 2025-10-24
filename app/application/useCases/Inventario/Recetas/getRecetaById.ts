import { recetasRepo } from "@/infrastructure/http/recetasRepo";

export async function getRecetaById(id: string) {
  return await recetasRepo.getById(id);
}
