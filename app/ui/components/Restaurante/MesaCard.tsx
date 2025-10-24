import { Mesa, EstadoMesa } from '../../../domain/models/Mesa';

interface MesaCardProps {
    mesa: Mesa;
    onEstadoChange: (mesaId: string, nuevoEstado: EstadoMesa) => void;
}

export default function MesaCard({ mesa, onEstadoChange }: MesaCardProps) {
    const getEstadoColor = (estado: EstadoMesa) => {
        switch (estado) {
            case 'disponible':
                return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
            case 'ocupada':
                return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
            case 'reservada':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
            case 'limpieza':
                return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
        }
    };

    const getEstadoIcon = (estado: EstadoMesa) => {
        switch (estado) {
            case 'disponible':
                return '✅';
            case 'ocupada':
                return '🔴';
            case 'reservada':
                return '⏰';
            case 'limpieza':
                return '🧽';
            default:
                return '❓';
        }
    };

    return (
        <div
            className={`p-6 rounded-lg border-2 shadow-sm transition-all duration-200 cursor-pointer ${getEstadoColor(mesa.estado)}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold flex items-center">
                        <span className="mr-2">{getEstadoIcon(mesa.estado)}</span>
                        Mesa {mesa.numero}
                    </h3>
                    <p className="text-sm opacity-75">ID: {mesa.id.slice(-6)}</p>
                </div>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-white bg-opacity-70">
                    {mesa.estado.toUpperCase()}
                </span>
            </div>

            <div className="space-y-2 text-sm mb-4 opacity-90">
                <div className="flex justify-between">
                    <span>Capacidad:</span>
                    <span className="font-medium">{mesa.capacidad} personas</span>
                </div>
                {mesa.ubicacion && (
                    <div className="flex justify-between">
                        <span>Ubicación:</span>
                        <span className="font-medium">{mesa.ubicacion}</span>
                    </div>
                )}
                {mesa.notas && (
                    <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs">
                        <strong>Notas:</strong> {mesa.notas}
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                {mesa.estado === 'disponible' && (
                    <>
                        <button
                            onClick={() => onEstadoChange(mesa.id, 'ocupada')}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                        >
                            🍽️ Ocupar Mesa
                        </button>
                        <button
                            onClick={() => onEstadoChange(mesa.id, 'reservada')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                        >
                            📅 Reservar
                        </button>
                    </>
                )}

                {mesa.estado === 'ocupada' && (
                    <>
                        <button
                            onClick={() => window.location.href = `/pages/restaurante/ordenes/crear?mesaId=${mesa.id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                        >
                            📝 Tomar Orden
                        </button>
                        <button
                            onClick={() => onEstadoChange(mesa.id, 'limpieza')}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                        >
                            🧽 Marcar para Limpieza
                        </button>
                    </>
                )}

                {mesa.estado === 'limpieza' && (
                    <button
                        onClick={() => onEstadoChange(mesa.id, 'disponible')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                    >
                        ✨ Marcar Disponible
                    </button>
                )}

                {mesa.estado === 'reservada' && (
                    <>
                        <button
                            onClick={() => onEstadoChange(mesa.id, 'ocupada')}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                        >
                            ✅ Confirmar Llegada
                        </button>
                        <button
                            onClick={() => onEstadoChange(mesa.id, 'disponible')}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                        >
                            ❌ Cancelar Reserva
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}