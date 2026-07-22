import { z } from "zod";

export const inventarioGeneralQuerySchema = z.object({
  empresaId: z.coerce.number().int().positive().optional()
});

export const licenciasVencimientoQuerySchema = z.object({
  dias: z.coerce.number().int().positive().max(365).default(30)
});

export const movimientosSuministrosQuerySchema = z
  .object({
    fechaDesde: z.coerce.date().optional(),
    fechaHasta: z.coerce.date().optional(),
    sumId: z.coerce.number().int().positive().optional()
  })
  .refine(
    (query) =>
      !query.fechaDesde ||
      !query.fechaHasta ||
      query.fechaDesde <= query.fechaHasta,
    {
      message: "fechaDesde no puede ser mayor a fechaHasta.",
      path: ["fechaDesde"]
    }
  );

export type InventarioGeneralQueryDto = z.infer<
  typeof inventarioGeneralQuerySchema
>;
export type LicenciasVencimientoQueryDto = z.infer<
  typeof licenciasVencimientoQuerySchema
>;
export type MovimientosSuministrosQueryDto = z.infer<
  typeof movimientosSuministrosQuerySchema
>;
