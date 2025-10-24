import { Cliente } from "./Cliente";
import { Producto } from "./Productos";
import { Combo } from "./Combo";

export interface VentaDetalle {
  id: string;
  tipo: "producto" | "combo";
  itemId: string;
  // Para mantener compatibilidad con datos existentes
  productoId?: string;
  producto?: Producto;
  combo?: Combo;
  cantidad: number;
  precioUnitario: number;
  createdAt?: string;
}

export type EstadoVenta = "borrador" | "confirmada";

export interface Venta {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  metodoPago: string;
  notas?: string;
  total: number;
  estado: EstadoVenta;
  detalles: VentaDetalle[];
  createdAt?: string;
  confirmedAt?: string;
}
