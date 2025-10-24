"use client";

import Link from "next/link";
import { CubeIcon } from "@heroicons/react/24/outline";

interface ProductCardProps {
  producto: {
    id: string;
    nombre: string;
    descripcion?: string;
    precioPublico: number;
    cantidadDisponible?: number;
    categoriaId?: string;
  };
}

export default function ProductCard({ producto }: ProductCardProps) {
  return (
    <Link
      href={`/pages/inventario/productos/${producto.id}`}
      className="group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
              {producto.nombre}
            </h2>
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
              <CubeIcon className="w-4 h-4" />
              <span>
                {producto.cantidadDisponible != null
                  ? `${producto.cantidadDisponible} en stock`
                  : "Sin stock"}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {producto.descripcion || "Sin descripción"}
          </p>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Q{producto.precioPublico.toFixed(2)}
          </span>
          <span className="text-xs text-indigo-600 font-medium group-hover:underline">
            Ver / Editar
          </span>
        </div>
      </div>
    </Link>
  );
}
