import { apiClient } from "./apiClient";
import { Bodega } from "@/domain/models/Bodega";

export const bodegasRepo = {
  async getAll() {
    const res = await apiClient.get<Bodega[]>("/api/bodegas");
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get<Bodega>(`/api/bodegas/${id}`);
    return res.data;
  },

  async create(data: Omit<Bodega, "id">) {
    const res = await apiClient.post("/api/bodegas", data);
    return res.data;
  },

  async update(id: string, data: Partial<Bodega>) {
    const payload = {
      ...data,
      bodegaPadreId:
        data.bodegaPadreId === "" || data.bodegaPadreId === undefined
          ? null
          : data.bodegaPadreId,
    };
    console.log(id, payload);

    const res = await apiClient.put(`/api/bodegas/${id}`, payload);
    console.log("restpuesta");
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete(`/api/bodegas/${id}`);
    return res.data;
  },
};
