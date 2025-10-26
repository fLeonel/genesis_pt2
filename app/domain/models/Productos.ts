import { Categoria } from "./Categorias";
import { Receta } from "./Receta";

export interface Producto {
  id: string;
  nombre: string;
  categoriaId: string;
  categoria?: Categoria;
  descripcion?: string;
  precioPublico: number;
  costoUnitario: number;
  bodegaId: string;
  cantidadDisponible: number;
  unidadMedida: string;
  sePuedeVender: boolean;
  sePuedeComprar: boolean;
  esFabricado: boolean;
  atributos?: Record<string, string>;
  receta?: Receta | null;
  createdAt?: string;
}
