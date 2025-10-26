import { apiClient } from "./apiClient";

export const combosRepo = {
  async getAll() {
    const res = await apiClient.get("/api/combos");
    return res.data;
  },
  async getById(id: string) {
    const res = await apiClient.get(`/api/combos/${id}`);
    return res.data;
  },
  async create(data: unknown) {
    const res = await apiClient.post("/api/combos", data);
    return res.data;
  },
  async update(id: string, data: unknown) {
    const res = await apiClient.put(`/api/combos/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await apiClient.delete(`/api/combos/${id}`);
    return res.data;
  },
};
