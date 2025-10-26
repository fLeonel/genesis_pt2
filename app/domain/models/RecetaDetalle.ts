import { Producto } from "./Productos";

export interface RecetaDetalle {
  productoIngredienteId: string;
  productoIngredienteNombre: string;
  cantidadRequerida: number;
  unidadMedida: string;
}
