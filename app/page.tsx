"use client";

import Link from "next/link";
import {
  CubeIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const modules = [
    {
      name: "Inventario",
      description: "Gestiona categorías, productos, recetas y combos",
      href: "/pages/inventario/",
      icon: CubeIcon,
      color: "from-emerald-600 to-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      name: "Clientes",
      description: "Administra contactos y datos de tus clientes",
      href: "/pages/clientes",
      icon: UserGroupIcon,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      name: "Ventas",
      description: "Registra pedidos, métodos de pago y facturación",
      href: "/pages/ventas",
      icon: ShoppingBagIcon,
      color: "from-amber-600 to-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      name: "Restaurante",
      description: "Controla mesas, pedidos y flujo de cocina",
      href: "/pages/restaurante",
      icon: BuildingStorefrontIcon,
      color: "from-rose-600 to-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
  ];

  const features = [
    {
      icon: ChartBarIcon,
      title: "Reportes en tiempo real",
      description: "Análisis detallado de ventas y operaciones",
    },
    {
      icon: ClipboardDocumentListIcon,
      title: "Gestión completa",
      description: "Control total de inventario y productos",
    },
    {
      icon: CreditCardIcon,
      title: "Múltiples métodos de pago",
      description: "Efectivo, tarjeta y pagos digitales",
    },
    {
      icon: ClockIcon,
      title: "Operación eficiente",
      description: "Optimiza el flujo de trabajo diario",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section - Full Width */}
      <section className="w-full bg-gradient-to-r from-emerald-700 via-blue-700 to-emerald-700 text-white">
        <div className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  La Cazuela Chapina
                </h1>
                <p className="text-lg md:text-xl text-emerald-50 mb-6 leading-relaxed max-w-2xl">
                  Sistema integral de gestión para restaurantes y negocios
                  gastronómicos
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    Inventario completo
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    Control de ventas
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    Gestión de clientes
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                  <BuildingStorefrontIcon className="w-20 h-20 md:w-24 md:h-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section - Full Width */}
      <section className="w-full px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center md:text-left">
            Módulos del Sistema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Link
                  key={module.name}
                  href={module.href}
                  className={`group relative overflow-hidden rounded-xl border-2 ${module.borderColor} ${module.bgColor} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {module.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Full Width */}
      <section className="w-full bg-slate-100 px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center md:text-left">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer - Full Width */}
      <footer className="w-full bg-slate-800 text-slate-300 px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-slate-200 mb-1">
                Fundación Génesis Teset
              </p>
              <p className="text-xs text-slate-400">
                Sabores que cuentan historias - Dennis Ramírez
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-blue-600 flex items-center justify-center">
                <BuildingStorefrontIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium">Guatemala</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
