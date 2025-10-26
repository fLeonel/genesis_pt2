import { categoriasRepo } from "@/infrastructure/http/categoriasRepo";
import { CategoriaInput } from "@/domain/validators/categoriaSchema";

export async function updateCategoria(id: string, data: CategoriaInput) {
  return categoriasRepo.update(id, data);
}
