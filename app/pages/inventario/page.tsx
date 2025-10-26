"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CubeIcon,
  TagIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  PlusIcon,
  ArrowLeftIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function InventarioDashboard() {
  const [stats] = useState({
    totalCategorias: 12,
    totalProductos: 156,
    totalRecetas: 45,
    totalCombos: 23,
  });

  const modules = [
    {
      name: "Categorías",
      description: "Organiza y gestiona las categorías de productos",
      href: "/pages/inventario/categorias",
      icon: TagIcon,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      stats: stats.totalCategorias,
    },
    {
      name: "Productos",
      description: "Administra el catálogo completo de productos",
      href: "/pages/inventario/productos",
      icon: CubeIcon,
      color: "from-emerald-600 to-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      stats: stats.totalProductos,
    },
    {
      name: "Recetas",
      description: "Define recetas y procesos de preparación",
      href: "/pages/inventario/recetas",
      icon: DocumentTextIcon,
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      stats: stats.totalRecetas,
    },
    {
      name: "Combos",
      description: "Crea y gestiona combos de productos",
      href: "/pages/inventario/combos",
      icon: ShoppingBagIcon,
      color: "from-amber-600 to-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: stats.totalCombos,
    },
  ];

  const quickStats = [
    {
      label: "Total Categorías",
      value: stats.totalCategorias,
      icon: TagIcon,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Productos",
      value: stats.totalProductos,
      icon: CubeIcon,
      color: "from-emerald-600 to-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Total Recetas",
      value: stats.totalRecetas,
      icon: DocumentTextIcon,
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
    },
    {
      label: "Total Combos",
      value: stats.totalCombos,
      icon: ShoppingBagIcon,
      color: "from-amber-600 to-amber-700",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section - Full Width */}
      <section className="w-full bg-gradient-to-r from-emerald-700 via-blue-700 to-emerald-700 text-white">
        <div className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-4 text-sm"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Volver al inicio
                </Link>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                  Gestión de Inventario
                </h1>
                <p className="text-lg text-emerald-50 leading-relaxed max-w-2xl">
                  Administra categorías, productos, recetas y combos de tu
                  negocio
                </p>
              </div>
              <Link
                href="/pages/inventario/productos/crear"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo Producto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section - Full Width */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-8 md:py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <ChartBarIcon className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              Resumen General
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`${stat.bgColor} rounded-xl p-6 border-2 ${stat.bgColor.replace("bg-", "border-")} hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-slate-800">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-600">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
