import { Mesa, EstadoMesa } from "../../../../domain/models/Mesa";

export async function updateEstadoMesa(
  id: string,
  estado: EstadoMesa
): Promise<Mesa> {
  try {
    const response = await fetch(`/api/mesas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el estado de la mesa");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar el estado de la mesa:", error);
    throw error;
  }
}
