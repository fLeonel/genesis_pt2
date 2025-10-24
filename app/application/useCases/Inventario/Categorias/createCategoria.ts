import { categoriasRepo } from "@/infrastructure/http/categoriasRepo";
import { CategoriaFormData } from "@/domain/validators/categoriaSchema";

export async function createCategoria(data: CategoriaFormData) {
  return categoriasRepo.create(data);
}
