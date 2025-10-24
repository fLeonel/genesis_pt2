import { OrdenRestaurante, EstadoOrden } from '../../../domain/models/OrdenRestaurante';

interface OrdenCocinaCardProps {
    orden: OrdenRestaurante;
    onEstadoChange: (ordenId: string, nuevoEstado: EstadoOrden) => void;
    onIniciarPreparacion: (orden: OrdenRestaurante) => void;
    procesando: boolean;
}

export default function OrdenCocinaCard({
    orden,
    onEstadoChange,
    onIniciarPreparacion,
    procesando
}: OrdenCocinaCardProps) {
    const getEstadoColor = (estado: EstadoOrden) => {
        switch (estado) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'en_preparacion':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'lista':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getEstadoIcon = (estado: EstadoOrden) => {
        switch (estado) {
            case 'pendiente':
                return '⏳';
            case 'en_preparacion':
                return '👨‍🍳';
            case 'lista':
                return '✅';
            default:
                return '❓';
        }
    };

    const getTiempoEspera = (createdAt: string) => {
        const ahora = new Date();
        const creacion = new Date(createdAt);
        const diferencia = Math.floor((ahora.getTime() - creacion.getTime()) / (1000 * 60));
        return diferencia;
    };

    const getPrioridadColor = (tiempoEspera: number) => {
        if (tiempoEspera > 30) return 'text-red-600 font-bold';
        if (tiempoEspera > 20) return 'text-orange-600 font-semibold';
        if (tiempoEspera > 10) return 'text-yellow-600';
        return 'text-green-600';
    };

    const tiempoEspera = getTiempoEspera(orden.createdAt!);

    return (
        <div className={`p-6 rounded-lg border-2 shadow-sm transition-all duration-200 ${getEstadoColor(orden.estado)}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2">{getEstadoIcon(orden.estado)}</span>
                        {orden.mesa ? `Mesa ${orden.mesa.numero}` : orden.tipo.toUpperCase()}
                    </h3>
                    <p className="text-sm opacity-75">Orden #{orden.id.slice(-6)}</p>
                    {orden.cliente && (
                        <p className="text-sm opacity-75">Cliente: {orden.cliente.nombre}</p>
                    )}
                </div>
                <div className="text-right">
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-white bg-opacity-70">
                        {orden.estado.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className={`text-xs mt-1 ${getPrioridadColor(tiempoEspera)}`}>
                        ⏰ {tiempoEspera} min
                    </p>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                {orden.detalles.map((detalle, index) => (
                    <div key={index} className="bg-white bg-opacity-60 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded mr-2">
                                        {detalle.cantidad}x
                                    </span>
                                    <p className="font-medium">
                                        {detalle.producto?.nombre || detalle.combo?.nombre}
                                    </p>
                                </div>

                                {detalle.notas && (
                                    <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 rounded">
                                        <p className="text-sm text-red-700 font-medium">
                                            🗒️ {detalle.notas}
                                        </p>
                                    </div>
                                )}

                                {detalle.producto?.esFabricado && (
                                    <div className="mt-1 flex items-center text-xs text-blue-600">
                                        <span className="mr-1">🔧</span>
                                        <span>Requiere preparación con receta</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-right text-sm ml-4">
                                {detalle.tiempoPreparacion && (
                                    <p className="text-gray-600 flex items-center">
                                        <span className="mr-1">⏱️</span>
                                        {detalle.tiempoPreparacion} min
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {orden.notas && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
                    <p className="text-sm text-yellow-800">
                        <strong>📋 Notas especiales:</strong> {orden.notas}
                    </p>
                </div>
            )}

            {orden.tiempoEstimado && (
                <div className="mb-4 text-center">
                    <p className="text-sm text-gray-600">
                        ⏰ Tiempo estimado total: <strong>{orden.tiempoEstimado} minutos</strong>
                    </p>
                </div>
            )}

            <div className="flex space-x-2">
                {orden.estado === 'pendiente' && (
                    <button
                        onClick={() => onIniciarPreparacion(orden)}
                        disabled={procesando}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded text-sm transition-colors flex items-center justify-center"
                    >
                        {procesando ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">🚀</span>
                                Iniciar Preparación
                            </>
                        )}
                    </button>
                )}

                {orden.estado === 'en_preparacion' && (
                    <button
                        onClick={() => onEstadoChange(orden.id, 'lista')}
                        disabled={procesando}
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 px-4 rounded text-sm transition-colors flex items-center justify-center"
                    >
                        {procesando ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">✅</span>
                                Marcar Lista
                            </>
                        )}
                    </button>
                )}

                {orden.estado === 'lista' && (
                    <button
                        onClick={() => onEstadoChange(orden.id, 'servida')}
                        disabled={procesando}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-bold py-3 px-4 rounded text-sm transition-colors flex items-center justify-center"
                    >
                        {procesando ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">🍽️</span>
                                Marcar Servida
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}