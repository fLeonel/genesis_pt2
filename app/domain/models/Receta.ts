import { RecetaDetalle } from "./RecetaDetalle";

export interface Receta {
  id: string;
  nombre: string;
  descripcion?: string;
  productoId: string;
  productoNombre?: string;
  detalles: {
    productoIngredienteId: string;
    productoIngredienteNombre?: string;
    cantidadRequerida: number;
    unidadMedida?: string;
  }[];
}
