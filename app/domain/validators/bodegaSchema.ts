import { z } from "zod";

export const bodegaSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
});
