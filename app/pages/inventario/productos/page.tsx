"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoadingState } from "../../../ui/components/base/LoadingAndEmpty";
import { apiClient } from "../../../infrastructure/http/apiClient";
import ProductCard from "../../../ui/components/Productos/ProductCard";

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precioPublico: number;
  categoriaId?: string;
  cantidadDisponible: number;
  sePuedeVender: boolean;
  esFabricado: boolean;
  categoria?: {
    nombre: string;
  };
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Producto[]>("/api/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error cargando productos:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] px-6 py-8">
        <LoadingState message="Cargando productos..." />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      {/* Header con botón de acción */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
        <Link
          href="/pages/inventario/productos/crear"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
        >
          + Crear producto
        </Link>
      </div>

      {/* Estado vacío */}
      {productos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
          {/* Acá podrás poner la imagen que quieras */}
          <div className="w-40 h-40 bg-gray-100 rounded-full mb-6 flex items-center justify-center text-gray-300 text-6xl">
            📦
          </div>
          <p className="text-lg font-medium mb-2">
            Aún no hay productos disponibles
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Crea un producto para empezar a gestionarlos
          </p>
          <Link
            href="/pages/inventario/productos/crear"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
          >
            Crear producto
          </Link>
        </div>
      ) : (
        // Lista de productos (grid responsive)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
