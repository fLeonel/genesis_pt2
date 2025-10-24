import { OrdenRestaurante } from "../../../../domain/models/OrdenRestaurante";

export async function getOrdenesCocina(): Promise<OrdenRestaurante[]> {
  try {
    const response = await fetch(
      "/api/ordenes-restaurante?estado=pendiente,en_preparacion"
    );
    if (!response.ok) {
      throw new Error("Error al obtener las órdenes de cocina");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener las órdenes de cocina:", error);
    throw error;
  }
}
