import { prisma } from "../../config/prisma.config";
import { AppError } from "../../utils/app-error";
import { TransaccionSuministroDto } from "./suministros.dto";

export class SuministrosService {
  static async list() {
    return prisma.sUMINISTROS.findMany({
      include: {
        proveedor: true
      },
      orderBy: {
        sum_nomb: "asc"
      }
    });
  }

  static async registrarTransaccion(dto: TransaccionSuministroDto) {
    return prisma.$transaction(async (tx) => {
      const [suministro, empleado] = await Promise.all([
        tx.sUMINISTROS.findUnique({ where: { sum_id: dto.sum_id } }),
        tx.eMPLEADOS.findUnique({ where: { emp_id: dto.trs_emp_id } })
      ]);

      if (!suministro) {
        throw new AppError("Suministro no encontrado.", 404);
      }

      if (!empleado) {
        throw new AppError("Empleado no encontrado.", 404);
      }

      if (dto.trs_tipotransa === "EGRESO" && suministro.sum_cant < dto.trs_cant) {
        throw new AppError("Stock insuficiente para registrar el egreso.", 409, {
          stockDisponible: suministro.sum_cant,
          cantidadSolicitada: dto.trs_cant
        });
      }

      const transaccion = await tx.tRANSACCIONSUMINISTROS.create({
        data: {
          sum_id: dto.sum_id,
          trs_tipotransa: dto.trs_tipotransa,
          trs_cant: dto.trs_cant,
          trs_fecha: dto.trs_fecha,
          trs_emp_id: dto.trs_emp_id,
          trs_nota: dto.trs_nota
        },
        include: {
          suministro: true,
          empleado: true
        }
      });

      const stockOperation =
        dto.trs_tipotransa === "INGRESO"
          ? { increment: dto.trs_cant }
          : { decrement: dto.trs_cant };

      const stockActualizado = await tx.sUMINISTROS.update({
        where: { sum_id: dto.sum_id },
        data: {
          sum_cant: stockOperation
        }
      });

      return {
        transaccion,
        stockActualizado
      };
    });
  }
}
