import { z } from "zod";

export const transaccionSuministroSchema = z.object({
  sum_id: z.number().int().positive(),
  trs_tipotransa: z.enum(["INGRESO", "EGRESO"]),
  trs_cant: z.number().int().positive(),
  trs_fecha: z.coerce.date().default(() => new Date()),
  trs_emp_id: z.number().int().positive(),
  trs_nota: z.string().trim().min(1).max(250)
});

export type TransaccionSuministroDto = z.infer<
  typeof transaccionSuministroSchema
>;
