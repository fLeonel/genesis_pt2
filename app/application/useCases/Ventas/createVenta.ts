import { ventasRepo } from "@/infrastructure/http/ventasRepo";

export async function createVenta(data: any) {
  return await ventasRepo.create(data);
}
