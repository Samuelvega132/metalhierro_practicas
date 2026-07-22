import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.config";
import { AppError } from "../../utils/app-error";
import {
  AsignarEquipoDto,
  CreateEquipoDto,
  DevolverEquipoDto,
  ListEquiposQueryDto
} from "./equipos.dto";

const equipoInclude = {
  tipoEquipo: true,
  marcaEquipo: {
    include: {
      modelo: true
    }
  },
  proveedor: true,
  estadoEquipo: true,
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
} satisfies Prisma.EQUIPOSInclude;

const buildEmpresaEquipoFilter = (empresaId?: number): Prisma.EQUIPOSWhereInput =>
  empresaId
    ? {
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
    : {};

export class EquiposService {
  static async list(query: ListEquiposQueryDto) {
    const skip = (query.page - 1) * query.limit;

    const where: Prisma.EQUIPOSWhereInput = {
      ...buildEmpresaEquipoFilter(query.empresaId),
      ...(query.search ? { equ_sn: { contains: query.search } } : {}),
      ...(query.tipoId ? { equ_tpe_id: query.tipoId } : {}),
      ...(query.marcaId ? { equ_mrc_id: query.marcaId } : {})
    };

    const [total, equipos] = await prisma.$transaction([
      prisma.eQUIPOS.count({ where }),
      prisma.eQUIPOS.findMany({
        where,
        include: equipoInclude,
        orderBy: { equ_id: "desc" },
        skip,
        take: query.limit
      })
    ]);

    return {
      items: equipos,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    };
  }

  static async create(dto: CreateEquipoDto) {
    return prisma.eQUIPOS.create({
      data: {
        equ_tpe_id: dto.equ_tpe_id,
        equ_mrc_id: dto.equ_mrc_id,
        equ_sn: dto.equ_sn,
        equ_especificacion: dto.equ_especificacion,
        equ_fechaComp: dto.equ_fechaComp,
        equ_pu: new Prisma.Decimal(dto.equ_pu),
        pvr_id: dto.pvr_id,
        equ_numFact: dto.equ_numFact,
        equ_numOC: dto.equ_numOC,
        equ_garantia: dto.equ_garantia,
        equ_est_id: dto.equ_est_id
      },
      include: equipoInclude
    });
  }

  static async asignar(dto: AsignarEquipoDto) {
    return prisma.$transaction(async (tx) => {
      const [equipo, empleado, estadoAsignado] = await Promise.all([
        tx.eQUIPOS.findUnique({ where: { equ_id: dto.ase_equ_id } }),
        tx.eMPLEADOS.findUnique({ where: { emp_id: dto.ase_emp_id } }),
        tx.eSTADOEQUIPOS.findFirst({ where: { est_nomb: "Asignado" } })
      ]);

      if (!equipo) {
        throw new AppError("Equipo no encontrado.", 404);
      }

      if (!empleado) {
        throw new AppError("Empleado no encontrado.", 404);
      }

      if (!estadoAsignado) {
        throw new AppError("No existe el estado de equipo 'Asignado'.", 500);
      }

      const asignacionActiva = await tx.aSIGNACIONEQUIPOS.findFirst({
        where: {
          ase_equ_id: dto.ase_equ_id,
          ase_fechaDev: null
        }
      });

      if (asignacionActiva) {
        throw new AppError("El equipo ya tiene una asignacion activa.", 409);
      }

      const asignacion = await tx.aSIGNACIONEQUIPOS.create({
        data: {
          ase_equ_id: dto.ase_equ_id,
          ase_emp_id: dto.ase_emp_id,
          ase_fechaAsig: dto.ase_fechaAsig,
          ase_numActEntr: dto.ase_numActEntr
        },
        include: {
          equipo: true,
          empleado: true
        }
      });

      await tx.eQUIPOS.update({
        where: { equ_id: dto.ase_equ_id },
        data: { equ_est_id: estadoAsignado.est_id }
      });

      return asignacion;
    });
  }

  static async devolver(dto: DevolverEquipoDto) {
    return prisma.$transaction(async (tx) => {
      const [asignacionActiva, estadoBodega] = await Promise.all([
        tx.aSIGNACIONEQUIPOS.findFirst({
          where: {
            ase_equ_id: dto.ase_equ_id,
            ase_fechaDev: null
          }
        }),
        tx.eSTADOEQUIPOS.findFirst({ where: { est_nomb: "Bodega" } })
      ]);

      if (!asignacionActiva) {
        throw new AppError("No existe una asignacion activa para este equipo.", 404);
      }

      if (!estadoBodega) {
        throw new AppError("No existe el estado de equipo 'Bodega'.", 500);
      }

      const asignacion = await tx.aSIGNACIONEQUIPOS.update({
        where: { ase_id: asignacionActiva.ase_id },
        data: { ase_fechaDev: dto.ase_fechaDev },
        include: {
          equipo: true,
          empleado: true
        }
      });

      await tx.eQUIPOS.update({
        where: { equ_id: dto.ase_equ_id },
        data: { equ_est_id: estadoBodega.est_id }
      });

      return asignacion;
    });
  }

  static async historial(equipoId: number) {
    const equipo = await prisma.eQUIPOS.findUnique({
      where: { equ_id: equipoId },
      select: { equ_id: true, equ_sn: true }
    });

    if (!equipo) {
      throw new AppError("Equipo no encontrado.", 404);
    }

    const historial = await prisma.aSIGNACIONEQUIPOS.findMany({
      where: { ase_equ_id: equipoId },
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
      },
      orderBy: { ase_fechaAsig: "desc" }
    });

    return {
      equipo,
      historial
    };
  }
}
