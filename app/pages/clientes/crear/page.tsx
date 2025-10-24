"use client";

import ClienteForm from "@/ui/components/Clientes/ClienteForm";
import { UserPlusIcon } from "@heroicons/react/24/outline";

export default function CrearClientePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <UserPlusIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Crear nuevo cliente
        </h1>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <ClienteForm mode="create" />
      </div>
    </div>
  );
}
