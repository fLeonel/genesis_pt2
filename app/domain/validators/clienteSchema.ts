import { z } from "zod";

export const clienteSchema = z.object({
  clienteCodigo: z.string().optional(),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

export const createClienteSchema = clienteSchema;

export const updateClienteSchema = clienteSchema.partial().extend({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
