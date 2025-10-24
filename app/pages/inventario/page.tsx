"use client";

import { useEffect, useState } from "react";
import {
  getDashboardStats,
  DashboardStats,
} from "@/application/useCases/Inventario/getDashboardStats";

export default function InventarioDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">
          Cargando estadísticas...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-start py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard de Inventario</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
        <StatCard
          label="Categorías"
          value={stats?.totalCategorias ?? 0}
          color="bg-indigo-500"
        />
        <StatCard
          label="Productos"
          value={stats?.totalProductos ?? 0}
          color="bg-green-500"
        />
        <StatCard
          label="Combos"
          value={stats?.totalCombos ?? 0}
          color="bg-amber-500"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center transition hover:shadow-md hover:scale-[1.02]">
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-sm font-medium text-gray-600 mb-3">{label}</div>
      <div className={`h-1 w-16 mx-auto rounded-full ${color}`}></div>
    </div>
  );
}
