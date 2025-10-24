import { ventasRepo } from "@/infrastructure/http/ventasRepo";

export async function getVentas() {
  return await ventasRepo.getAll({ cache: "no-store" });
}
