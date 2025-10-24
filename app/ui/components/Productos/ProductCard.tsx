"use client";

import Link from "next/link";

interface ProductCardProps {
  producto: {
    id: string;
    nombre: string;
    descripcion?: string;
    precioPublico: number;
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
          <h2 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600">
            {producto.nombre}
          </h2>
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
