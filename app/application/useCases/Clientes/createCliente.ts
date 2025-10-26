import { clientesRepo } from "@/infrastructure/http/clientesRepo";

export async function createCliente(data: unknown) {
  return await clientesRepo.create(data);
}
