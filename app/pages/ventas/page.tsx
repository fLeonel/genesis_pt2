"use client";

import { useEffect, useState, useMemo } from "react";
import { getVentas } from "@/application/useCases/Ventas/getVenta";
import { Venta } from "@/domain/models/Venta";
import {
    PlusIcon,
    CurrencyDollarIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    UserIcon,
    CreditCardIcon,
    ClockIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

type SortField = "createdAt" | "total" | "estado" | "cliente";
type SortDirection = "asc" | "desc";

export default function VentasPage() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getVentas()
            .then(setVentas)
            .catch((err: unknown) => console.error("Error cargando ventas:", err))
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

    // Ventas filtradas y ordenadas
    const filteredAndSortedVentas = useMemo(() => {
        let filtered = ventas;

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = ventas.filter(venta =>
                venta.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                venta.metodoPago.toLowerCase().includes(searchTerm.toLowerCase()) ||
                venta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                venta.notas?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordenar
        return [...filtered].sort((a, b) => {
            let aValue: string | number = a[sortField] as string | number;
            let bValue: string | number = b[sortField] as string | number;

            // Manejo especial para cliente
            if (sortField === "cliente") {
                aValue = a.cliente?.nombre || "";
                bValue = b.cliente?.nombre || "";
            }

            // Convertir a string para comparación
            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
            if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [ventas, sortField, sortDirection, searchTerm]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(amount);
    };

    const getEstadoBadge = (estado: string) => {
        if (estado === "confirmada") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="w-3 h-3" />
                    Confirmada
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <ClockIcon className="w-3 h-3" />
                    Borrador
                </span>
            );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <p className="text-gray-500 text-sm animate-pulse">
                    Cargando ventas...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] px-6 py-8">
            {/* Header con botón de acción */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
                        <p className="text-sm text-gray-500">
                            {filteredAndSortedVentas.length} de {ventas.length}{" "}
                            {ventas.length === 1
                                ? "venta"
                                : "ventas"}
                        </p>
                    </div>
                </div>
                <Link
                    href="/pages/ventas/crear"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium shadow-sm flex items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" />
                    Nueva venta
                </Link>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
                <div className="flex-1 relative max-w-md">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, método de pago, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                </div>
            </div>

            {/* Estado vacío */}
            {filteredAndSortedVentas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
                    <div className="w-40 h-40 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
                        <CurrencyDollarIcon className="w-20 h-20 text-gray-300" />
                    </div>
                    <p className="text-lg font-medium mb-2">
                        {searchTerm
                            ? "No se encontraron ventas"
                            : "Aún no hay ventas registradas"}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                        {searchTerm
                            ? "Intenta con otros términos de búsqueda"
                            : "Crea una nueva venta para empezar"}
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/pages/ventas/crear"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium shadow-sm flex items-center gap-2"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Nueva venta
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            ID
                                        </span>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleSort("cliente")}
                                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-green-600 transition"
                                        >
                                            Cliente
                                            {sortField === "cliente" && (
                                                sortDirection === "asc" ?
                                                    <ChevronUpIcon className="w-4 h-4" /> :
                                                    <ChevronDownIcon className="w-4 h-4" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Método Pago
                                        </span>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleSort("total")}
                                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-green-600 transition"
                                        >
                                            Total
                                            {sortField === "total" && (
                                                sortDirection === "asc" ?
                                                    <ChevronUpIcon className="w-4 h-4" /> :
                                                    <ChevronDownIcon className="w-4 h-4" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleSort("estado")}
                                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-green-600 transition"
                                        >
                                            Estado
                                            {sortField === "estado" && (
                                                sortDirection === "asc" ?
                                                    <ChevronUpIcon className="w-4 h-4" /> :
                                                    <ChevronDownIcon className="w-4 h-4" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleSort("createdAt")}
                                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-green-600 transition"
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
                            <tbody className="divide-y divide-gray-200">
                                {filteredAndSortedVentas.map((venta) => (
                                    <tr
                                        key={venta.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-gray-600">
                                                #{venta.id.slice(-8)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                    <UserIcon className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {venta.cliente?.nombre || 'Cliente eliminado'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {venta.detalles.length} {venta.detalles.length === 1 ? 'producto' : 'productos'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CreditCardIcon className="w-4 h-4 text-gray-400" />
                                                {venta.metodoPago}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-lg font-semibold text-gray-900">
                                                {formatCurrency(venta.total)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getEstadoBadge(venta.estado)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {venta.createdAt
                                                ? new Date(venta.createdAt).toLocaleDateString('es-GT', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : '-'
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/pages/ventas/${venta.id}`}
                                                className="text-green-600 hover:text-green-800 text-sm font-medium"
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
        </div>
    );
}