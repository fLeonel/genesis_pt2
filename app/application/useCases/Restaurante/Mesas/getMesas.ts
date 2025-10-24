import { Mesa } from "../../../../domain/models/Mesa";

export async function getMesas(): Promise<Mesa[]> {
  try {
    const response = await fetch("/api/mesas");
    if (!response.ok) {
      throw new Error("Error al obtener las mesas");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener las mesas:", error);
    throw error;
  }
}
