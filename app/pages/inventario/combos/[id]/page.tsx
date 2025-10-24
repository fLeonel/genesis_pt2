"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/infrastructure/http/apiClient";
import toast from "react-hot-toast";

interface Producto {
  id: string;
  nombre: string;
  precioPublico: number;
}

interface ComboDetalle {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Combo {
  id: string;
  nombre: string;
  descripcion?: string;
  precioTotal: number;
  productos: ComboDetalle[];
}

export default function ComboDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [combo, setCombo] = useState<Combo | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosRes = await apiClient.get<Producto[]>("/api/productos");
        setProductos(productosRes.data);

        if (id && id !== "crear") {
          const comboRes = await apiClient.get(`/api/combos/${id}`);
          const comboData = comboRes.data;

          const productosMapeados = (comboData.productos || []).map(
            (p: any) => ({
              productoId: p.id || p.productoId,
              nombre: p.nombre,
              precio: p.precioPublico ?? p.precio ?? 0,
              cantidad: p.cantidad ?? p.comboProducto?.cantidad ?? 1,
            }),
          );

          const precioTotal = productosMapeados.reduce(
            (acc, p) => acc + p.precio * p.cantidad,
            0,
          );

          setCombo({
            ...comboData,
            productos: productosMapeados,
            precioTotal,
          });

          setFormData({
            nombre: comboData.nombre,
            descripcion: comboData.descripcion || "",
          });
        }
      } catch {
        toast.error("Error cargando combo o productos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const comboDetalles = combo?.productos ?? [];

  function handleAddProducto() {
    if (!selectedProduct || cantidad <= 0) {
      toast.error("Selecciona un producto y una cantidad válida");
      return;
    }

    const producto = productos.find((p) => p.id === selectedProduct);
    if (!producto) return;

    const yaExiste = comboDetalles.some((d) => d.productoId === producto.id);
    if (yaExiste) {
      toast.error("El producto ya está en el combo");
      return;
    }

    const nuevoDetalle: ComboDetalle = {
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precioPublico,
      cantidad,
    };

    setCombo((prev) => ({
      ...(prev || { id: "", precioTotal: 0, productos: [] }),
      productos: [...(prev?.productos || []), nuevoDetalle],
      precioTotal: (prev?.precioTotal || 0) + producto.precioPublico * cantidad,
    }));

    setSelectedProduct("");
    setCantidad(1);
  }

  function handleRemoveProducto(productoId: string) {
    setCombo((prev) => {
      if (!prev) return prev;
      const filtrado = prev.productos.filter(
        (d) => d.productoId !== productoId,
      );
      const nuevoTotal = filtrado.reduce(
        (acc, p) => acc + p.precio * p.cantidad,
        0,
      );
      return { ...prev, productos: filtrado, precioTotal: nuevoTotal };
    });
  }

  async function handleSave() {
    if (!formData.nombre.trim()) {
      toast.error("El combo necesita un nombre");
      return;
    }

    if (!comboDetalles.length) {
      toast.error("Agrega al menos un producto");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precioTotal: comboDetalles.reduce(
        (acc, p) => acc + p.precio * p.cantidad,
        0,
      ),
      productosIds: comboDetalles.map((d) => d.productoId),
    };

    try {
      if (id === "crear") {
        await apiClient.post("/api/combos", payload);
        toast.success("Combo creado correctamente");
      } else {
        await apiClient.put(`/api/combos/${id}`, payload);
        toast.success("Combo actualizado correctamente");
      }
      router.push("/pages/inventario/combos");
    } catch {
      toast.error("Error al guardar el combo");
    }
  }

  async function handleDelete() {
    if (!id || id === "crear") return;
    if (!confirm("¿Seguro que deseas eliminar este combo?")) return;

    try {
      await apiClient.delete(`/api/combos/${id}`);
      toast.success("Combo eliminado");
      router.push("/pages/inventario/combos");
    } catch {
      toast.error("Error al eliminar combo");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">Cargando combo...</p>
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
            placeholder="Nombre del combo..."
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
        </div>

        <div className="text-right ml-8">
          <p className="text-sm text-gray-500">Precio total</p>
          <p className="text-3xl font-bold text-indigo-600">
            Q{combo?.precioTotal?.toFixed(2) || 0}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Producto
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecciona un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} — Q{p.precioPublico}
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
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleAddProducto}
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
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-left">Cantidad</th>
              <th className="px-4 py-3 text-left">Precio Unitario</th>
              <th className="px-4 py-3 text-left">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {comboDetalles.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No hay productos agregados
                </td>
              </tr>
            ) : (
              comboDetalles.map((d) => (
                <tr
                  key={d.productoId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{d.nombre}</td>
                  <td className="px-4 py-3">{d.cantidad}</td>
                  <td className="px-4 py-3">Q{d.precio.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    Q{(d.precio * d.cantidad).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemoveProducto(d.productoId)}
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
          {id === "crear" ? "Guardar Combo" : "Guardar Cambios"}
        </button>
        <button
          onClick={() => router.push("/pages/inventario/combos")}
          type="button"
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
