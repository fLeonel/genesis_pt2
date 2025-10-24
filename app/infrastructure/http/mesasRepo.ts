import { Mesa, EstadoMesa } from "../../domain/models/Mesa";
import { apiClient } from "./apiClient";

export class MesasRepo {
  async getAllMesas(): Promise<Mesa[]> {
    const response = await apiClient.get("/mesas");
    return response.data;
  }

  async getMesaById(id: string): Promise<Mesa> {
    const response = await apiClient.get(`/mesas/${id}`);
    return response.data;
  }

  async createMesa(
    mesa: Omit<Mesa, "id" | "createdAt" | "updatedAt">
  ): Promise<Mesa> {
    const response = await apiClient.post("/mesas", mesa);
    return response.data;
  }

  async updateMesa(id: string, mesa: Partial<Mesa>): Promise<Mesa> {
    const response = await apiClient.put(`/mesas/${id}`, mesa);
    return response.data;
  }

  async updateEstadoMesa(id: string, estado: EstadoMesa): Promise<Mesa> {
    const response = await apiClient.patch(`/mesas/${id}`, { estado });
    return response.data;
  }

  async deleteMesa(id: string): Promise<void> {
    await apiClient.delete(`/mesas/${id}`);
  }
}
