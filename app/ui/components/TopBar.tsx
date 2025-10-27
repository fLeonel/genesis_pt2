"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { HomeIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function TopBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // eslint-disable-next-line @next/next/no-assign-module-variable
  const module = useMemo(() => {
    if (pathname.startsWith("/pages/inventario")) return "inventario";
    if (pathname.startsWith("/pages/ventas")) return "ventas";
    if (pathname.startsWith("/pages/clientes")) return "clientes";
    if (pathname.startsWith("/pages/restaurante")) return "restaurante";
    return null;
  }, [pathname]);

  const menus: Record<
    string,
    {
      label: string;
      href: string;
      submenus?: { label: string; href: string }[];
    }[]
  > = {
    inventario: [
      { label: "Dashboard", href: "/pages/inventario" },
      { label: "Productos", href: "/pages/inventario/productos" },
      {
        label: "Configuración",
        href: "#",
        submenus: [
          { label: "Categorías", href: "/pages/inventario/categorias" },
          { label: "Combos", href: "/pages/inventario/combos" },
          { label: "Recetas", href: "/pages/inventario/recetas" },
          { label: "Bodegas ", href: "/pages/inventario/bodegas" },
        ],
      },
    ],
    ventas: [
      { label: "Dashboard", href: "/pages/ventas/dashboard" },
      { label: "Historial", href: "/pages/ventas/historial" },
    ],
  };

  const activeMenu = menus[module || ""] || [];
  if (!module) return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-b border-indigo-200 shadow-sm backdrop-blur-sm z-50">
      <div className="w-full flex items-center justify-between px-8 py-3.5">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-sm sm:text-base font-semibold hidden sm:inline">
              Inicio
            </span>
          </Link>

          <div className="w-px h-6 bg-indigo-200 mx-1 hidden sm:block" />

          <h1 className="text-xl font-bold capitalize bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all">
            <Link href={`/pages/${module}`}>{module}</Link>
          </h1>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
          {activeMenu.map((menu) => (
            <li key={menu.label} className="relative group">
              {menu.submenus ? (
                <>
                  <span className="cursor-pointer hover:text-indigo-600 transition-colors">
                    {menu.label} ▾
                  </span>
                  <ul className="absolute left-0 top-6 hidden group-hover:block bg-white border border-indigo-200 rounded-lg shadow-lg py-2 min-w-[180px]">
                    {menu.submenus.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={menu.href}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {menu.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-indigo-700 hover:text-indigo-900 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-indigo-200 shadow-sm">
          <ul className="flex flex-col py-2 px-4 text-sm font-medium text-gray-700">
            {activeMenu.map((menu) => (
              <li key={menu.label} className="py-2">
                {menu.submenus ? (
                  <>
                    <div className="font-semibold mb-1">{menu.label}</div>
                    <ul className="pl-4 space-y-1">
                      {menu.submenus.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            href={sub.href}
                            className="block py-1 text-gray-600 hover:text-indigo-600 transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={menu.href}
                    className="block hover:text-indigo-600 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {menu.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
