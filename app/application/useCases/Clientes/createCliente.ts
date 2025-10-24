import { clientesRepo } from "@/infrastructure/http/clientesRepo";

export async function createCliente(data: any) {
  return await clientesRepo.create(data);
}
