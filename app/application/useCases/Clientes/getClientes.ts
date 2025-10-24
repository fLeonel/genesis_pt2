import { clientesRepo } from "@/infrastructure/http/clientesRepo";

export async function getClientes() {
  return await clientesRepo.getAll();
}
