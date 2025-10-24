"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/infrastructure/http/apiClient";
import toast from "react-hot-toast";

interface Producto {
  id: string;
  nombre: string;
  unidadMedida?: string;
}

interface RecetaDetalle {
  productoIngredienteId: string;
  nombre: string;
  cantidadRequerida: number;
  unidadMedida?: string;
}

interface Receta {
  id: string;
  nombre: string;
  descripcion?: string;
  productoId: string;
  detalles: RecetaDetalle[];
}

export default function RecetaDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [receta, setReceta] = useState<Receta | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    productoId: "",
  });
  const [ingredienteId, setIngredienteId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [unidadMedida, setUnidadMedida] = useState("");
  const [loading, setLoading] = useState(true);

  const detalles = receta?.detalles ?? [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosRes = await apiClient.get<Producto[]>("/api/productos");
        setProductos(productosRes.data);

        if (id && id !== "crear") {
          const recetaRes = await apiClient.get<Receta>(`/api/recetas/${id}`);
          setReceta(recetaRes.data);
          setFormData({
            nombre: recetaRes.data.nombre,
            descripcion: recetaRes.data.descripcion || "",
            productoId: recetaRes.data.productoId,
          });
        }
      } catch {
        toast.error("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function handleAddIngrediente() {
    if (!ingredienteId || cantidad <= 0) {
      toast.error("Selecciona un ingrediente y una cantidad válida");
      return;
    }

    const producto = productos.find((p) => p.id === ingredienteId);
    if (!producto) return;

    const yaExiste = detalles.some(
      (d) => d.productoIngredienteId === producto.id,
    );
    if (yaExiste) {
      toast.error("Este ingrediente ya está agregado");
      return;
    }

    const nuevo: RecetaDetalle = {
      productoIngredienteId: producto.id,
      nombre: producto.nombre,
      cantidadRequerida: cantidad,
      unidadMedida: unidadMedida || producto.unidadMedida || "",
    };

    setReceta((prev) => ({
      ...(prev || { id: "", productoId: "", detalles: [] }),
      detalles: [...(prev?.detalles || []), nuevo],
    }));

    setIngredienteId("");
    setCantidad(1);
    setUnidadMedida("");
  }

  function handleRemoveIngrediente(pid: string) {
    setReceta((prev) =>
      prev
        ? {
            ...prev,
            detalles: prev.detalles.filter(
              (d) => d.productoIngredienteId !== pid,
            ),
          }
        : prev,
    );
  }

  async function handleSave() {
    if (!formData.nombre.trim()) {
      toast.error("La receta necesita un nombre");
      return;
    }
    if (!formData.productoId) {
      toast.error("Selecciona el producto final de la receta");
      return;
    }
    if (detalles.length === 0) {
      toast.error("Agrega al menos un ingrediente");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      productoId: formData.productoId,
      detalles: detalles.map((d) => ({
        productoIngredienteId: d.productoIngredienteId,
        cantidadRequerida: d.cantidadRequerida,
        unidadMedida: d.unidadMedida,
      })),
    };

    try {
      if (id === "crear") {
        await apiClient.post("/api/recetas", payload);
        toast.success("Receta creada correctamente");
      } else {
        await apiClient.put(`/api/recetas/${id}`, payload);
        toast.success("Receta actualizada correctamente");
      }
      router.push("/pages/inventario/recetas");
    } catch {
      toast.error("Error al guardar la receta");
    }
  }

  async function handleDelete() {
    if (!id || id === "crear") return;
    if (!confirm("¿Seguro que deseas eliminar esta receta?")) return;

    try {
      await apiClient.delete(`/api/recetas/${id}`);
      toast.success("Receta eliminada");
      router.push("/pages/inventario/recetas");
    } catch {
      toast.error("Error al eliminar receta");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">
          Cargando receta...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 px-10 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <input
            value={formData.nombre}
            onChange={(e) =>
              setFormData((p) => ({ ...p, nombre: e.target.value }))
            }
            placeholder="Nombre de la receta..."
            className="text-3xl font-semibold bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none w-full mb-1"
          />
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData((p) => ({ ...p, descripcion: e.target.value }))
            }
            placeholder="Descripción..."
            className="w-full border border-gray-300 rounded-md mt-2 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={formData.productoId}
            onChange={(e) =>
              setFormData((p) => ({ ...p, productoId: e.target.value }))
            }
            className="w-full mt-3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Producto resultante</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-6 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Ingrediente
          </label>
          <select
            value={ingredienteId}
            onChange={(e) => setIngredienteId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecciona ingrediente</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            min="0.1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unidad
          </label>
          <input
            type="text"
            value={unidadMedida}
            onChange={(e) => setUnidadMedida(e.target.value)}
            placeholder="g, ml, ud..."
            className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleAddIngrediente}
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Agregar
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Ingrediente</th>
              <th className="px-4 py-3 text-left">Cantidad</th>
              <th className="px-4 py-3 text-left">Unidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {detalles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 text-gray-400 italic"
                >
                  No hay ingredientes agregados
                </td>
              </tr>
            ) : (
              detalles.map((d, idx) => (
                <tr
                  key={`${d.productoIngredienteId || "temp"}-${idx}`}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td>{d.productoIngredienteNombre}</td>
                  <td className="px-4 py-3">{d.cantidadRequerida}</td>
                  <td className="px-4 py-3">{d.unidadMedida}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        handleRemoveIngrediente(d.productoIngredienteId)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 pt-8 mt-10 border-t border-gray-200">
        {id !== "crear" && (
          <button
            onClick={handleDelete}
            type="button"
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        )}
        <button
          onClick={handleSave}
          type="button"
          className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {id === "crear" ? "Guardar Receta" : "Guardar Cambios"}
        </button>
        <button
          onClick={() => router.push("/pages/inventario/recetas")}
          type="button"
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
