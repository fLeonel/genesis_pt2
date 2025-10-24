"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiClient } from "@/infrastructure/http/apiClient";
import { recetasRepo } from "@/infrastructure/http/recetasRepo";

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

export default function CrearRecetaPage() {
  const router = useRouter();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    productoId: "",
  });
  const [detalles, setDetalles] = useState<RecetaDetalle[]>([]);
  const [ingredienteId, setIngredienteId] = useState("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [unidad, setUnidad] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await apiClient.get<Producto[]>("/api/productos");
        setProductos(res.data);
      } catch {
        toast.error("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // 🔹 Agregar ingrediente
  function handleAddIngrediente() {
    if (!ingredienteId || cantidad <= 0) {
      toast.error("Selecciona un ingrediente válido");
      return;
    }

    const producto = productos.find((p) => p.id === ingredienteId);
    if (!producto) return;

    const yaExiste = detalles.some(
      (d) => d.productoIngredienteId === producto.id,
    );
    if (yaExiste) {
      toast.error("Este ingrediente ya fue agregado");
      return;
    }

    const nuevo: RecetaDetalle = {
      productoIngredienteId: producto.id,
      nombre: producto.nombre,
      cantidadRequerida: cantidad,
      unidadMedida: unidad || producto.unidadMedida || "",
    };

    setDetalles((prev) => [...prev, nuevo]);
    setIngredienteId("");
    setCantidad(1);
    setUnidad("");
  }

  function handleRemoveIngrediente(pid: string) {
    setDetalles((prev) => prev.filter((d) => d.productoIngredienteId !== pid));
  }

  async function handleSave() {
    if (!formData.nombre.trim()) {
      toast.error("El nombre de la receta es obligatorio");
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
      await recetasRepo.create(payload);
      toast.success("Receta creada correctamente");
      router.push("/pages/inventario/recetas");
    } catch {
      toast.error("Error al crear receta");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">
          Cargando productos...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 px-10 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Crear nueva receta</h1>
      </div>

      {/* FORMULARIO PRINCIPAL */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la receta
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData((p) => ({ ...p, nombre: e.target.value }))
              }
              placeholder="Ej: Tamal de Pollo"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Producto final
            </label>
            <select
              value={formData.productoId}
              onChange={(e) =>
                setFormData((p) => ({ ...p, productoId: e.target.value }))
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
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
                setFormData((p) => ({ ...p, descripcion: e.target.value }))
              }
              placeholder="Notas o pasos de la receta..."
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* INGREDIENTES */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Ingredientes
        </h2>

        <div className="flex flex-wrap gap-4 items-end mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">
              Ingrediente
            </label>
            <select
              value={ingredienteId}
              onChange={(e) => setIngredienteId(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              min="0.01"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="mt-1 w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unidad
            </label>
            <input
              type="text"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              placeholder="g, ml, ud..."
              className="mt-1 w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
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

        {/* TABLA DE INGREDIENTES */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Ingrediente</th>
                <th className="px-4 py-3 text-left font-medium">Cantidad</th>
                <th className="px-4 py-3 text-left font-medium">Unidad</th>
                <th className="px-4 py-3 text-right font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
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
                detalles.map((d) => (
                  <tr key={d.productoIngredienteId}>
                    <td className="px-4 py-3">{d.nombre}</td>
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
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-8 mt-10 border-t border-gray-200">
        <button
          onClick={() => router.push("/pages/inventario/recetas")}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          type="button"
          className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Guardar Receta
        </button>
      </div>
    </div>
  );
}
