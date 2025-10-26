import { Venta } from "@/domain/models/Venta";
import { ventasRepo } from "@/infrastructure/http/ventasRepo";

export async function getVentas(): Promise<Venta[]> {
  return await ventasRepo.getAll();
}
