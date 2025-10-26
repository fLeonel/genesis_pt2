import { Bodega } from "@/domain/models/Bodega";
import { bodegasRepo } from "@/infrastructure/http/bodegaRepo";

export async function createBodega(data: Omit<Bodega, "id">): Promise<Bodega> {
  try {
    return await bodegasRepo.create(data);
  } catch (e) {
    console.error(`Error al crear la bodega: ${e}`);
    throw e;
  }
}
