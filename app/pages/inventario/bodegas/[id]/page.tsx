"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/infrastructure/http/apiClient";
import toast from "react-hot-toast";
import { getBodegas } from "@/application/useCases/Inventario/Bodegas/getBodega";

interface Bodega {
  id: string;
  nombre: string;
  descripcion?: string;
  bodegaPadreId?: string | null;
  createdAt: string;
}

export default function BodegaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [bodega, setBodega] = useState<Bodega | null>(null);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    bodegaPadreId: "",
  });

  useEffect(() => {
    if (!id) return;

    Promise.all([apiClient.get<Bodega>(`/api/bodegas/${id}`), getBodegas()])
      .then(([bodegaRes, bodegasRes]) => {
        setBodega(bodegaRes.data);
        setBodegas(bodegasRes);
        setFormData({
          nombre: bodegaRes.data.nombre,
          descripcion: bodegaRes.data.descripcion || "",
          bodegaPadreId: bodegaRes.data.bodegaPadreId || "",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    try {
      const res = await apiClient.put(`/api/bodegas/${id}`, formData);
      if (res.status === 204) {
        toast.success("Bodega actualizada");
        router.push("/pages/inventario/bodegas");
      }
    } catch {
      toast.error("Error al actualizar la bodega");
    }
  }

  async function handleDelete() {
    if (!confirm("¿Deseas eliminar esta bodega?")) return;
    try {
      await apiClient.delete(`/api/bodegas/${id}`);
      toast.success("Bodega eliminada");
      router.push("/pages/inventario/bodegas");
    } catch {
      toast.error("Error al eliminar la bodega");
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] text-gray-500 text-sm">
        Cargando bodega...
      </div>
    );

  if (!bodega)
    return (
      <div className="p-8 text-center text-gray-500">Bodega no encontrada.</div>
    );

  function getBodegaPath(bodega: Bodega, bodegas: Bodega[]): string {
    const path = [bodega.nombre];
    let current = bodega;

    while (current.bodegaPadreId) {
      const padre = bodegas.find((b) => b.id === current.bodegaPadreId);
      if (!padre) break;
      path.unshift(padre.nombre);
      current = padre;
    }
    return path.join(" / ");
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-gray-50 px-12 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Editar Bodega</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bodega Padre
          </label>
          <select
            value={formData.bodegaPadreId}
            onChange={(e) =>
              setFormData({ ...formData, bodegaPadreId: e.target.value })
            }
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Sin padre</option>
            {bodegas
              .filter((b) => b.id !== id)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {getBodegaPath(b, bodegas)}
                </option>
              ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            rows={4}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-8 mt-12 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push("/pages/inventario/bodegas")}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
