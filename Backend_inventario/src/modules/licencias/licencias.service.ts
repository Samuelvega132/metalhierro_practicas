import { prisma } from "../../config/prisma.config";
import { AppError } from "../../utils/app-error";
import { AsignarLicenciaEquipoDto } from "./licencias.dto";

export class LicenciasService {
  static async list() {
    return prisma.lICENCIAS.findMany({
      include: {
        software: true,
        equipoLicencias: {
          include: {
            equipo: {
              include: {
                tipoEquipo: true,
                marcaEquipo: true,
                estadoEquipo: true
              }
            }
          }
        }
      },
      orderBy: {
        lcd_fechaVenci: "asc"
      }
    });
  }

  static async asignarEquipo(dto: AsignarLicenciaEquipoDto) {
    return prisma.$transaction(async (tx) => {
      const [licencia, equipo] = await Promise.all([
        tx.lICENCIAS.findUnique({ where: { lcd_id: dto.elc_lcd_id } }),
        tx.eQUIPOS.findUnique({ where: { equ_id: dto.elc_equ_id } })
      ]);

      if (!licencia) {
        throw new AppError("Licencia no encontrada.", 404);
      }

      if (!equipo) {
        throw new AppError("Equipo no encontrado.", 404);
      }

      const asignacionExistente = await tx.eQUIPOLICENCIAS.findFirst({
        where: {
          elc_lcd_id: dto.elc_lcd_id,
          elc_equ_id: dto.elc_equ_id,
          elc_estado: "ACTIVA"
        }
      });

      if (asignacionExistente) {
        throw new AppError("La licencia ya esta activa en este equipo.", 409);
      }

      const licenciasUsadas = await tx.eQUIPOLICENCIAS.count({
        where: {
          elc_lcd_id: dto.elc_lcd_id,
          elc_estado: "ACTIVA"
        }
      });

      if (licenciasUsadas >= licencia.lcd_cantLice) {
        throw new AppError("No hay cupos disponibles para esta licencia.", 409, {
          cantidadLicencias: licencia.lcd_cantLice,
          licenciasUsadas
        });
      }

      return tx.eQUIPOLICENCIAS.create({
        data: {
          elc_lcd_id: dto.elc_lcd_id,
          elc_equ_id: dto.elc_equ_id,
          elc_fechainsta: dto.elc_fechainsta,
          elc_usuarioInsta: dto.elc_usuarioInsta,
          elc_observacion: dto.elc_observacion,
          elc_estado: dto.elc_estado
        },
        include: {
          licencia: {
            include: {
              software: true
            }
          },
          equipo: true
        }
      });
    });
  }
}
