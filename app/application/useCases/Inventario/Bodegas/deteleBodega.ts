import { bodegasRepo } from "@/infrastructure/http/bodegaRepo";

export async function deleteBodega(id: string): Promise<void> {
  try {
    await bodegasRepo.delete(id);
  } catch (error) {
    console.error(`Error al eliminar la bodega ${id}:`, error);
    throw error;
  }
}
