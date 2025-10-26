import { productosRepo } from "@/infrastructure/http/productosRepo";
import { Producto } from "@/domain/models/Productos";

export async function createProducto(data: Omit<Producto, "id">) {
  return await productosRepo.create(data);
}
