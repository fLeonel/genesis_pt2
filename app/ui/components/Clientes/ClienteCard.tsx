"use client";

import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { Cliente } from "@/domain/models/Cliente";
import Link from "next/link";
import { useState } from "react";
import { deleteCliente } from "@/application/useCases/Clientes/deleteCliente";
import toast from "react-hot-toast";

interface ClienteCardProps {
  cliente: Cliente;
  onDelete?: (clienteId: string) => void;
}

export default function ClienteCard({ cliente, onDelete }: ClienteCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCliente(cliente.id);
      toast.success("Cliente eliminado correctamente");
      onDelete?.(cliente.id);
    } catch (err) {
      console.error("Error eliminando cliente:", err);
      toast.error("Error al eliminar cliente");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition group relative">
        {/* Header con nombre y acciones */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {cliente.nombre}
              </h2>
              {cliente.clienteCodigo && (
                <p className="text-xs text-gray-500 font-mono">
                  {cliente.clienteCodigo}
                </p>
              )}
            </div>
          </div>

          {/* Acciones - aparecen en hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Link
              href={`/pages/clientes/${cliente.id}`}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              title="Ver cliente"
            >
              <EyeIcon className="w-4 h-4" />
            </Link>
            <Link
              href={`/pages/clientes/${cliente.id}`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Editar cliente"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Eliminar cliente"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="space-y-2 flex-1">
          {cliente.correo && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <EnvelopeIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{cliente.correo}</span>
            </div>
          )}

          {cliente.telefono && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{cliente.telefono}</span>
            </div>
          )}

          {cliente.direccion && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="line-clamp-2">{cliente.direccion}</span>
            </div>
          )}

          {!cliente.correo && !cliente.telefono && !cliente.direccion && (
            <p className="text-sm text-gray-400 italic">Sin información de contacto</p>
          )}
        </div>

        {/* Footer con fecha de creación */}
        {cliente.createdAt && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Registrado: {new Date(cliente.createdAt).toLocaleDateString('es-GT')}
            </p>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Eliminar cliente
                </h3>
                <p className="text-sm text-gray-500">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar el cliente{" "}
              <span className="font-medium">{cliente.nombre}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
