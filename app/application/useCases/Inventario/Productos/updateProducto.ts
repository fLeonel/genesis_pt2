import { productosRepo } from "@/infrastructure/http/productosRepo";
import { Producto } from "@/domain/models/Producto";

export async function updateProducto(id: string, data: Partial<Producto>) {
  return await productosRepo.update(id, data);
}
