"use client";

import ModuleCard from "./ui/components/ModuleCard";
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
      icon: <CubeIcon className="w-10 h-10 text-gray-700" />,
    },
    {
      name: "Clientes",
      description: "Administra contactos y datos de tus clientes.",
      href: "/pages/clientes",
      icon: <UserGroupIcon className="w-10 h-10 text-gray-700" />,
    },
    {
      name: "Ventas",
      description: "Registra pedidos, métodos de pago y facturación.",
      href: "/pages/ventas",
      icon: <ShoppingBagIcon className="w-10 h-10 text-gray-700" />,
    },
    {
      name: "Restaurante",
      description: "Controla mesas, pedidos y flujo de cocina.",
      href: "/pages/restaurante",
      icon: <BuildingStorefrontIcon className="w-10 h-10 text-gray-700" />,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-12">
        La Cazuela Chapina
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-8 justify-items-center items-center">
        {modules.map((mod) => (
          <ModuleCard key={mod.name} {...mod} />
        ))}
      </div>

      <p className="text-center mt-12 text-sm text-gray-500">
        “Sabores que cuentan historias” – Fundación Génesis Teset ~ Dennis
        Ramírez 🇬
      </p>
    </main>
  );
}
