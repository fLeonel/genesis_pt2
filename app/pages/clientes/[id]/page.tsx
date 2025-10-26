"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClienteById } from "@/application/useCases/Clientes/getClienteById";
import { deleteCliente } from "@/application/useCases/Clientes/deleteCliente";
import { Cliente } from "@/domain/models/Cliente";
import ClienteForm from "@/ui/components/Clientes/ClienteForm";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ClienteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (clienteId) {
      getClienteById(clienteId)
        .then(setCliente)
        .catch((err) => {
          console.error("Error cargando cliente:", err);
          toast.error("Cliente no encontrado");
          router.push("/pages/clientes");
        })
        .finally(() => setLoading(false));
    }
  }, [clienteId, router]);

  const handleDelete = async () => {
    if (!cliente) return;

    try {
      setDeleting(true);
      await deleteCliente(cliente.id);
      toast.success("Cliente eliminado correctamente");
      router.push("/pages/clientes");
    } catch (err) {
      console.error("Error eliminando cliente:", err);
      toast.error(
        "Error al eliminar cliente: " +
          (err instanceof Error ? err.message : "Intenta nuevamente"),
      );
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">
          Cargando cliente...
        </p>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-[calc(100vh-80px)] px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Cliente no encontrado
          </h1>
          <Link
            href="/pages/clientes"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Volver a clientes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/pages/clientes"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {editing ? "Editar cliente" : cliente.nombre}
              </h1>
              <p className="text-sm text-gray-500">
                {cliente.clienteCodigo && `Código: ${cliente.clienteCodigo}`}
              </p>
            </div>
          </div>
        </div>

        {!editing && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium shadow-sm flex items-center gap-2"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium shadow-sm flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {editing ? (
          <>
            <ClienteForm
              mode="edit"
              defaultValues={cliente}
              clienteId={cliente.id}
            />
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setEditing(false)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancelar edición
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de cliente
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-2.5">
                  {cliente.clienteCodigo || "Sin código"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-2.5">
                  {cliente.nombre}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIt, CUI
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-2.5">
                  {cliente.nit || "CF"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-2.5">
                  {cliente.correo || "Sin correo"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-2.5">
                  {cliente.telefono || "Sin teléfono"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-2.5 min-h-20">
                {cliente.direccion || "Sin dirección"}
              </p>
            </div>

            {cliente.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de registro
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-2.5">
                  {new Date(cliente.createdAt).toLocaleDateString("es-GT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
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
    </div>
  );
}
