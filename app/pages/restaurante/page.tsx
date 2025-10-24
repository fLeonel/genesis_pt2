'use client';

import { styleClasses } from '../../ui/theme/designSystem';
import Card from '../../ui/components/base/Card';
import PageHeader from '../../ui/components/base/PageHeader';

export default function RestaurantePage() {
    const modules = [
        {
            name: "Punto de Venta",
            description: "Crear órdenes y procesar ventas rápidamente",
            href: "/pages/restaurante/pos",
            icon: "🛒",
            color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
            features: [
                "Interfaz rápida para tomar órdenes",
                "Integración con inventario",
                "Cálculo automático de precios"
            ]
        },
        {
            name: "Vista de Cocina",
            description: "Gestionar preparación de pedidos",
            href: "/pages/restaurante/cocina",
            icon: "👨‍🍳",
            color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
            features: [
                "Órdenes pendientes y en preparación",
                "Procesamiento de recetas",
                "Control de inventario automático"
            ]
        },
        {
            name: "Historial de Ventas",
            description: "Revisar transacciones del día",
            href: "/pages/ventas",
            icon: "📊",
            color: "bg-green-50 border-green-200 hover:bg-green-100",
            features: [
                "Ventas realizadas",
                "Reportes y estadísticas",
                "Control de ingresos"
            ]
        }
    ];

    return (
        <div className={styleClasses.page}>
            <PageHeader
                title="🍽️ Restaurante"
                subtitle="Sistema de punto de venta y gestión de cocina"
            />

            <div className={styleClasses.container}>
                {/* Módulos del restaurante */}
                <div className={styleClasses.grid.cols3}>
                    {modules.map((module) => (
                        <div
                            key={module.name}
                            className="cursor-pointer group"
                            onClick={() => window.location.href = module.href}
                        >
                            <Card className={`${module.color} border-2 hover:shadow-lg transition-all hover:scale-105`}>
                                <div className="text-center mb-6">
                                    <div className="text-4xl mb-4">{module.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {module.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {module.description}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {module.features.map((feature, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0"></span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Resumen del día */}
                <div className="mt-12">
                    <h2 className={styleClasses.sectionTitle}>📈 Resumen del Día</h2>
                    <div className={styleClasses.grid.cols4}>
                        <Card className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">$0</div>
                            <div className="text-sm text-gray-600">Ventas Hoy</div>
                        </Card>
                        <Card className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                            <div className="text-sm text-gray-600">Órdenes</div>
                        </Card>
                        <Card className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                            <div className="text-sm text-gray-600">En Cocina</div>
                        </Card>
                        <Card className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">-</div>
                            <div className="text-sm text-gray-600">Productos Activos</div>
                        </Card>
                    </div>
                </div>

                {/* Tip */}
                <div className="mt-12 text-center">
                    <Card className="bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-center space-x-2 text-blue-800">
                            <span className="text-2xl">💡</span>
                            <p>
                                <strong>Tip:</strong> Usa el Punto de Venta para crear órdenes rápidamente y la Vista de Cocina para gestionar la preparación.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>            {/* Resumen del día */}
            <div className="mt-12">
                <h2 className={styleClasses.sectionTitle}>📈 Resumen del Día</h2>
                <div className={styleClasses.grid.cols4}>
                    <Card className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">$0</div>
                        <div className="text-sm text-gray-600">Ventas Hoy</div>
                    </Card>
                    <Card className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                        <div className="text-sm text-gray-600">Órdenes</div>
                    </Card>
                    <Card className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                        <div className="text-sm text-gray-600">En Cocina</div>
                    </Card>
                    <Card className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">-</div>
                        <div className="text-sm text-gray-600">Productos Activos</div>
                    </Card>
                </div>
            </div>

            {/* Tip */}
            <div className="mt-12 text-center">
                <Card className="bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-center space-x-2 text-blue-800">
                        <span className="text-2xl">💡</span>
                        <p>
                            <strong>Tip:</strong> Usa el Punto de Venta para crear órdenes rápidamente y la Vista de Cocina para gestionar la preparación.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}