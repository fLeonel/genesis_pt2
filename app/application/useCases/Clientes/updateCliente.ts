import { clientesRepo } from "@/infrastructure/http/clientesRepo";

export async function updateCliente(id: string, data: unknown) {
  return await clientesRepo.update(id, data);
}
