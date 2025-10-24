import { clientesRepo } from "@/infrastructure/http/clientesRepo";

export async function getClienteById(id: string) {
  return await clientesRepo.getById(id);
}
