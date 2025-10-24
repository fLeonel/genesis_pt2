"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/infrastructure/http/apiClient";

interface Combo {
  id: string;
  nombre: string;
  descripcion?: string;
  precioTotal: number;
}

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await apiClient.get<Combo[]>("/api/combos");
        const data = res.data.map((c: any) => ({
          id: c.id,
          nombre: c.nombre,
          descripcion: c.descripcion,
          precioTotal: c.precioTotal ?? 0,
        }));
        setCombos(data);
      } catch {
        console.error("Error cargando combos");
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">
          Cargando combos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Combos</h1>
        <Link
          href="/pages/inventario/combos/crear"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
        >
          + Crear combo
        </Link>
      </div>

      {combos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
          <div className="w-40 h-40 bg-gray-100 rounded-full mb-6 flex items-center justify-center text-gray-300 text-6xl">
            🎁
          </div>
          <p className="text-lg font-medium mb-2">No hay combos creados aún</p>
          <p className="text-sm text-gray-400 mb-4">
            Crea tu primer combo para agrupar productos
          </p>
          <Link
            href="/pages/inventario/combos/crear"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
          >
            Crear combo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {combos.map((combo) => (
            <Link
              key={combo.id}
              href={`/pages/inventario/combos/${combo.id}`}
              className="group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600">
                    {combo.nombre}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {combo.descripcion || "Sin descripción"}
                  </p>
                </div>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Q{combo.precioTotal.toFixed(2)}
                  </span>
                  <span className="text-xs text-indigo-600 font-medium group-hover:underline">
                    Ver / Editar
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
