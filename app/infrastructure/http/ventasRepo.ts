import { apiClient } from "./apiClient";

export const ventasRepo = {
  async getAll() {
    const res = await apiClient.get("/api/ventas");
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get(`/api/ventas/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await apiClient.post("/api/ventas", data);
    return res.data;
  },

  async update(id: string, data: any) {
    const res = await apiClient.put(`/api/ventas/${id}`, data);
    return res.data;
  },

  async confirmar(id: string) {
    const res = await apiClient.put(`/api/ventas/${id}/confirmar`);
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete(`/api/ventas/${id}`);
    return res.data;
  },
};
