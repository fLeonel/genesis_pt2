"use client";

import { useEffect, useState, useMemo } from "react";
import { getClientes } from "@/application/useCases/Clientes/getClientes";
import { Cliente } from "@/domain/models/Cliente";
import ClienteCard from "@/ui/components/Clientes/ClienteCard";
import {
  UserPlusIcon,
  UsersIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

type SortField = "nombre" | "correo" | "telefono" | "createdAt";
type SortDirection = "asc" | "desc";
type ViewMode = "table" | "grid";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("nombre");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch((err: unknown) => console.error("Error cargando clientes:", err))
      .finally(() => setLoading(false));
  }, []);

  // Función para manejar el ordenamiento
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Función para manejar la eliminación de cliente desde el card
  const handleClienteDeleted = (clienteId: string) => {
    setClientes(prev => prev.filter(cliente => cliente.id !== clienteId));
  };

  // Clientes filtrados y ordenados
  const filteredAndSortedClientes = useMemo(() => {
    let filtered = clientes;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono?.includes(searchTerm) ||
        cliente.clienteCodigo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    return [...filtered].sort((a, b) => {
      let aValue = a[sortField] || "";
      let bValue = b[sortField] || "";

      // Convertir a string para comparación
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [clientes, sortField, sortDirection, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">
          Cargando clientes...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      {/* Header con botón de acción */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
            <p className="text-sm text-gray-500">
              {filteredAndSortedClientes.length} de {clientes.length}{" "}
              {clientes.length === 1
                ? "cliente"
                : "clientes"}
            </p>
          </div>
        </div>
        <Link
          href="/pages/clientes/crear"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium shadow-sm flex items-center gap-2"
        >
          <UserPlusIcon className="w-4 h-4" />
          Crear cliente
        </Link>
      </div>

      {/* Barra de búsqueda y controles */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          {/* Barra de búsqueda */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo, teléfono o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Selector de vista */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition ${viewMode === "table"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
              title="Vista de tabla"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition ${viewMode === "grid"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
              title="Vista de tarjetas"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Estado vacío */}
      {filteredAndSortedClientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
          <div className="w-40 h-40 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
            <UsersIcon className="w-20 h-20 text-gray-300" />
          </div>
          <p className="text-lg font-medium mb-2">
            {searchTerm
              ? "No se encontraron clientes"
              : "Aún no hay clientes registrados"}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Crea un cliente para empezar a gestionarlos"}
          </p>
          {!searchTerm && (
            <Link
              href="/pages/clientes/crear"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium shadow-sm flex items-center gap-2"
            >
              <UserPlusIcon className="w-4 h-4" />
              Crear cliente
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Vista de tabla */}
          {viewMode === "table" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Código
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("nombre")}
                          className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition"
                        >
                          Nombre
                          {sortField === "nombre" && (
                            sortDirection === "asc" ?
                              <ChevronUpIcon className="w-4 h-4" /> :
                              <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("correo")}
                          className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition"
                        >
                          Correo
                          {sortField === "correo" && (
                            sortDirection === "asc" ?
                              <ChevronUpIcon className="w-4 h-4" /> :
                              <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("telefono")}
                          className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition"
                        >
                          Teléfono
                          {sortField === "telefono" && (
                            sortDirection === "asc" ?
                              <ChevronUpIcon className="w-4 h-4" /> :
                              <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Dirección
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("createdAt")}
                          className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition"
                        >
                          Fecha registro
                          {sortField === "createdAt" && (
                            sortDirection === "asc" ?
                              <ChevronUpIcon className="w-4 h-4" /> :
                              <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Acciones
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSortedClientes.map((cliente) => (
                      <tr
                        key={cliente.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-gray-600">
                            {cliente.clienteCodigo || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                              <UsersIcon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="font-medium text-gray-900">
                              {cliente.nombre}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {cliente.correo ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                              {cliente.correo}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Sin correo</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {cliente.telefono ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              {cliente.telefono}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Sin teléfono</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {cliente.direccion ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600 max-w-xs">
                              <MapPinIcon className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="truncate">{cliente.direccion}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Sin dirección</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {cliente.createdAt
                            ? new Date(cliente.createdAt).toLocaleDateString('es-GT', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/pages/clientes/${cliente.id}`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Ver detalles
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vista de tarjetas */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedClientes.map((cliente) => (
                <ClienteCard
                  key={cliente.id}
                  cliente={cliente}
                  onDelete={handleClienteDeleted}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}