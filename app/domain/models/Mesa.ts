export type EstadoMesa = "disponible" | "ocupada" | "reservada" | "limpieza";

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  estado: EstadoMesa;
  ubicacion?: string;
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
}
