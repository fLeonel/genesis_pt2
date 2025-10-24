'use client';

export default function RestaurantePage() {
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900">🍽️ Restaurante - Punto de Venta</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* POS - Punto de Venta */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => window.location.href = '/pages/restaurante/pos'}>
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-500 p-3 rounded-full mr-4">
                            <span className="text-white text-2xl">🛒</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Punto de Venta</h3>
                            <p className="text-gray-600">Crear órdenes y procesar ventas</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p>• Interfaz rápida para tomar órdenes</p>
                        <p>• Integración con inventario</p>
                        <p>• Cálculo automático de precios</p>
                    </div>
                </div>

                {/* Vista de Cocina */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => window.location.href = '/pages/restaurante/cocina'}>
                    <div className="flex items-center mb-4">
                        <div className="bg-orange-500 p-3 rounded-full mr-4">
                            <span className="text-white text-2xl">👨‍🍳</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Vista de Cocina</h3>
                            <p className="text-gray-600">Gestionar preparación de pedidos</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p>• Órdenes pendientes y en preparación</p>
                        <p>• Procesamiento de recetas</p>
                        <p>• Control de inventario automático</p>
                    </div>
                </div>

                {/* Historial de Ventas */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => window.location.href = '/pages/ventas'}>
                    <div className="flex items-center mb-4">
                        <div className="bg-green-500 p-3 rounded-full mr-4">
                            <span className="text-white text-2xl">📊</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Historial de Ventas</h3>
                            <p className="text-gray-600">Revisar transacciones del día</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p>• Ventas realizadas</p>
                        <p>• Reportes y estadísticas</p>
                        <p>• Control de ingresos</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">📈 Resumen del Día</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-gray-600">Ventas Hoy</h3>
                        <p className="text-2xl font-bold text-blue-600">$0</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-gray-600">Órdenes</h3>
                        <p className="text-2xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-gray-600">En Cocina</h3>
                        <p className="text-2xl font-bold text-orange-600">0</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-gray-600">Productos Activos</h3>
                        <p className="text-2xl font-bold text-purple-600">-</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    💡 <strong>Tip:</strong> Usa el Punto de Venta para crear órdenes rápidamente y la Vista de Cocina para gestionar la preparación.
                </p>
            </div>
        </div>
    );
}