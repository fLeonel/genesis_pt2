import { ventasRepo } from "@/infrastructure/http/ventasRepo";

export async function confirmarVenta(id: string) {
  return await ventasRepo.confirmar(id);
}
