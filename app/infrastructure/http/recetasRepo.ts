import { apiClient } from "./apiClient";

export const recetasRepo = {
  async getAll() {
    const res = await apiClient.get("/api/recetas");
    return res.data;
  },
  async getById(id: string) {
    const res = await apiClient.get(`/api/recetas/${id}`);
    return res.data;
  },
  async create(data: any) {
    const res = await apiClient.post("/api/recetas", data);
    return res.data;
  },
  async update(id: string, data: any) {
    const res = await apiClient.put(`/api/recetas/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await apiClient.delete(`/api/recetas/${id}`);
    return res.data;
  },
};
