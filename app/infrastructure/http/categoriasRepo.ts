import { ICategoriasRepo } from "@/application/ports/ICategoriasRepo";
import { Categoria } from "@/domain/models/Categorias";
import { apiClient } from "./apiClient";

export const categoriasRepo: ICategoriasRepo = {
  async getAll() {
    const res = await apiClient.get<Categoria[]>("/api/categorias");
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get<Categoria>(`/api/categorias/${id}`);
    return res.data;
  },

  async create(data: Omit<Categoria, "id">) {
    const res = await apiClient.post("/api/categorias", data);
    return res.data;
  },

  async update(id: string, data: Partial<Categoria>) {
    const res = await apiClient.put(`/api/categorias/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete(`/api/categorias/${id}`);
    return res.data;
  },
};
