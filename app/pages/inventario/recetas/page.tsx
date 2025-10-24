"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/infrastructure/http/apiClient";
import toast from "react-hot-toast";

interface Receta {
  id: string;
  nombre: string;
  descripcion?: string;
  productoId: string;
  detalles: {
    productoIngredienteId: string;
    cantidadRequerida: number;
    unidadMedida?: string;
  }[];
}

export default function RecetasPage() {
  const router = useRouter();
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecetas() {
    try {
      const [recetasRes, productosRes] = await Promise.all([
        apiClient.get<Receta[]>("/api/recetas"),
        apiClient.get<any[]>("/api/productos"),
      ]);

      const productosMap = new Map(
        productosRes.data.map((p) => [p.id, p.nombre]),
      );

      const recetasConNombres = recetasRes.data.map((r) => ({
        ...r,
        productoNombre: productosMap.get(r.productoId) || "Desconocido",
        ingredientes: r.detalles.map((d) => ({
          ...d,
          productoNombre:
            productosMap.get(d.productoIngredienteId) || "Desconocido",
        })),
      }));

      setRecetas(recetasConNombres);
    } catch (err) {
      toast.error("Error al cargar recetas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecetas();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar esta receta?")) return;

    try {
      await apiClient.delete(`/api/recetas/${id}`);
      toast.success("Receta eliminada correctamente");
      setRecetas((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Error al eliminar receta");
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 px-10 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Recetas</h1>
        <button
          onClick={() => router.push("/pages/inventario/recetas/crear")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          + Nueva Receta
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-gray-500 text-sm animate-pulse">
            Cargando recetas...
          </p>
        </div>
      ) : recetas.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] text-gray-500">
          <p className="text-lg">No hay recetas registradas</p>
          <button
            onClick={() => router.push("/pages/inventario/recetas/crear")}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Crear primera receta
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Nombre</th>
                <th className="px-6 py-3 text-left font-medium">Descripción</th>
                <th className="px-6 py-3 text-left font-medium">
                  Producto Final
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  Ingredientes
                </th>
                <th className="px-6 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recetas.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    {r.nombre}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {r.descripcion || "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {r.productoNombre || "Sin asignar"}
                  </td>

                  <td className="px-6 py-3 text-gray-700">
                    {r.detalles && r.detalles.length > 0
                      ? r.detalles
                          .map((d) => d.productoIngredienteNombre)
                          .join(", ")
                      : "Sin ingredientes"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {r.detalles?.length || 0} ingredientes
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() =>
                          router.push(`/pages/inventario/recetas/${r.id}`)
                        }
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
