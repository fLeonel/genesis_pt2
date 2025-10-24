import { Mesa } from "../../../../domain/models/Mesa";

interface CreateMesaData {
  numero: number;
  capacidad: number;
  ubicacion?: string;
  notas?: string;
}

export async function createMesa(data: CreateMesaData): Promise<Mesa> {
  try {
    const response = await fetch("/api/mesas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        estado: "disponible",
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear la mesa");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear la mesa:", error);
    throw error;
  }
}
