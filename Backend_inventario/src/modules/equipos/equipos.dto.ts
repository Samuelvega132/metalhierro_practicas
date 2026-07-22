import { z } from "zod";

export const equipoIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const listEquiposQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(100).optional(),
  tipoId: z.coerce.number().int().positive().optional(),
  marcaId: z.coerce.number().int().positive().optional(),
  empresaId: z.coerce.number().int().positive().optional()
});

export const createEquipoSchema = z.object({
  equ_tpe_id: z.number().int().positive(),
  equ_mrc_id: z.number().int().positive(),
  equ_sn: z.string().trim().min(1).max(100),
  equ_especificacion: z.string().trim().min(1),
  equ_fechaComp: z.coerce.date(),
  equ_pu: z.coerce.number().nonnegative(),
  pvr_id: z.number().int().positive(),
  equ_numFact: z.string().trim().min(1).max(50),
  equ_numOC: z.string().trim().min(1).max(50),
  equ_garantia: z.coerce.date(),
  equ_est_id: z.number().int().positive()
});

export const asignarEquipoSchema = z.object({
  ase_equ_id: z.number().int().positive(),
  ase_emp_id: z.number().int().positive(),
  ase_fechaAsig: z.coerce.date().default(() => new Date()),
  ase_numActEntr: z.string().trim().min(1).max(50)
});

export const devolverEquipoSchema = z.object({
  ase_equ_id: z.number().int().positive(),
  ase_fechaDev: z.coerce.date().default(() => new Date())
});

export type EquipoIdParamDto = z.infer<typeof equipoIdParamSchema>;
export type ListEquiposQueryDto = z.infer<typeof listEquiposQuerySchema>;
export type CreateEquipoDto = z.infer<typeof createEquipoSchema>;
export type AsignarEquipoDto = z.infer<typeof asignarEquipoSchema>;
export type DevolverEquipoDto = z.infer<typeof devolverEquipoSchema>;
