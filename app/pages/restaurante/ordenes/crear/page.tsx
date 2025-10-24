'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Producto } from '../../../../domain/models/Productos';
import { Combo } from '../../../../domain/models/Combo';
import { Cliente } from '../../../../domain/models/Cliente';
import { OrdenDetalle, TipoOrden } from '../../../../domain/models/OrdenRestaurante';
import { createOrdenRestaurante } from '../../../../application/useCases/Restaurante/Ordenes/createOrdenRestaurante';
import { getProductos } from '../../../../application/useCases/Inventario/Productos/getProductos';
import { getCombos } from '../../../../application/useCases/Inventario/Combos/getCombos';
import { getClientes } from '../../../../application/useCases/Clientes/getClientes';

export default function CrearOrdenPage() {
    const searchParams = useSearchParams();
    const mesaId = searchParams.get('mesaId');

    const [productos, setProductos] = useState<Producto[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        clienteId: '',
        tipo: (mesaId ? 'mesa' : 'llevar') as TipoOrden,
        notas: '',
    });

    const [detalles, setDetalles] = useState<Omit<OrdenDetalle, 'id' | 'estado' | 'createdAt'>[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productosData, combosData, clientesData] = await Promise.all([
                getProductos(),
                getCombos(),
                getClientes(),
            ]);

            // Solo mostrar productos que se pueden vender
            setProductos(productosData.filter((p: Producto) => p.sePuedeVender));
            setCombos(combosData);
            setClientes(clientesData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const agregarProducto = (producto: Producto) => {
        const detalleExistente = detalles.find(
            d => d.tipo === 'producto' && d.itemId === producto.id
        );

        if (detalleExistente) {
            setDetalles(detalles.map(d =>
                d === detalleExistente
                    ? { ...d, cantidad: d.cantidad + 1 }
                    : d
            ));
        } else {
            setDetalles([...detalles, {
                tipo: 'producto',
                itemId: producto.id,
                producto,
                cantidad: 1,
                precioUnitario: producto.precioPublico,
                tiempoPreparacion: producto.esFabricado ? 15 : 5, // Tiempo estimado
            }]);
        }
    };

    const agregarCombo = (combo: Combo) => {
        const detalleExistente = detalles.find(
            d => d.tipo === 'combo' && d.itemId === combo.id
        );

        if (detalleExistente) {
            setDetalles(detalles.map(d =>
                d === detalleExistente
                    ? { ...d, cantidad: d.cantidad + 1 }
                    : d
            ));
        } else {
            setDetalles([...detalles, {
                tipo: 'combo',
                itemId: combo.id,
                combo,
                cantidad: 1,
                precioUnitario: combo.precioTotal,
                tiempoPreparacion: 20, // Tiempo estimado para combos
            }]);
        }
    };

    const actualizarCantidad = (index: number, nuevaCantidad: number) => {
        if (nuevaCantidad <= 0) {
            setDetalles(detalles.filter((_, i) => i !== index));
        } else {
            setDetalles(detalles.map((detalle, i) =>
                i === index ? { ...detalle, cantidad: nuevaCantidad } : detalle
            ));
        }
    };

    const actualizarNotas = (index: number, notas: string) => {
        setDetalles(detalles.map((detalle, i) =>
            i === index ? { ...detalle, notas } : detalle
        ));
    };

    const calcularTotal = () => {
        return detalles.reduce((total, detalle) =>
            total + (detalle.cantidad * detalle.precioUnitario), 0
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (detalles.length === 0) {
            alert('Debe agregar al menos un producto o combo a la orden');
            return;
        }

        setSubmitting(true);

        try {
            await createOrdenRestaurante({
                mesaId: mesaId || undefined,
                clienteId: formData.clienteId || undefined,
                tipo: formData.tipo,
                detalles,
                notas: formData.notas || undefined,
            });

            alert('Orden creada exitosamente');
            window.location.href = '/pages/restaurante';

        } catch (error) {
            console.error('Error al crear la orden:', error);
            alert('Error al crear la orden');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Crear Nueva Orden {mesaId && `- Mesa ${mesaId}`}
                </h1>
                <button
                    onClick={() => window.history.back()}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Volver
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cliente */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cliente (Opcional)
                        </label>
                        <select
                            value={formData.clienteId}
                            onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar cliente...</option>
                            {clientes.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre} - {cliente.correo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo */}
                    {!mesaId && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Orden
                            </label>
                            <select
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoOrden })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="llevar">Para Llevar</option>
                                <option value="delivery">Delivery</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Notas */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas Especiales
                    </label>
                    <textarea
                        value={formData.notas}
                        onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Productos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Productos Disponibles</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {productos.map(producto => (
                                <div key={producto.id} className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                        <p className="font-medium">{producto.nombre}</p>
                                        <p className="text-sm text-gray-600">${producto.precioPublico}</p>
                                        {producto.esFabricado && (
                                            <p className="text-xs text-blue-600">🔧 Requiere preparación</p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => agregarProducto(producto)}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Combos Disponibles</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {combos.map(combo => (
                                <div key={combo.id} className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                        <p className="font-medium">{combo.nombre}</p>
                                        <p className="text-sm text-gray-600">${combo.precioTotal}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => agregarCombo(combo)}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detalles de la orden */}
                {detalles.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Detalles de la Orden</h3>
                        <div className="space-y-3">
                            {detalles.map((detalle, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {detalle.producto?.nombre || detalle.combo?.nombre}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            ${detalle.precioUnitario} x {detalle.cantidad} = ${detalle.precioUnitario * detalle.cantidad}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => actualizarCantidad(index, detalle.cantidad - 1)}
                                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                        >
                                            -
                                        </button>
                                        <span className="font-medium">{detalle.cantidad}</span>
                                        <button
                                            type="button"
                                            onClick={() => actualizarCantidad(index, detalle.cantidad + 1)}
                                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="ml-4 flex-1">
                                        <input
                                            type="text"
                                            placeholder="Notas especiales..."
                                            value={detalle.notas || ''}
                                            onChange={(e) => actualizarNotas(index, e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total:</span>
                                <span>${calcularTotal()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || detalles.length === 0}
                        className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded"
                    >
                        {submitting ? 'Creando...' : 'Crear Orden'}
                    </button>
                </div>
            </form>
        </div>
    );
}