"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCategorias } from "@/application/useCases/Inventario/Categorias/getCategorias";
import { apiClient } from "@/infrastructure/http/apiClient";
import { Producto } from "@/domain/models/Producto";
import toast from "react-hot-toast";

export default function ProductoDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<
    { id: string; nombre: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "general" | "contabilidad" | "extras"
  >("general");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoriaId: "",
    precioPublico: 0,
    costoUnitario: 0,
    cantidadDisponible: 0,
    unidadMedida: "",
    sePuedeVender: true,
    sePuedeComprar: false,
    esFabricado: false,
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [productoRes, categoriasRes] = await Promise.all([
          apiClient.get<Producto>(`/api/productos/${id}`),
          getCategorias(),
        ]);

        setProducto(productoRes.data);
        setCategorias(categoriasRes);
        setFormData({
          nombre: productoRes.data.nombre,
          descripcion: productoRes.data.descripcion || "",
          categoriaId: productoRes.data.categoriaId || "",
          precioPublico: productoRes.data.precioPublico,
          costoUnitario: productoRes.data.costoUnitario,
          cantidadDisponible: productoRes.data.cantidadDisponible,
          unidadMedida: productoRes.data.unidadMedida,
          sePuedeVender: productoRes.data.sePuedeVender,
          sePuedeComprar: productoRes.data.sePuedeComprar,
          esFabricado: productoRes.data.esFabricado,
        });
      } catch (err) {
        toast.error("Error cargando producto");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  async function handleSave() {
    if (!producto) return;

    const cambios = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== (producto as any)[key],
      ),
    );

    if (Object.keys(cambios).length === 0) {
      toast("No hay cambios para guardar");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5009/api/productos/${producto.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...producto, ...cambios }),
        },
      );

      if (!res.ok) throw new Error();
      toast.success("Producto actualizado correctamente");
      router.refresh();
    } catch {
      toast.error("Error al guardar los cambios");
    }
  }

  async function handleDelete() {
    if (!producto) return;
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const res = await fetch(
        `http://localhost:5009/api/productos/${producto.id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error();
      toast.success("Producto eliminado");
      router.push("/pages/inventario/productos");
    } catch {
      toast.error("Error al eliminar producto");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">
          Cargando producto...
        </p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="p-8 text-center text-gray-500">
        Producto no encontrado.
      </div>
    );
  }

  return (
    <form className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-gray-50 px-12 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="flex-1">
          <input
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            placeholder="Nombre del producto..."
            className="text-4xl font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none w-full mb-1"
          />
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 flex-wrap">
          {[
            { key: "sePuedeVender", label: "Se puede vender" },
            { key: "sePuedeComprar", label: "Se puede comprar" },
            { key: "esFabricado", label: "Es fabricado" },
          ].map((flag) => (
            <label
              key={flag.key}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={(formData as any)[flag.key]}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, [flag.key]: e.target.checked }))
                }
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              {flag.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 text-sm overflow-x-auto">
        {[
          { key: "general", label: "Información General" },
          { key: "contabilidad", label: "Contabilidad" },
          { key: "extras", label: "Extras" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 border-b-2 whitespace-nowrap ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <select
              value={formData.categoriaId}
              onChange={(e) =>
                setFormData({ ...formData, categoriaId: e.target.value })
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unidad de medida *
            </label>
            <input
              value={formData.unidadMedida}
              onChange={(e) =>
                setFormData({ ...formData, unidadMedida: e.target.value })
              }
              placeholder="Ej: unidad, libra, litro..."
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad disponible *
            </label>
            <input
              type="number"
              value={formData.cantidadDisponible}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cantidadDisponible: Number(e.target.value),
                })
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={4}
              placeholder="Describe el producto..."
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {activeTab === "contabilidad" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio público *
            </label>
            <input
              type="number"
              value={formData.precioPublico}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  precioPublico: Number(e.target.value),
                })
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Costo unitario *
            </label>
            <input
              type="number"
              value={formData.costoUnitario}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  costoUnitario: Number(e.target.value),
                })
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {activeTab === "extras" && (
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            Aquí podrás agregar atributos personalizados o subir imágenes del
            producto.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-8 mt-12 border-t border-gray-200">
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
        <button
          type="button"
          onClick={() => router.push("/pages/inventario/productos")}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Volver
        </button>
      </div>
    </form>
  );
}
