import {
  OrdenRestaurante,
  EstadoOrden,
} from "../../../../domain/models/OrdenRestaurante";

export async function updateEstadoOrden(
  id: string,
  estado: EstadoOrden
): Promise<OrdenRestaurante> {
  try {
    const response = await fetch(`/api/ordenes-restaurante/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el estado de la orden");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    throw error;
  }
}
