import { apiClient } from "@/infrastructure/http/apiClient";

export interface DashboardStats {
  totalCategorias: number;
  totalProductos: number;
  totalCombos: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [categoriasRes, productosRes, combosRes] = await Promise.allSettled([
      apiClient.get("/api/categorias"),
      apiClient.get("/api/productos"),
      apiClient.get("/api/combos"),
    ]);

    const totalCategorias =
      categoriasRes.status === "fulfilled"
        ? categoriasRes.value.data?.length || 0
        : 0;

    const totalProductos =
      productosRes.status === "fulfilled"
        ? productosRes.value.data?.length || 0
        : 0;

    const totalCombos =
      combosRes.status === "fulfilled" ? combosRes.value.data?.length || 0 : 0;

    return { totalCategorias, totalProductos, totalCombos };
  } catch (err) {
    console.error("Error cargando estadísticas del dashboard:", err);
    return { totalCategorias: 0, totalProductos: 0, totalCombos: 0 };
  }
}
