import { ventasRepo } from "@/infrastructure/http/ventasRepo";

export async function deleteVenta(id: string) {
  return await ventasRepo.delete(id);
}
