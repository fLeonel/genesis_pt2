import { categoriasRepo } from "@/infrastructure/http/categoriasRepo";

export async function getCategorias() {
  const categorias = await categoriasRepo.getAll();
  return categorias.map((c) => ({
    id: c.id,
    nombre: c.nombre,
  }));
}
