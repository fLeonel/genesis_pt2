"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createCliente } from "@/application/useCases/Clientes/createCliente";
import { updateCliente } from "@/application/useCases/Clientes/updateCliente";
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { clienteSchema, type ClienteInput } from "@/domain/validators/clienteSchema";

// Función para generar código de cliente automático
function generateClienteCodigo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CLI-${year}${month}${day}-${random}`;
}

export default function ClienteForm({
  mode = "create",
  defaultValues,
  clienteId,
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<ClienteInput>;
  clienteId?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      clienteCodigo: "",
      nombre: "",
      correo: "",
      telefono: "",
      direccion: "",
      ...defaultValues,
    },
  });

  // Generar código automáticamente solo en modo crear
  useEffect(() => {
    if (mode === "create" && !defaultValues?.clienteCodigo) {
      const codigo = generateClienteCodigo();
      setValue("clienteCodigo", codigo);
    }
  }, [mode, defaultValues, setValue]);

  const onSubmit = async (data: ClienteInput) => {
    try {
      setSubmitting(true);

      // Limpiar campos vacíos
      const cleanData = {
        ...data,
        clienteCodigo: data.clienteCodigo || undefined,
        correo: data.correo || undefined,
        telefono: data.telefono || undefined,
        direccion: data.direccion || undefined,
      };

      if (mode === "create") {
        await createCliente(cleanData);
        toast.success("Cliente creado con éxito");
      } else if (clienteId) {
        await updateCliente(clienteId, cleanData);
        toast.success("Cliente actualizado correctamente");
      }

      router.push("/pages/clientes");
    } catch (err) {
      console.error("❌ Error al guardar cliente:", err);
      toast.error("Error al guardar cliente: " + (err instanceof Error ? err.message : "Intenta nuevamente"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Código de cliente - Autogenerado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Código de cliente
        </label>
        <input
          {...register("clienteCodigo")}
          readOnly
          placeholder="Se generará automáticamente"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Código generado automáticamente</p>
      </div>

      {/* Nombre - Campo requerido */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-indigo-600" />
            Nombre completo *
          </div>
        </label>
        <input
          {...register("nombre")}
          placeholder="Ej: Juan Pérez"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* Correo electrónico */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4 text-indigo-600" />
            Correo electrónico
          </div>
        </label>
        <input
          {...register("correo")}
          type="email"
          placeholder="Ej: juan@ejemplo.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        {errors.correo && (
          <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-indigo-600" />
            Teléfono
          </div>
        </label>
        <input
          {...register("telefono")}
          type="tel"
          placeholder="Ej: +502 1234-5678"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        {errors.telefono && (
          <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-indigo-600" />
            Dirección
          </div>
        </label>
        <textarea
          {...register("direccion")}
          rows={3}
          placeholder="Ej: Zona 10, Ciudad de Guatemala"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
        />
        {errors.direccion && (
          <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push("/pages/clientes")}
          className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitting
            ? "Guardando..."
            : mode === "create"
              ? "Crear cliente"
              : "Actualizar cliente"}
        </button>
      </div>
    </form>
  );
}
