import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.config";

const addDays = (date: Date, days: number): Date => {
  const clonedDate = new Date(date);
  clonedDate.setDate(clonedDate.getDate() + days);
  return clonedDate;
};

const buildEquipoEmpresaWhere = (
  empresaId?: number
): Prisma.EQUIPOSWhereInput => {
  if (!empresaId) {
    return {};
  }

  return {
    asignaciones: {
      some: {
        ase_fechaDev: null,
        empleado: {
          departamento: {
            local: {
              epr_id: empresaId
            }
          }
        }
      }
    }
  };
};

const buildLicenciaEmpresaWhere = (
  empresaId?: number
): Prisma.LICENCIASWhereInput => {
  if (!empresaId) {
    return {};
  }

  return {
    equipoLicencias: {
      some: {
        equipo: {
          asignaciones: {
            some: {
              ase_fechaDev: null,
              empleado: {
                departamento: {
                  local: {
                    epr_id: empresaId
                  }
                }
              }
            }
          }
        }
      }
    }
  };
};

const getGroupCount = (
  count: true | Record<string, number | undefined> | undefined
): number => {
  if (!count || count === true) {
    return 0;
  }

  return count._all ?? 0;
};

export class DashboardService {
  static async getMetrics(empresaId?: number) {
    const now = new Date();
    const in30Days = addDays(now, 30);
    const in60Days = addDays(now, 60);
    const equipoWhere = buildEquipoEmpresaWhere(empresaId);
    const licenciaWhere = buildLicenciaEmpresaWhere(empresaId);

    const [
      totalEquipos,
      equiposPorEstado,
      estados,
      garantias30,
      garantias60,
      licenciasVencidas,
      licenciasPorVencer,
      stockCritico
    ] = await prisma.$transaction([
      prisma.eQUIPOS.count({ where: equipoWhere }),
      prisma.eQUIPOS.groupBy({
        by: ["equ_est_id"],
        where: equipoWhere,
        orderBy: { equ_est_id: "asc" },
        _count: { _all: true }
      }),
      prisma.eSTADOEQUIPOS.findMany({
        select: { est_id: true, est_nomb: true }
      }),
      prisma.eQUIPOS.count({
        where: {
          ...equipoWhere,
          equ_garantia: { gte: now, lte: in30Days }
        }
      }),
      prisma.eQUIPOS.count({
        where: {
          ...equipoWhere,
          equ_garantia: { gte: now, lte: in60Days }
        }
      }),
      prisma.lICENCIAS.count({
        where: {
          ...licenciaWhere,
          lcd_fechaVenci: { lt: now }
        }
      }),
      prisma.lICENCIAS.count({
        where: {
          ...licenciaWhere,
          lcd_fechaVenci: { gte: now, lte: in30Days }
        }
      }),
      prisma.sUMINISTROS.count({
        where: { sum_cant: { lt: 5 } }
      })
    ]);

    const estadoPorId = new Map(
      estados.map((estado) => [estado.est_id, estado.est_nomb])
    );

    const desgloseEstados = equiposPorEstado.reduce<Record<string, number>>(
      (accumulator, row) => {
        const estadoNombre = estadoPorId.get(row.equ_est_id) ?? "Sin estado";
        accumulator[estadoNombre] = getGroupCount(row._count);
        return accumulator;
      },
      {
        Bodega: 0,
        Asignado: 0,
        Reparación: 0,
        Baja: 0
      }
    );

    return {
      empresaId: empresaId ?? null,
      equipos: {
        total: totalEquipos,
        porEstado: desgloseEstados
      },
      garantias: {
        porVencer30Dias: garantias30,
        porVencer60Dias: garantias60
      },
      licencias: {
        vencidas: licenciasVencidas,
        porVencer30Dias: licenciasPorVencer
      },
      suministros: {
        stockCritico: stockCritico,
        criterio: "sum_cant < 5"
      }
    };
  }
}
