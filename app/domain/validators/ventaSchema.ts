import { z } from "zod";

export const ventaDetalleSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum(["producto", "combo"]),
  itemId: z.string().min(1, "Producto o combo es requerido"),
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
  precioUnitario: z.number().min(0, "El precio debe ser mayor o igual a 0"),
});

export const ventaSchema = z.object({
  clienteId: z.string().min(1, "Cliente es requerido"),
  metodoPago: z.string().min(1, "Método de pago es requerido"),
  notas: z.string().optional(),
  detalles: z
    .array(ventaDetalleSchema)
    .min(1, "Debe agregar al menos un producto o combo"),
});

export const createVentaSchema = ventaSchema;

export const updateVentaSchema = ventaSchema.partial().extend({
  detalles: z
    .array(ventaDetalleSchema)
    .min(1, "Debe agregar al menos un producto o combo"),
});

export const confirmarVentaSchema = z.object({
  confirmar: z.boolean(),
});

export type VentaInput = z.infer<typeof ventaSchema>;
export type VentaDetalleInput = z.infer<typeof ventaDetalleSchema>;
export type CreateVentaInput = z.infer<typeof createVentaSchema>;
export type UpdateVentaInput = z.infer<typeof updateVentaSchema>;
export type ConfirmarVentaInput = z.infer<typeof confirmarVentaSchema>;
