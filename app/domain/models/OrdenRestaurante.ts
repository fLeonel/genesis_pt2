import { Cliente } from "./Cliente";
import { Producto } from "./Productos";
import { Combo } from "./Combo";
import { Mesa } from "./Mesa";

export type EstadoOrden =
  | "pendiente"
  | "en_preparacion"
  | "lista"
  | "servida"
  | "cancelada";
export type TipoOrden = "mesa" | "llevar" | "delivery";

export interface OrdenDetalle {
  id: string;
  tipo: "producto" | "combo";
  itemId: string;
  producto?: Producto;
  combo?: Combo;
  cantidad: number;
  precioUnitario: number;
  notas?: string;
  estado: EstadoOrden;
  tiempoPreparacion?: number; // en minutos
  createdAt?: string;
  preparadoAt?: string;
}

export interface OrdenRestaurante {
  id: string;
  mesaId?: string;
  mesa?: Mesa;
  clienteId?: string;
  cliente?: Cliente;
  tipo: TipoOrden;
  estado: EstadoOrden;
  detalles: OrdenDetalle[];
  total: number;
  notas?: string;
  tiempoEstimado?: number; // en minutos
  createdAt?: string;
  updatedAt?: string;
  servidaAt?: string;
}
