"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/infrastructure/http/apiClient";
import toast from "react-hot-toast";

interface Producto {
  id: string;
  nombre: string;
  precioPublico: number;
}

export default function CrearComboPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precioTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Producto[]>("/api/productos")
      .then((res) => setProductos(res.data))
      .catch(() => toast.error("Error al cargar productos"))
      .finally(() => setLoading(false));
  }, []);

  function toggleProducto(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSave() {
    if (!formData.nombre.trim()) {
      toast.error("El combo necesita un nombre");
      return;
    }
    if (selectedIds.length === 0) {
      toast.error("Selecciona al menos un producto");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precioTotal: formData.precioTotal,
      productosIds: selectedIds, // ✅ sólo IDs
    };

    try {
      await apiClient.post("/api/combos", payload);
      toast.success("Combo creado correctamente 🎁");
      router.push("/pages/inventario/combos");
    } catch (err) {
      toast.error("Error al crear combo");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 animate-pulse">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="p-10 w-full min-h-[calc(100vh-80px)] bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Crear nuevo combo
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData((p) => ({ ...p, nombre: e.target.value }))
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Ej: Combo Navideño"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio Total (Q)
            </label>
            <input
              type="number"
              value={formData.precioTotal}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  precioTotal: Number(e.target.value),
                }))
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((p) => ({ ...p, descripcion: e.target.value }))
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Detalles del combo..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Selecciona productos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p) => (
            <div
              key={p.id}
              onClick={() => toggleProducto(p.id)}
              className={`cursor-pointer border rounded-lg p-4 transition ${
                selectedIds.includes(p.id)
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <h3 className="font-medium text-gray-800">{p.nombre}</h3>
              <p className="text-sm text-gray-500">Q{p.precioPublico}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8 gap-3">
        <button
          onClick={() => router.push("/pages/inventario/combos")}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Guardar Combo
        </button>
      </div>
    </div>
  );
}
