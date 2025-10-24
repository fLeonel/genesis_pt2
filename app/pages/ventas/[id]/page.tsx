"use client";

import { confirmarVenta } from "@/application/useCases/Ventas/confirmarVenta"; // 👈 asegurate de tener este import arriba
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getVentaById } from "@/application/useCases/Ventas/getVentaById";
import { deleteVenta } from "@/application/useCases/Ventas/deleteVenta";
import { updateVenta } from "@/application/useCases/Ventas/udpateVenta";
import { Venta } from "@/domain/models/Venta";
import VentaForm from "@/ui/components/Ventas/VentaForm";
import {
  CurrencyDollarIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VentaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ventaId = params.id as string;

  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (ventaId) {
      getVentaById(ventaId)
        .then(setVenta)
        .catch((err) => {
          console.error("Error cargando venta:", err);
          toast.error("Venta no encontrada");
          router.push("/pages/ventas");
        })
        .finally(() => setLoading(false));
    }
  }, [ventaId, router]);

  const handleDelete = async () => {
    if (!venta) return;

    try {
      setDeleting(true);
      await deleteVenta(venta.id);
      toast.success("Venta eliminada correctamente");
      router.push("/pages/ventas");
    } catch (err) {
      console.error("Error eliminando venta:", err);
      toast.error(
        "Error al eliminar venta: " +
          (err instanceof Error ? err.message : "Intenta nuevamente"),
      );
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleConfirm = async () => {
    if (!venta) return;

    try {
      setConfirming(true);
      await confirmarVenta(venta.id);

      toast.success(
        "Venta confirmada correctamente. El inventario ha sido actualizado.",
      );

      router.refresh();
      router.push("/pages/ventas");

      setVenta((prev) =>
        prev
          ? {
              ...prev,
              estado: "confirmada",
              confirmedAt: new Date().toISOString(),
            }
          : null,
      );
    } catch (err) {
      console.error("Error confirmando venta:", err);
      toast.error(
        "Error al confirmar venta: " +
          (err instanceof Error ? err.message : "Intenta nuevamente"),
      );
    } finally {
      setConfirming(false);
      setShowConfirmModal(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(amount);
  };

  const getEstadoBadge = (estado: string) => {
    if (estado === "confirmada") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-4 h-4" />
          Confirmada
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <ClockIcon className="w-4 h-4" />
          Borrador
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm animate-pulse">Cargando venta...</p>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="min-h-[calc(100vh-80px)] px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Venta no encontrada
          </h1>
          <Link
            href="/pages/ventas"
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            ← Volver a ventas
          </Link>
        </div>
      </div>
    );
  }

  const isConfirmed = venta.estado === "confirmada";

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/pages/ventas"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Venta #{venta.id.slice(-8)}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {getEstadoBadge(venta.estado)}
                <span className="text-sm text-gray-500">
                  {formatCurrency(venta.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!isConfirmed && (
          <div className="flex items-center gap-3">
            {!editing && (
              <>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Confirmar venta
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium shadow-sm flex items-center gap-2"
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
              </>
            )}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto space-y-6">
        {editing ? (
          <>
            <VentaForm
              mode="edit"
              defaultValues={{
                clienteId: venta.clienteId,
                metodoPago: venta.metodoPago,
                notas: venta.notas || "",
                detalles: venta.detalles.map((detalle) => ({
                  tipo: detalle.tipo || "producto",
                  itemId: detalle.itemId || detalle.productoId || "",
                  cantidad: detalle.cantidad,
                  precioUnitario: detalle.precioUnitario,
                })),
              }}
              ventaId={venta.id}
            />
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => setEditing(false)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancelar edición
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Información general */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información general
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {venta.cliente?.nombre || "Cliente eliminado"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de pago
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CreditCardIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {venta.metodoPago}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de creación
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                    {venta.createdAt
                      ? new Date(venta.createdAt).toLocaleDateString("es-GT", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Sin fecha"}
                  </p>
                </div>

                {isConfirmed && venta.confirmedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de confirmación
                    </label>
                    <p className="text-sm text-gray-900 bg-green-50 rounded-lg px-3 py-2">
                      {new Date(venta.confirmedAt).toLocaleDateString("es-GT", {
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

              {venta.notas && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                    {venta.notas}
                  </p>
                </div>
              )}
            </div>

            {/* Detalles de productos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Productos ({venta.detalles.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 rounded-lg">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-l-lg">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Precio Unitario
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-r-lg">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {venta.detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">
                            {detalle.producto?.nombre ||
                              `Producto ${detalle.productoId}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-900">
                            {detalle.cantidad}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-gray-900">
                            {formatCurrency(detalle.precioUnitario)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(
                              detalle.cantidad * detalle.precioUnitario,
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-right text-sm font-semibold text-gray-900"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                        {formatCurrency(venta.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
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
                  Eliminar venta
                </h3>
                <p className="text-sm text-gray-500">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar la venta{" "}
              <span className="font-medium">#{venta.id.slice(-8)}</span>?
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

      {/* Modal de confirmación de venta */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar venta
                </h3>
                <p className="text-sm text-gray-500">
                  Una vez confirmada no se podrá modificar
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              ¿Estás seguro de que deseas confirmar la venta{" "}
              <span className="font-medium">#{venta.id.slice(-8)}</span> por{" "}
              <span className="font-medium">{formatCurrency(venta.total)}</span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={confirming}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {confirming ? "Confirmando..." : "Confirmar venta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
