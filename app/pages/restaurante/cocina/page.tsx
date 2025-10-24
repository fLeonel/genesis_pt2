'use client';

import { useState, useEffect } from 'react';
import { Venta, VentaDetalle } from '../../../domain/models/Venta';
import { getVentas } from '../../../application/useCases/Ventas/getVenta';
import { updateVenta } from '../../../application/useCases/Ventas/udpateVenta';

export default function CocinaPage() {
    const [ordenes, setOrdenes] = useState<OrdenRestaurante[]>([]);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState<string | null>(null);

    useEffect(() => {
        loadOrdenes();
        // Actualizar cada 30 segundos
        const interval = setInterval(loadOrdenes, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadOrdenes = async () => {
        try {
            const ordenesData = await getOrdenesCocina();
            setOrdenes(ordenesData);
        } catch (error) {
            console.error('Error al cargar las órdenes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEstadoChange = async (ordenId: string, nuevoEstado: EstadoOrden) => {
        try {
            setProcesando(ordenId);
            await updateEstadoOrden(ordenId, nuevoEstado);
            await loadOrdenes();
        } catch (error) {
            console.error('Error al actualizar el estado de la orden:', error);
        } finally {
            setProcesando(null);
        }
    };

    const handleIniciarPreparacion = async (orden: OrdenRestaurante) => {
        try {
            setProcesando(orden.id);

            // Procesar cada detalle que tenga receta
            for (const detalle of orden.detalles) {
                if (detalle.producto?.esFabricado && detalle.producto?.receta) {
                    const resultado = await procesarRecetaYDescontarInventario(detalle, orden.id);

                    if (!resultado.success) {
                        alert(`Error al procesar ${detalle.producto.nombre}: ${resultado.errores?.join(', ')}`);
                        return;
                    }
                }
            }

            // Cambiar estado a en preparación
            await updateEstadoOrden(orden.id, 'en_preparacion');
            await loadOrdenes();

        } catch (error) {
            console.error('Error al iniciar preparación:', error);
            alert('Error al iniciar la preparación de la orden');
        } finally {
            setProcesando(null);
        }
    };

    const getEstadoColor = (estado: EstadoOrden) => {
        switch (estado) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'en_preparacion':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'lista':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTiempoEspera = (createdAt: string) => {
        const ahora = new Date();
        const creacion = new Date(createdAt);
        const diferencia = Math.floor((ahora.getTime() - creacion.getTime()) / (1000 * 60));
        return diferencia;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando órdenes...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Vista de Cocina</h1>
                <div className="flex space-x-4">
                    <div className="text-sm text-gray-600">
                        Órdenes pendientes: {ordenes.filter(o => o.estado === 'pendiente').length}
                    </div>
                    <div className="text-sm text-gray-600">
                        En preparación: {ordenes.filter(o => o.estado === 'en_preparacion').length}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {ordenes.map((orden) => (
                    <div
                        key={orden.id}
                        className={`p-6 rounded-lg border-2 shadow-sm ${getEstadoColor(orden.estado)}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {orden.mesa ? `Mesa ${orden.mesa.numero}` : `${orden.tipo.toUpperCase()}`}
                                </h3>
                                <p className="text-sm text-gray-600">Orden #{orden.id.slice(-6)}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                                    {orden.estado}
                                </span>
                                <p className="text-xs text-gray-600 mt-1">
                                    {getTiempoEspera(orden.createdAt!)} min
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            {orden.detalles.map((detalle, index) => (
                                <div key={index} className="bg-white bg-opacity-50 p-3 rounded">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">
                                                {detalle.producto?.nombre || detalle.combo?.nombre}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Cantidad: {detalle.cantidad}
                                            </p>
                                            {detalle.notas && (
                                                <p className="text-sm text-red-600 font-medium">
                                                    Nota: {detalle.notas}
                                                </p>
                                            )}
                                            {detalle.producto?.esFabricado && (
                                                <p className="text-xs text-blue-600">
                                                    🔧 Requiere preparación con receta
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-sm">
                                            {detalle.tiempoPreparacion && (
                                                <p className="text-gray-600">
                                                    ⏱️ {detalle.tiempoPreparacion} min
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {orden.notas && (
                            <div className="bg-yellow-50 p-2 rounded mb-4">
                                <p className="text-sm">
                                    <strong>Notas especiales:</strong> {orden.notas}
                                </p>
                            </div>
                        )}

                        <div className="flex space-x-2">
                            {orden.estado === 'pendiente' && (
                                <button
                                    onClick={() => handleIniciarPreparacion(orden)}
                                    disabled={procesando === orden.id}
                                    className="flex-1 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded text-sm"
                                >
                                    {procesando === orden.id ? 'Procesando...' : 'Iniciar Preparación'}
                                </button>
                            )}

                            {orden.estado === 'en_preparacion' && (
                                <button
                                    onClick={() => handleEstadoChange(orden.id, 'lista')}
                                    disabled={procesando === orden.id}
                                    className="flex-1 bg-green-500 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-2 px-4 rounded text-sm"
                                >
                                    {procesando === orden.id ? 'Actualizando...' : 'Marcar Lista'}
                                </button>
                            )}

                            {orden.estado === 'lista' && (
                                <button
                                    onClick={() => handleEstadoChange(orden.id, 'servida')}
                                    disabled={procesando === orden.id}
                                    className="flex-1 bg-purple-500 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-2 px-4 rounded text-sm"
                                >
                                    {procesando === orden.id ? 'Actualizando...' : 'Marcar Servida'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {ordenes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay órdenes pendientes en cocina</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Las nuevas órdenes aparecerán aquí automáticamente
                    </p>
                </div>
            )}
        </div>
    );
}