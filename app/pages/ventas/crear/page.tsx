"use client";

import VentaForm from "@/ui/components/Ventas/VentaForm";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function CrearVentaPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <PlusIcon className="w-6 h-6 text-green-600" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Nueva venta
                </h1>
            </div>

            <div className="max-w-4xl mx-auto">
                <VentaForm mode="create" />
            </div>
        </div>
    );
}