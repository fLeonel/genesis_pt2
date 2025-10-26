"use client";

import { useEffect, useState } from "react";
import { Bodega } from "@/domain/models/Bodega";
import Link from "next/link";
import { getBodegas } from "@/application/useCases/Inventario/Bodegas/getBodega";

export default function BodegasPage() {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBodegas()
      .then((res) => setBodegas(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] text-gray-500 text-sm">
        Cargando bodegas...
      </div>
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
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-gray-50 px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Bodegas</h1>
        <Link
          href="/pages/inventario/bodegas/create"
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Nueva Bodega
        </Link>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Nombre
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Descripción
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Bodega Padre
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Creada
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {bodegas.map((bodega) => (
              <tr
                key={bodega.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {getBodegaPath(bodega, bodegas)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {bodega.descripcion || "-"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {bodega.bodegaPadreId
                    ? bodegas.find((b) => b.id === bodega.bodegaPadreId)?.nombre
                    : "Sin padre"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(bodega.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/pages/inventario/bodegas/${bodega.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Ver
                    </Link>
                    <button className="text-red-600 hover:text-red-800 font-medium">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
