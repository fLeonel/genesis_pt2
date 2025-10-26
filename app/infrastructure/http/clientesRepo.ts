import { apiClient } from "./apiClient";

export const clientesRepo = {
  async getAll() {
    const res = await apiClient.get("/api/clientes");
    return res.data;
  },
  async getById(id: string) {
    const res = await apiClient.get(`/api/clientes/${id}`);
    return res.data;
  },
  async create(data: unknown) {
    const res = await apiClient.post("/api/clientes", data);
    return res.data;
  },
  async update(id: string, data: unknown) {
    const res = await apiClient.put(`/api/clientes/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await apiClient.delete(`/api/clientes/${id}`);
    return res.data;
  },
};
