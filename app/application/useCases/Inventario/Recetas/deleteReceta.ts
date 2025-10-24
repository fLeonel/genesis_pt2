import { recetasRepo } from "@/infrastructure/http/recetasRepo";

export async function deleteReceta(id: string) {
  return await recetasRepo.delete(id);
}
