import { productosRepo } from "@/infrastructure/http/productosRepo";

export async function deleteProducto(id: string) {
  return await productosRepo.delete(id);
}
