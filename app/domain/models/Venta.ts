export interface VentaDetalle {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export type EstadoVenta =
  | "Pendiente"
  | "Confirmada"
  | "Cancelada"
  | "Entregada";

export interface Venta {
  id: string;
  fecha: string;
  total: number;
  metodoPago: string;
  estado: EstadoVenta;
  notas?: string;
  clienteId: string;
  clienteNombre: string;
  clienteNit: string;
  detalles: VentaDetalle[];
}
