import { Producto } from "./Productos";

export interface Combo {
  id: string;
  nombre: string;
  descripcion?: string;
  productos: Producto[];
  precioTotal: number;
  createdAt?: string;
}
