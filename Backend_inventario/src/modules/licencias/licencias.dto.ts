import { z } from "zod";

export const asignarLicenciaEquipoSchema = z.object({
  elc_lcd_id: z.number().int().positive(),
  elc_equ_id: z.number().int().positive(),
  elc_fechainsta: z.coerce.date().default(() => new Date()),
  elc_usuarioInsta: z.string().trim().min(1).max(100),
  elc_observacion: z.string().trim().max(250).default("Sin observaciones"),
  elc_estado: z.string().trim().min(1).max(20).default("ACTIVA")
});

export type AsignarLicenciaEquipoDto = z.infer<
  typeof asignarLicenciaEquipoSchema
>;
