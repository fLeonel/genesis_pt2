import {
  categoriaSchema,
  CategoriaInput,
} from "@/domain/validators/categoriaSchema";
import { categoriasRepo } from "@/infrastructure/http/categoriasRepo";

export async function createCategoria(data: CategoriaInput) {
  const parsed = categoriaSchema.parse(data);
  return categoriasRepo.create(parsed);
}
