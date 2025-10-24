import { Producto } from "./Producto";

export interface RecetaDetalle {
  productoIngredienteId: string;
  productoIngredienteNombre: string;
  cantidadRequerida: number;
  unidadMedida: string;
}
