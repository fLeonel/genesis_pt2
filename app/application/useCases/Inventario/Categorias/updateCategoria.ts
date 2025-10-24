import { categoriasRepo } from "@/infrastructure/http/categoriasRepo";
import { CategoriaFormData } from "@/domain/validators/categoriaSchema";

export async function updateCategoria(id: string, data: CategoriaFormData) {
  return categoriasRepo.update(id, data);
}
