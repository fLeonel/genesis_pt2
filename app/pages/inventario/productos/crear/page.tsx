"use client";

import ProductForm from "@/ui/components/Productos/ProductForm";

export default function CrearProductoPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Crear nuevo producto
        </h1>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
