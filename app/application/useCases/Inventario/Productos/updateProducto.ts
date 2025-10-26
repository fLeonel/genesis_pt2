import { productosRepo } from "@/infrastructure/http/productosRepo";
import { Producto } from "@/domain/models/Productos";

export async function updateProducto(id: string, data: Partial<Producto>) {
  return await productosRepo.update(id, data);
}
