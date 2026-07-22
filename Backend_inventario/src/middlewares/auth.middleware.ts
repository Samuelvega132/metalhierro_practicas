import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserRole, verifyJwt } from "../utils/jwt.handle";
import { AppError } from "../utils/app-error";

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    next(new AppError("Token de autenticacion requerido.", 401));
    return;
  }

  req.user = verifyJwt(token);
  next();
};

export const authorizeRoles =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Usuario no autenticado.", 401));
      return;
    }

    if (!allowedRoles.includes(req.user.usr_role)) {
      next(new AppError("No tiene permisos para ejecutar esta accion.", 403));
      return;
    }

    next();
  };
