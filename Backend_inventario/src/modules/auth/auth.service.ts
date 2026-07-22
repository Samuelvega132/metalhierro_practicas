import { prisma } from "../../config/prisma.config";
import { AppError } from "../../utils/app-error";
import { comparePassword } from "../../utils/password.handle";
import { AuthTokenPayload, signJwt, UserRole } from "../../utils/jwt.handle";
import { LoginDto } from "./auth.dto";

const isRole = (value: string): value is UserRole =>
  value === "ADMIN" || value === "PASANTE" || value === "TRABAJADOR";

export class AuthService {
  static async login(dto: LoginDto) {
    const user = await prisma.uSUARIOS.findUnique({
      where: { usr_username: dto.usr_username },
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
            },
            tipoEmpleado: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError("Credenciales invalidas.", 401);
    }

    const passwordMatches = await comparePassword(
      dto.usr_password,
      user.usr_password
    );

    if (!passwordMatches) {
      throw new AppError("Credenciales invalidas.", 401);
    }

    if (!isRole(user.usr_role)) {
      throw new AppError("Rol de usuario no reconocido.", 403);
    }

    const payload: AuthTokenPayload = {
      usr_id: user.usr_id,
      usr_username: user.usr_username,
      usr_role: user.usr_role,
      emp_id: user.emp_id
    };

    const token = signJwt(payload);

    return {
      token,
      user: {
        usr_id: user.usr_id,
        usr_username: user.usr_username,
        usr_role: user.usr_role,
        emp_id: user.emp_id,
        empleado: user.empleado
      }
    };
  }

  static async getMe(usrId: number) {
    const user = await prisma.uSUARIOS.findUnique({
      where: { usr_id: usrId },
      select: {
        usr_id: true,
        usr_username: true,
        usr_role: true,
        emp_id: true,
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
            },
            tipoEmpleado: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError("Usuario no encontrado.", 404);
    }

    return user;
  }
}
