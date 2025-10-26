import { Bodega } from "@/domain/models/Bodega";
import { bodegasRepo } from "@/infrastructure/http/bodegaRepo";

export async function getBodegas(): Promise<Bodega[]> {
  try {
    return await bodegasRepo.getAll();
  } catch (error) {
    console.error("Error al obtener bodegas:", error);
    throw error;
  }
}
