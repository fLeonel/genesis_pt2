"use client";

import { API_BASE_URL } from "@/config/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCategorias } from "@/application/useCases/Inventario/Categorias/getCategorias";
import { createCategoria } from "@/application/useCases/Inventario/Categorias/createCategoria";
import { deleteCategoria } from "@/application/useCases/Inventario/Categorias/deleteCategoria";
import { Categoria } from "@/domain/models/Categoria";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoriaSchema,
  CategoriaFormData,
} from "@/domain/validators/categoriaSchema";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
  });

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    const data = await getCategorias();
    setCategorias(data);
    setLoading(false);
  }

  async function onSubmit(data: CategoriaFormData) {
    try {
      if (editing) {
        const cambios = {
          nombre: data.nombre || editing.nombre,
          descripcion: data.descripcion || editing.descripcion,
        };

        const res = await fetch(
          `${API_BASE_URL}/api/categorias/${editing.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cambios),
          },
        );

        if (!res.ok) throw new Error("Error al actualizar categoría");

        toast.success("Categoría actualizada correctamente");
      } else {
        await createCategoria(data);
        toast.success("Categoría creada con éxito");
      }

      await refresh();
      reset();
      setShowModal(false);
    } catch {
      toast.error("Hubo un error al guardar la categoría");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    await deleteCategoria(id);
    await refresh();
  }

  return (
    <main className="w-full min-h-[calc(100vh-80px)] bg-gray-50 p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Categorías</h1>
        <button
          onClick={() => {
            setEditing(null);
            reset();
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition"
        >
          + Nueva Categoría
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500 text-center">
            Cargando categorías...
          </p>
        ) : categorias.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            No hay categorías creadas aún.
          </p>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 border-b text-gray-700">
              <tr>
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Descripción</th>
                <th className="px-6 py-3 font-medium">Creado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {cat.nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cat.descripcion || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(cat.createdAt ?? Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditing(cat);
                        reset({
                          nombre: cat.nombre,
                          descripcion: cat.descripcion,
                        });
                        setShowModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Editar Categoría" : "Nueva Categoría"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  {...register("nombre")}
                  className="border rounded-md w-full p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej. Tamales"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  {...register("descripcion")}
                  className="border rounded-md w-full p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej. Comida típica de maíz..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  {editing ? "Guardar cambios" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
