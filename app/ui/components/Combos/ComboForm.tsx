"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/infrastructure/http/apiClient";
import { createCombo } from "@/application/useCases/Inventario/Combos/createCombo";
import { updateCombo } from "@/application/useCases/Inventario/Combos/updateCombo";
import toast from "react-hot-toast";

interface Producto {
  id: string;
  nombre: string;
  precioPublico: number;
}

interface ComboProducto {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface ComboFormProps {
  mode: "create" | "edit";
  comboId?: string;
}

export default function ComboForm({ mode, comboId }: ComboFormProps) {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [comboProductos, setComboProductos] = useState<ComboProducto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const productosRes = await apiClient.get<Producto[]>("/api/productos");
        setProductos(productosRes.data);

        if (mode === "edit" && comboId) {
          const comboRes = await apiClient.get(`/api/combos/${comboId}`);
          const comboData = comboRes.data;

          setFormData({
            nombre: comboData.nombre,
            descripcion: comboData.descripcion || "",
          });

          const detalles = (comboData.productos || []).map((p: any) => ({
            productoId: p.id || p.productoId,
            nombre: p.nombre,
            precio: p.precioPublico ?? p.precio ?? 0,
            cantidad: p.cantidad ?? p.cantidadPorCombo ?? 1,
          }));

          setComboProductos(detalles);
        }
      } catch {
        toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [mode, comboId]);

  const precioTotal = comboProductos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0,
  );

  function handleAddProducto() {
    if (!selectedProduct || cantidad <= 0) {
      toast.error("Selecciona un producto y una cantidad válida");
      return;
    }

    const producto = productos.find((p) => p.id === selectedProduct);
    if (!producto) return;

    const yaExiste = comboProductos.some((p) => p.productoId === producto.id);
    if (yaExiste) {
      toast.error("El producto ya está en el combo");
      return;
    }

    const nuevo = {
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precioPublico,
      cantidad,
    };

    setComboProductos([...comboProductos, nuevo]);
    setSelectedProduct("");
    setCantidad(1);
  }

  function handleRemoveProducto(id: string) {
    setComboProductos(comboProductos.filter((p) => p.productoId !== id));
  }

  async function handleSave() {
    if (!formData.nombre.trim()) {
      toast.error("El combo necesita un nombre");
      return;
    }

    if (comboProductos.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precioTotal,
      productos: comboProductos.map((p) => ({
        productoId: p.productoId,
        cantidad: p.cantidad,
      })),
    };

    console.log("Payload a enviar:", payload);

    try {
      if (mode === "create") {
        await createCombo(payload);
        toast.success("Combo creado correctamente");
      } else if (mode === "edit" && comboId) {
        await updateCombo(comboId, payload);
        toast.success("Combo actualizado correctamente");
      }

      router.push("/pages/inventario/combos");
    } catch (err) {
      console.error("Error al guardar combo:", err);
      toast.error("Error al guardar combo");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 animate-pulse">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {mode === "create" ? "Crear nuevo combo" : "Editar combo"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona los productos y precios del combo.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Precio total</p>
          <p className="text-2xl font-bold text-indigo-600">
            Q{precioTotal.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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
              Descripción
            </label>
            <input
              type="text"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((p) => ({ ...p, descripcion: e.target.value }))
              }
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Ej: surtido especial navideño"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Agregar productos al combo
        </h2>

        <div className="flex gap-4 mb-6 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Producto
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
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
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm"
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

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Cantidad</th>
              <th className="p-3 text-left">Precio Unitario</th>
              <th className="p-3 text-left">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {comboProductos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-400 py-4 italic"
                >
                  No hay productos agregados
                </td>
              </tr>
            ) : (
              comboProductos.map((p) => (
                <tr key={p.productoId} className="border-t">
                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3">{p.cantidad}</td>
                  <td className="p-3">Q{p.precio.toFixed(2)}</td>
                  <td className="p-3">Q{(p.precio * p.cantidad).toFixed(2)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleRemoveProducto(p.productoId)}
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

      <div className="flex justify-end gap-3 mt-8">
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
          {mode === "create" ? "Guardar Combo" : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
