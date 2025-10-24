import { categoriasRepo } from "@/infrastructure/http/categoriasRepo";

export async function deleteCategoria(id: string) {
  return categoriasRepo.delete(id);
}
