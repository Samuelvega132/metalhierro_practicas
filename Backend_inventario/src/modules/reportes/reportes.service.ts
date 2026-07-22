import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.config";
import {
  InventarioGeneralQueryDto,
  LicenciasVencimientoQueryDto,
  MovimientosSuministrosQueryDto
} from "./reportes.dto";

const addDays = (date: Date, days: number): Date => {
  const clonedDate = new Date(date);
  clonedDate.setDate(clonedDate.getDate() + days);
  return clonedDate;
};

const resolveEstadoVencimiento = (
  fechaVencimiento: Date,
  limiteProximo: Date,
  now: Date
): "VENCIDA" | "POR_VENCER" | "ACTIVA" => {
  if (fechaVencimiento < now) {
    return "VENCIDA";
  }

  if (fechaVencimiento <= limiteProximo) {
    return "POR_VENCER";
  }

  return "ACTIVA";
};

export class ReportesService {
  static async inventarioGeneral(query: InventarioGeneralQueryDto) {
    const where: Prisma.EQUIPOSWhereInput = query.empresaId
      ? {
          asignaciones: {
            some: {
              ase_fechaDev: null,
              empleado: {
                departamento: {
                  local: {
                    epr_id: query.empresaId
                  }
                }
              }
            }
          }
        }
      : {};

    const equipos = await prisma.eQUIPOS.findMany({
      where,
      include: {
        tipoEquipo: true,
        marcaEquipo: {
          include: {
            modelo: true
          }
        },
        estadoEquipo: true,
        proveedor: true,
        asignaciones: {
          where: { ase_fechaDev: null },
          include: {
            empleado: {
              include: {
                departamento: {
                  include: {
                    local: {
                      include: {
                        empresa: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        equ_id: "asc"
      }
    });

    return equipos.map((equipo) => {
      const asignacion = equipo.asignaciones[0] ?? null;
      const empleado = asignacion?.empleado ?? null;
      const departamento = empleado?.departamento ?? null;
      const local = departamento?.local ?? null;
      const empresa = local?.empresa ?? null;

      return {
        empresa: empresa?.epr_nomb ?? "Sin empresa asignada",
        departamento: departamento?.dpt_nomb ?? "Sin departamento asignado",
        empleado: empleado
          ? `${empleado.emp_nomb} ${empleado.emp_ape}`.trim()
          : "Sin custodio activo",
        equipo: {
          equ_id: equipo.equ_id,
          equ_sn: equipo.equ_sn,
          tipo: equipo.tipoEquipo.tpe_nomb,
          marca: equipo.marcaEquipo.mrc_nomb,
          modelo: equipo.marcaEquipo.modelo.mdl_nomb,
          estado: equipo.estadoEquipo.est_nomb,
          proveedor: equipo.proveedor.pvr_nomb,
          garantia: equipo.equ_garantia
        },
        asignacion
      };
    });
  }

  static async licenciasVencimiento(query: LicenciasVencimientoQueryDto) {
    const now = new Date();
    const limiteProximo = addDays(now, query.dias);

    const licencias = await prisma.lICENCIAS.findMany({
      include: {
        software: true,
        equipoLicencias: {
          include: {
            equipo: true
          }
        }
      },
      orderBy: {
        lcd_fechaVenci: "asc"
      }
    });

    return licencias.map((licencia) => ({
      ...licencia,
      estadoVencimiento: resolveEstadoVencimiento(
        licencia.lcd_fechaVenci,
        limiteProximo,
        now
      ),
      diasRestantes: Math.ceil(
        (licencia.lcd_fechaVenci.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    }));
  }

  static async movimientosSuministros(query: MovimientosSuministrosQueryDto) {
    const where: Prisma.TRANSACCIONSUMINISTROSWhereInput = {
      ...(query.sumId ? { sum_id: query.sumId } : {}),
      ...(query.fechaDesde || query.fechaHasta
        ? {
            trs_fecha: {
              ...(query.fechaDesde ? { gte: query.fechaDesde } : {}),
              ...(query.fechaHasta ? { lte: query.fechaHasta } : {})
            }
          }
        : {})
    };

    return prisma.tRANSACCIONSUMINISTROS.findMany({
      where,
      include: {
        suministro: {
          include: {
            proveedor: true
          }
        },
        empleado: {
          include: {
            departamento: {
              include: {
                local: {
                  include: {
                    empresa: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        trs_fecha: "desc"
      }
    });
  }
}
