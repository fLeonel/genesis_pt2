import { Categoria } from "@/domain/models/Categorias";

export interface ICategoriasRepo {
  getAll(): Promise<Categoria[]>;
  getById(id: string): Promise<Categoria>;
  create(data: Omit<Categoria, "id">): Promise<void>;
  update(id: string, data: Partial<Categoria>): Promise<void>;
  delete(id: string): Promise<void>;
}
