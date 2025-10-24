"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { updateVenta } from "@/application/useCases/Ventas/udpateVenta";
import { createVenta } from "@/application/useCases/Ventas/createVenta";
import { getClientes } from "@/application/useCases/Clientes/getClientes";
import { getProductos } from "@/application/useCases/Inventario/Productos/getProductos";
import { confirmarVenta } from "@/application/useCases/Ventas/confirmarVenta";
import { getCombos } from "@/application/useCases/Inventario/Combos/getCombos";
import { Cliente } from "@/domain/models/Cliente";
import { Producto } from "@/domain/models/Productos";
import { Combo } from "@/domain/models/Combo";
import { ventaSchema, type VentaInput } from "@/domain/validators/ventaSchema";
import toast from "react-hot-toast";
import {
  UserIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const metodoPagoOptions = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "transferencia", label: "Transferencia" },
  { value: "cheque", label: "Cheque" },
];

export default function VentaForm({
  mode = "create",
  defaultValues,
  ventaId,
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<VentaInput>;
  ventaId?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VentaInput>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      clienteId: "",
      metodoPago: "",
      notas: "",
      detalles: [
        {
          tipo: "producto" as const,
          itemId: "",
          cantidad: 1,
          precioUnitario: 0,
        },
      ],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const watchedDetalles = watch("detalles");

  useEffect(() => {
    Promise.all([getClientes(), getProductos(), getCombos()])
      .then(([clientesData, productosData, combosData]) => {
        setClientes(clientesData);
        setProductos(productosData);
        setCombos(combosData);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        toast.error("Error cargando datos necesarios");
      })
      .finally(() => setLoadingData(false));
  }, []);

  const total = useMemo(() => {
    return watchedDetalles.reduce((sum, detalle) => {
      const cantidad = Number(detalle.cantidad) || 0;
      const precio = Number(detalle.precioUnitario) || 0;
      return sum + cantidad * precio;
    }, 0);
  }, [watchedDetalles]);

  const handleItemChange = (index: number, tipo: string, itemId: string) => {
    setValue(`detalles.${index}.tipo`, tipo as "producto" | "combo");
    setValue(`detalles.${index}.itemId`, itemId);

    if (tipo === "producto") {
      const producto = productos.find((p) => p.id === itemId);
      if (producto) {
        if (!producto.sePuedeVender) {
          toast.error(`El producto "${producto.nombre}" no se puede vender`);
          setValue(`detalles.${index}.itemId`, "");
          setValue(`detalles.${index}.precioUnitario`, 0);
          return;
        }
        setValue(`detalles.${index}.precioUnitario`, producto.precioPublico);
      }
    } else if (tipo === "combo") {
      const combo = combos.find((c) => c.id === itemId);
      if (combo) {
        setValue(`detalles.${index}.precioUnitario`, combo.precioTotal);
      }
    }
  };

  const onSubmit = async (data: VentaInput, confirmar = false) => {
    try {
      setSubmitting(true);

      if (!data.clienteId) {
        toast.error("Selecciona un cliente");
        return;
      }

      if (!data.metodoPago) {
        toast.error("Selecciona un método de pago");
        return;
      }

      const hasEmptyItems = data.detalles.some((d) => !d.itemId);
      if (hasEmptyItems) {
        toast.error("Selecciona todos los productos o combos");
        return;
      }

      const ventaData = {
        clienteId: data.clienteId,
        metodoPago: data.metodoPago,
        notas: data.notas,
        detalles: data.detalles.map((d) => ({
          productoId: d.itemId,
          cantidad: Number(d.cantidad) || 1,
        })),
      };

      console.log("Payload enviado:", JSON.stringify(ventaData, null, 2));

      if (mode === "create") {
        await createVenta(ventaData);
        toast.success(
          confirmar ? "Venta confirmada" : "Venta creada como borrador",
        );
      } else if (ventaId) {
        if (confirmar) {
          await confirmarVenta(ventaId);
          toast.success("Venta confirmada exitosamente");
        } else {
          await updateVenta(ventaId, ventaData);
          toast.success("Venta actualizada");
        }
      }

      router.push("/pages/ventas");
    } catch (err) {
      console.error("Error al guardar venta:", err);
      toast.error("Error al guardar venta");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(amount);
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-sm animate-pulse">Cargando datos...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Información general
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-green-600" />
                Cliente *
              </div>
            </label>
            <select
              {...register("clienteId")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            {errors.clienteId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clienteId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="w-4 h-4 text-green-600" />
                Método de pago *
              </div>
            </label>
            <select
              {...register("metodoPago")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            >
              <option value="">Seleccionar método</option>
              {metodoPagoOptions.map((metodo) => (
                <option key={metodo.value} value={metodo.value}>
                  {metodo.label}
                </option>
              ))}
            </select>
            {errors.metodoPago && (
              <p className="text-red-500 text-xs mt-1">
                {errors.metodoPago.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4 text-green-600" />
              Notas adicionales
            </div>
          </label>
          <textarea
            {...register("notas")}
            rows={3}
            placeholder="Información adicional sobre la venta..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCartIcon className="w-5 h-5 text-green-600" />
            Productos
          </h2>
          <button
            type="button"
            onClick={() =>
              append({
                tipo: "producto",
                itemId: "",
                cantidad: 1,
                precioUnitario: 0,
              })
            }
            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    {...register(`detalles.${index}.tipo`)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  >
                    <option value="producto">Producto</option>
                    <option value="combo">Combo</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {watchedDetalles[index]?.tipo === "combo"
                      ? "Combo"
                      : "Producto"}{" "}
                    *
                  </label>
                  <select
                    {...register(`detalles.${index}.itemId`)}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        watchedDetalles[index]?.tipo || "producto",
                        e.target.value,
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  >
                    <option value="">
                      {watchedDetalles[index]?.tipo === "combo"
                        ? "Seleccionar combo"
                        : "Seleccionar producto"}
                    </option>
                    {watchedDetalles[index]?.tipo === "combo"
                      ? combos.map((combo) => (
                          <option key={combo.id} value={combo.id}>
                            {combo.nombre} - {formatCurrency(combo.precioTotal)}
                          </option>
                        ))
                      : productos
                          .filter((producto) => producto.sePuedeVender)
                          .map((producto) => (
                            <option key={producto.id} value={producto.id}>
                              {producto.nombre} -{" "}
                              {formatCurrency(producto.precioPublico)}
                            </option>
                          ))}
                  </select>
                  {errors.detalles?.[index]?.itemId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.detalles[index]?.itemId?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    {...register(`detalles.${index}.cantidad`, {
                      valueAsNumber: true,
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                  {errors.detalles?.[index]?.cantidad && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.detalles[index]?.cantidad?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio unitario *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register(`detalles.${index}.precioUnitario`, {
                      valueAsNumber: true,
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                  {errors.detalles?.[index]?.precioUnitario && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.detalles[index]?.precioUnitario?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-600">Subtotal: </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(
                      (watchedDetalles[index]?.cantidad || 0) *
                        (watchedDetalles[index]?.precioUnitario || 0),
                    )}
                  </span>
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar producto"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {errors.detalles && (
          <p className="text-red-500 text-xs mt-2">{errors.detalles.message}</p>
        )}
      </div>

      <div className="bg-green-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-green-900">
            Total de la venta
          </h3>
          <span className="text-2xl font-bold text-green-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push("/pages/ventas")}
          className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancelar
        </button>

        {mode === "edit" && (
          <button
            type="button"
            disabled={submitting || total <= 0}
            onClick={handleSubmit((data) => onSubmit(data, true))}
            className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Confirmar venta
          </button>
        )}

        <button
          type="submit"
          disabled={submitting || total <= 0}
          className="px-5 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitting
            ? "Guardando..."
            : mode === "create"
              ? "Crear venta (borrador)"
              : "Actualizar venta"}
        </button>
      </div>
    </form>
  );
}
