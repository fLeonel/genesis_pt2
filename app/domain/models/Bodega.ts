import { Producto } from "@/domain/models/Productos";

export interface Bodega {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  nombre: string;
  descripcion?: string;
  bodegaPadreId?: string | null;
  bodegaPadre?: Bodega | null;
  subBodegas?: Bodega[];
  productos?: Producto[];
}
