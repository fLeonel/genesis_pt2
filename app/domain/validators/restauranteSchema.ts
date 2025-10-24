import { z } from "zod";

export const mesaSchema = z.object({
  numero: z.number().min(1, "El número de mesa debe ser mayor a 0"),
  capacidad: z.number().min(1, "La capacidad debe ser mayor a 0"),
  estado: z.enum(["disponible", "ocupada", "reservada", "limpieza"]),
  ubicacion: z.string().optional(),
  notas: z.string().optional(),
});

export const ordenDetalleSchema = z.object({
  tipo: z.enum(["producto", "combo"]),
  itemId: z.string().min(1, "ID del item es requerido"),
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
  precioUnitario: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  notas: z.string().optional(),
  tiempoPreparacion: z.number().optional(),
});

export const ordenRestauranteSchema = z.object({
  mesaId: z.string().optional(),
  clienteId: z.string().optional(),
  tipo: z.enum(["mesa", "llevar", "delivery"]),
  estado: z.enum([
    "pendiente",
    "en_preparacion",
    "lista",
    "servida",
    "cancelada",
  ]),
  detalles: z.array(ordenDetalleSchema).min(1, "Debe incluir al menos un item"),
  notas: z.string().optional(),
  tiempoEstimado: z.number().optional(),
});

export type MesaFormData = z.infer<typeof mesaSchema>;
export type OrdenDetalleFormData = z.infer<typeof ordenDetalleSchema>;
export type OrdenRestauranteFormData = z.infer<typeof ordenRestauranteSchema>;
