"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBodegas } from "@/application/useCases/Inventario/Bodegas/getBodega";
import { createBodega } from "@/application/useCases/Inventario/Bodegas/createBodega";

const bodegaSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  bodegaPadreId: z.string().optional().nullable(),
});

type BodegaInput = z.infer<typeof bodegaSchema>;

interface Bodega {
  id: string;
  nombre: string;
  descripcion?: string;
  bodegaPadreId?: string | null;
}

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

export default function NuevaBodegaPage() {
  const router = useRouter();
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BodegaInput>({
    resolver: zodResolver(bodegaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      bodegaPadreId: null,
    },
  });

  useEffect(() => {
    getBodegas()
      .then((res) => setBodegas(res))
      .catch(() => setBodegas([]));
  }, []);

  const onSubmit = async (data: BodegaInput) => {
    try {
      setSubmitting(true);
      await createBodega(data);
      router.push("/pages/inventario/bodegas");
    } catch (err) {
      console.error("Error creando bodega:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-gray-50 px-12 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Nueva Bodega</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            {...register("nombre")}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>

        {/* Bodega Padre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bodega Padre
          </label>
          <select
            {...register("bodegaPadreId", {
              setValueAs: (v) => (v === "" ? null : v),
            })}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Sin padre</option>
            {bodegas.map((b) => (
              <option key={b.id} value={b.id}>
                {getBodegaPath(b, bodegas)}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register("descripcion")}
            rows={4}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-8 mt-12 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push("/pages/inventario/bodegas")}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
