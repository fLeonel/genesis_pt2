import { productosRepo } from "@/infrastructure/http/productosRepo";

export async function getProductos() {
  return await productosRepo.getAll();
}
