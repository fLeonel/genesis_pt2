"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { styleClasses } from "../../ui/theme/designSystem";
import Card from "../../ui/components/base/Card";
import Button from "../../ui/components/base/Button";
import PageHeader from "../../ui/components/base/PageHeader";
import { LoadingState, EmptyState } from "../../ui/components/base/LoadingAndEmpty";
import Input from "../../ui/components/base/FormElements";
import Badge from "../../ui/components/base/Badge";
import { getClientes } from "../../application/useCases/Clientes/getClientes";
import { Cliente } from "../../domain/models/Cliente";
import ClienteCard from "../../ui/components/Clientes/ClienteCard";
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
    return <LoadingState message="Cargando clientes..." />;
  }

  return (
    <div className={styleClasses.page}>
      <PageHeader
        title="👥 Clientes"
        subtitle={`${filteredAndSortedClientes.length} de ${clientes.length} ${
          clientes.length === 1 ? "cliente" : "clientes"
        }`}
      >
        <Button
          variant="primary"
          size="md"
          onClick={() => window.location.href = "/pages/clientes/crear"}
          className="flex items-center gap-2"
        >
          <UserPlusIcon className="w-4 h-4" />
          Crear cliente
        </Button>
      </PageHeader>

      <div className={styleClasses.container}>
        {/* Barra de búsqueda y controles */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            {/* Barra de búsqueda */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Buscar por nombre, correo, teléfono o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selector de vista */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-colors ${viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                title="Vista de tabla"
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${viewMode === "grid"
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

        {/* Contenido */}
        {filteredAndSortedClientes.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="w-16 h-16" />}
            title={searchTerm ? "No se encontraron clientes" : "Aún no hay clientes registrados"}
            description={
              searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "Crea un cliente para empezar a gestionarlos"
            }
            action={
              !searchTerm ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => window.location.href = "/pages/clientes/crear"}
                  className="flex items-center gap-2"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  Crear cliente
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Vista de tabla */}
            {viewMode === "table" && (
              <Card className="overflow-hidden">
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
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors"
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
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors"
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
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors"
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
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors"
                          >
                            Fecha
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
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedClientes.map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                            {cliente.clienteCodigo || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-indigo-600">
                                  {cliente.nombre.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {cliente.nombre}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {cliente.correo || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {cliente.telefono || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="max-w-xs truncate">
                                {cliente.direccion || '-'}
                              </span>
                            </div>
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
              </Card>
            )}

            {/* Vista de tarjetas */}
            {viewMode === "grid" && (
              <div className={styleClasses.grid.cols3}>
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
    </div>
  );
}