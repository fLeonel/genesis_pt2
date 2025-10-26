import { Bodega } from "@/domain/models/Bodega";
import { bodegasRepo } from "@/infrastructure/http/bodegaRepo";

export async function getBodegaById(id: string): Promise<Bodega> {
  try {
    return await bodegasRepo.getById(id);
  } catch (e) {
    console.error(`Error al obtener bodega con id ${id}`);
    throw e;
  }
}
