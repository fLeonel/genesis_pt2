import { Bodega } from "@/domain/models/Bodega";
import { bodegasRepo } from "@/infrastructure/http/bodegaRepo";

export async function updateBodega(
  id: string,
  data: Partial<Bodega>,
): Promise<Bodega> {
  try {
    const payload = {
      id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      bodegaPadreId: data.bodegaPadreId || null,
    };

    return await bodegasRepo.update(id, payload);
  } catch (error) {
    console.error(`Error al actualizar la bodega ${id}:`, error);
    throw error;
  }
}
