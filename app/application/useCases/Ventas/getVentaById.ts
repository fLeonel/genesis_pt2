import { ventasRepo } from "@/infrastructure/http/ventasRepo";

export async function getVentaById(id: string) {
  return await ventasRepo.getById(id);
}
