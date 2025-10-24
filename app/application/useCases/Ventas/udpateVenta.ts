import { ventasRepo } from "@/infrastructure/http/ventasRepo";

export async function updateVenta(id: string, data: any) {
  return await ventasRepo.update(id, data);
}
