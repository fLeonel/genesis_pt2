import { productosRepo } from "@/infrastructure/http/productosRepo";

export async function getProductoById(id: string) {
  return await productosRepo.getById(id);
}
