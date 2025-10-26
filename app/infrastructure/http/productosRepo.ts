import { apiClient } from "./apiClient";
import { Producto } from "@/domain/models/Productos";

export const productosRepo = {
  async getAll() {
    const res = await apiClient.get<Producto[]>("/api/productos");
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get<Producto>(`/api/productos/${id}`);
    return res.data;
  },

  async create(data: Omit<Producto, "id">) {
    const res = await apiClient.post("/api/productos", data);
    return res.data;
  },

  async update(id: string, data: Partial<Producto>) {
    const res = await apiClient.put(`/api/productos/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete(`/api/productos/${id}`);
    return res.data;
  },
};
