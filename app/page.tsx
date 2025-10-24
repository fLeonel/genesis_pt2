"use client";


import { styleClasses } from "./ui/theme/designSystem";
import {
  CubeIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";

export default function HomePage() {
  const modules = [
    {
      name: "Inventario",
      description: "Gestiona categorías, productos, recetas y combos.",
      href: "/pages/inventario/",
      icon: <CubeIcon className="w-12 h-12 text-blue-600" />,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      name: "Clientes",
      description: "Administra contactos y datos de tus clientes.",
      href: "/pages/clientes",
      icon: <UserGroupIcon className="w-12 h-12 text-green-600" />,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      name: "Ventas",
      description: "Registra pedidos, métodos de pago y facturación.",
      href: "/pages/ventas",
      icon: <ShoppingBagIcon className="w-12 h-12 text-purple-600" />,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
    {
      name: "Restaurante",
      description: "Controla mesas, pedidos y flujo de cocina.",
      href: "/pages/restaurante",
      icon: <BuildingStorefrontIcon className="w-12 h-12 text-orange-600" />,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className={styleClasses.container}>
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="text-6xl mb-4 block">🍽️</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              La Cazuela Chapina
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Sistema integral de gestión para restaurantes y negocios gastronómicos
            </p>
          </div>

          {/* Modules Grid */}
          <div className="w-full max-w-6xl">
            <div className={`${styleClasses.grid.cols4} mb-16`}>
              {modules.map((module) => (
                <div
                  key={module.name}
                  onClick={() => window.location.href = module.href}
                  className={`${module.color} border-2 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                      {module.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {module.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-gray-600 mb-4">
                Explora cada módulo para gestionar tu negocio de manera eficiente
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Inventario completo
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Gestión de clientes
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Control de ventas
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Punto de venta
                </span>
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              &ldquo;Sabores que cuentan historias&rdquo; – Fundación Génesis Teset ~ Dennis Ramírez 🇬🇹
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
