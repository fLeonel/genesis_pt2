import {
  OrdenRestaurante,
  OrdenDetalle,
  TipoOrden,
} from "../../../../domain/models/OrdenRestaurante";

interface CreateOrdenData {
  mesaId?: string;
  clienteId?: string;
  tipo: TipoOrden;
  detalles: Omit<OrdenDetalle, "id" | "estado" | "createdAt">[];
  notas?: string;
}

export async function createOrdenRestaurante(
  data: CreateOrdenData
): Promise<OrdenRestaurante> {
  try {
    const response = await fetch("/api/ordenes-restaurante", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        estado: "pendiente",
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear la orden");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear la orden:", error);
    throw error;
  }
}
