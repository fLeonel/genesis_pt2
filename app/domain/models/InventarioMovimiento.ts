export interface InventarioMovimiento {
  id: string;
  productoId: string;
  ordenId: string;
  recetaId?: string;
  cantidadUtilizada: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  motivo: string;
  createdAt?: string;
}
