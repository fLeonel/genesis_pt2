"use client";

import { useEffect, useState } from "react";
import { styleClasses } from "../../ui/theme/designSystem";
import Card from "../../ui/components/base/Card";
import Button from "../../ui/components/base/Button";
import PageHeader from "../../ui/components/base/PageHeader";
import { LoadingState } from "../../ui/components/base/LoadingAndEmpty";
import {
  getDashboardStats,
  DashboardStats,
} from "../../application/useCases/Inventario/getDashboardStats";
import {
  CubeIcon,
  TagIcon,
  ShoppingBagIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

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
      <div className={styleClasses.page}>
        <LoadingState message="Cargando estadísticas del inventario..." />
      </div>
    );
  }

  const modules = [
    {
      name: "Categorías",
      description: "Organiza y gestiona las categorías de productos",
      href: "/pages/inventario/categorias",
      icon: <TagIcon className="w-8 h-8" />,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconColor: "text-blue-600",
      stats: stats?.totalCategorias ?? 0,
    },
    {
      name: "Productos",
      description: "Administra el catálogo completo de productos",
      href: "/pages/inventario/productos",
      icon: <CubeIcon className="w-8 h-8" />,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      iconColor: "text-green-600",
      stats: stats?.totalProductos ?? 0,
    },
    {
      name: "Recetas",
      description: "Define recetas y procesos de preparación",
      href: "/pages/inventario/recetas",
      icon: <ShoppingBagIcon className="w-8 h-8" />,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      iconColor: "text-purple-600",
      stats: 0, // No hay estadísticas de recetas en el dashboard actual
    },
    {
      name: "Combos",
      description: "Crea y gestiona combos de productos",
      href: "/pages/inventario/combos",
      icon: <ShoppingBagIcon className="w-8 h-8" />,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      iconColor: "text-orange-600",
      stats: stats?.totalCombos ?? 0,
    },
  ];

  return (
    <div className={styleClasses.page}>
      <PageHeader
        title="📦 Inventario"
        subtitle="Gestiona categorías, productos, recetas y combos de tu negocio"
      >
        <Button
          variant="primary"
          onClick={() => window.location.href = '/pages/inventario/productos/crear'}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo Producto
        </Button>
      </PageHeader>

      <div className={styleClasses.container}>
        {/* Estadísticas rápidas */}
        <div className="mb-8">
          <h2 className={styleClasses.sectionTitle}>Resumen</h2>
          <div className={styleClasses.grid.cols4}>
            <StatCard
              label="Total Categorías"
              value={stats?.totalCategorias ?? 0}
              color="bg-blue-500"
              icon="📁"
            />
            <StatCard
              label="Total Productos"
              value={stats?.totalProductos ?? 0}
              color="bg-green-500"
              icon="📦"
            />
            <StatCard
              label="Total Recetas"
              value={0}
              color="bg-purple-500"
              icon="📝"
            />
            <StatCard
              label="Total Combos"
              value={stats?.totalCombos ?? 0}
              color="bg-orange-500"
              icon="🍱"
            />
          </div>
        </div>

        {/* Módulos de inventario */}
        <div>
          <h2 className={styleClasses.sectionTitle}>Módulos</h2>
          <div className={styleClasses.grid.cols2}>
            {modules.map((module) => (
              <div key={module.name}
                className="cursor-pointer"
                onClick={() => window.location.href = module.href}>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className={`${module.color} border-2 rounded-lg p-6 -m-6 mb-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 bg-white rounded-lg shadow-sm ${module.iconColor}`}>
                          {module.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {module.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {module.stats} registros
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {module.stats}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4">
                    {module.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  return (
    <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
      <div className="flex flex-col items-center space-y-3">
        <div className="text-3xl">{icon}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        <div className={`h-1 w-12 rounded-full ${color}`}></div>
      </div>
    </Card>
  );
}
