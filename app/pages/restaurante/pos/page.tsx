'use client';

import { useState, useEffect } from 'react';
import { Producto } from '../../../domain/models/Productos';
import { Combo } from '../../../domain/models/Combo';
import { Cliente } from '../../../domain/models/Cliente';
import { VentaDetalle } from '../../../domain/models/Venta';
import { getProductos } from '../../../application/useCases/Inventario/Productos/getProductos';
import { getCombos } from '../../../application/useCases/Inventario/Combos/getCombos';
import { getClientes } from '../../../application/useCases/Clientes/getClientes';
import { createVenta } from '../../../application/useCases/Ventas/createVenta';

export default function POSPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [clienteId, setClienteId] = useState('');
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [notas, setNotas] = useState('');

    const [carrito, setCarrito] = useState<VentaDetalle[]>([]);

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

            // Solo productos que se pueden vender
            setProductos(productosData.filter((p: Producto) => p.sePuedeVender));
            setCombos(combosData);
            setClientes(clientesData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const agregarAlCarrito = (item: Producto | Combo, tipo: 'producto' | 'combo') => {
        const itemId = item.id;
        const precio = tipo === 'producto' ? (item as Producto).precioPublico : (item as Combo).precioTotal;

        const itemExistente = carrito.find(c => c.itemId === itemId && c.tipo === tipo);

        if (itemExistente) {
            setCarrito(carrito.map(c =>
                c === itemExistente
                    ? { ...c, cantidad: c.cantidad + 1 }
                    : c
            ));
        } else {
            const nuevoItem: VentaDetalle = {
                id: `${Date.now()}-${itemId}`,
                tipo,
                itemId,
                ...(tipo === 'producto' ? { producto: item as Producto } : { combo: item as Combo }),
                cantidad: 1,
                precioUnitario: precio,
            };
            setCarrito([...carrito, nuevoItem]);
        }
    };

    const actualizarCantidad = (index: number, nuevaCantidad: number) => {
        if (nuevaCantidad <= 0) {
            setCarrito(carrito.filter((_, i) => i !== index));
        } else {
            setCarrito(carrito.map((item, i) =>
                i === index ? { ...item, cantidad: nuevaCantidad } : item
            ));
        }
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) =>
            total + (item.cantidad * item.precioUnitario), 0
        );
    };

    const limpiarCarrito = () => {
        setCarrito([]);
        setClienteId('');
        setNotas('');
    };

    const procesarVenta = async () => {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        setSubmitting(true);

        try {
            await createVenta({
                clienteId: clienteId || undefined,
                metodoPago,
                notas: notas || undefined,
                total: calcularTotal(),
                estado: 'confirmada',
                detalles: carrito,
            });

            alert('¡Venta procesada exitosamente!');
            limpiarCarrito();
        } catch (error) {
            console.error('Error al procesar la venta:', error);
            alert('Error al procesar la venta');
        } finally {
            setSubmitting(false);
        }
    };

    const filtrarItems = () => {
        const todosTipos = [
            ...productos.map(p => ({ ...p, tipo: 'producto' as const })),
            ...combos.map(c => ({ ...c, tipo: 'combo' as const }))
        ];

        return todosTipos.filter(item => {
            const matchSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = selectedCategory === 'todos' ||
                (selectedCategory === 'productos' && item.tipo === 'producto') ||
                (selectedCategory === 'combos' && item.tipo === 'combo');

            return matchSearch && matchCategory;
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando punto de venta...</div>
            </div>
        );
    }

    const itemsFiltrados = filtrarItems();

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">🛒 Punto de Venta</h1>
                <button
                    onClick={() => window.history.back()}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Volver
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel de productos */}
                <div className="lg:col-span-2">
                    {/* Filtros */}
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="todos">Todos los items</option>
                                    <option value="productos">Solo Productos</option>
                                    <option value="combos">Solo Combos</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Grid de productos */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                        {itemsFiltrados.map((item) => (
                            <div
                                key={`${item.tipo}-${item.id}`}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => agregarAlCarrito(item, item.tipo)}
                            >
                                <div className="text-center">
                                    <div className="text-2xl mb-2">
                                        {item.tipo === 'producto' ? '🍽️' : '🍱'}
                                    </div>
                                    <h4 className="font-semibold text-sm mb-1">{item.nombre}</h4>
                                    <p className="text-lg font-bold text-blue-600">
                                        ${item.tipo === 'producto' ? (item as Producto).precioPublico : (item as Combo).precioTotal}
                                    </p>
                                    {item.tipo === 'producto' && (item as Producto).esFabricado && (
                                        <p className="text-xs text-orange-600 mt-1">🔧 Requiere cocina</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {itemsFiltrados.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No se encontraron productos</p>
                        </div>
                    )}
                </div>

                {/* Panel del carrito */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">🛒 Carrito de Compras</h2>

                    {/* Items del carrito */}
                    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                        {carrito.map((item, index) => (
                            <div key={item.id} className="flex justify-between items-center p-2 border-b">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">
                                        {item.producto?.nombre || item.combo?.nombre}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        ${item.precioUnitario} c/u
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        -
                                    </button>
                                    <span className="font-medium">{item.cantidad}</span>
                                    <button
                                        onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {carrito.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>El carrito está vacío</p>
                            <p className="text-sm">Selecciona productos para agregar</p>
                        </div>
                    )}

                    {/* Información de la venta */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cliente (Opcional)
                            </label>
                            <select
                                value={clienteId}
                                onChange={(e) => setClienteId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sin cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Método de Pago
                            </label>
                            <select
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="efectivo">Efectivo</option>
                                <option value="tarjeta">Tarjeta</option>
                                <option value="transferencia">Transferencia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notas
                            </label>
                            <textarea
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Notas adicionales..."
                            />
                        </div>
                    </div>

                    {/* Total y acciones */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-green-600">
                                ${calcularTotal().toFixed(2)}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={procesarVenta}
                                disabled={submitting || carrito.length === 0}
                                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded text-sm"
                            >
                                {submitting ? 'Procesando...' : '💳 Procesar Venta'}
                            </button>

                            <button
                                onClick={limpiarCarrito}
                                disabled={carrito.length === 0}
                                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded text-sm"
                            >
                                🗑️ Limpiar Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}