import { clientesRepo } from "@/infrastructure/http/clientesRepo";

export async function deleteCliente(id: string) {
  return await clientesRepo.delete(id);
}
