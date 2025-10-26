"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategorias } from "@/application/useCases/Inventario/Categorias/getCategorias";
import { createProducto } from "@/application/useCases/Inventario/Productos/createProducto";
import { getBodegas } from "@/application/useCases/Inventario/Bodegas/getBodega";
import { Bodega } from "@/domain/models/Bodega";

const productoSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  categoriaId: z.string().uuid("Selecciona una categoría válida").nullable(),
  precioPublico: z.coerce.number().min(0, "Debe ser positivo"),
  costoUnitario: z.coerce.number().min(0, "Debe ser positivo"),
  bodegaId: z.string().optional(),
  cantidadDisponible: z.coerce.number().min(0, "Debe ser positivo"),
  unidadMedida: z.string().min(1, "Campo requerido"),
  sePuedeVender: z.boolean(),
  sePuedeComprar: z.boolean(),
  esFabricado: z.boolean(),
});

type ProductoInput = z.infer<typeof productoSchema>;

export default function ProductForm({
  mode = "create",
  defaultValues,
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<ProductoInput>;
}) {
  const router = useRouter();
  const [categorias, setCategorias] = useState<
    { id: string; nombre: string }[]
  >([]);
  const [bodegas, setBodegas] = useState<{ id: string; nombre: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "contabilidad" | "extras"
  >("general");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductoInput>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      unidadMedida: "",
      precioPublico: 0,
      costoUnitario: 0,
      bodegaId: "",
      cantidadDisponible: 0,
      sePuedeVender: true,
      sePuedeComprar: false,
      esFabricado: false,
      ...defaultValues,
    },
  });

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch((e) => console.error("Error cargando categorías:", e));

    getBodegas()
      .then(setBodegas)
      .catch((e) => console.error("Error cargando bodegas:", e));
  }, []);

  const onSubmit = async (data: ProductoInput) => {
    try {
      setSubmitting(true);
      await createProducto(data);
      router.push("/pages/inventario/productos");
    } catch (err) {
      console.error("Error al crear producto:", err);
    } finally {
      setSubmitting(false);
    }
  };

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-gray-50 px-12 py-8"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="flex-1">
          <input
            {...register("nombre")}
            placeholder="Nombre del producto..."
            className="text-4xl font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none w-full mb-1"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs">{errors.nombre.message}</p>
          )}
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 flex-wrap">
          {[
            { name: "sePuedeVender", label: "Se puede vender" },
            { name: "sePuedeComprar", label: "Se puede comprar" },
            { name: "esFabricado", label: "Es fabricado" },
          ].map((chk) => (
            <label
              key={chk.name}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                {...register(chk.name as keyof ProductoInput)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              {chk.label}
            </label>
          ))}
        </div>
      </div>

      {/* TABS */}
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

      {/* GENERAL */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <select
              {...register("categoriaId", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {errors.categoriaId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoriaId.message}
              </p>
            )}
          </div>

          {/* Bodega */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bodega
            </label>
            <select
              {...register("bodegaId", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona una bodega</option>
              {bodegas.map((bod) => (
                <option key={bod.id} value={bod.id}>
                  {getBodegaPath(bod as Bodega, bodegas as Bodega[])}
                </option>
              ))}
            </select>
          </div>

          {/* Unidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unidad de medida *
            </label>
            <input
              {...register("unidadMedida")}
              placeholder="Ej: unidad, libra, litro..."
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad disponible *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("cantidadDisponible")}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              {...register("descripcion")}
              rows={4}
              placeholder="Describe el producto..."
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* CONTABILIDAD */}
      {activeTab === "contabilidad" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { field: "precioPublico", label: "Precio público *" },
            { field: "costoUnitario", label: "Costo unitario *" },
          ].map((item) => (
            <div key={item.field}>
              <label className="block text-sm font-medium text-gray-700">
                {item.label}
              </label>
              <input
                type="number"
                step="0.01"
                {...register(item.field as keyof ProductoInput)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* EXTRAS */}
      {activeTab === "extras" && (
        <div className="text-sm text-gray-600 space-y-2">
          <p>Aquí podrás agregar atributos personalizados o subir imágenes.</p>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-end gap-3 pt-8 mt-12 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push("/pages/inventario/productos")}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {submitting
            ? "Guardando..."
            : mode === "create"
              ? "Guardar producto"
              : "Actualizar producto"}
        </button>
      </div>
    </form>
  );
}
