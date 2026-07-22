import { Prisma } from "@prisma/client";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";
import { env } from "../config/env.config";

interface ErrorBody {
  success: false;
  message: string;
  details?: unknown;
  stack?: string;
}

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
};

const mapPrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): AppError => {
  if (error.code === "P2002") {
    return new AppError("Registro duplicado en un campo unico.", 409, error.meta);
  }

  if (error.code === "P2003") {
    return new AppError("Referencia invalida a un registro relacionado.", 400, error.meta);
  }

  if (error.code === "P2025") {
    return new AppError("Registro no encontrado.", 404, error.meta);
  }

  return new AppError("Error de base de datos.", 500, { code: error.code });
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let handledError: AppError;

  if (error instanceof AppError) {
    handledError = error;
  } else if (error instanceof ZodError) {
    handledError = new AppError("Datos de entrada invalidos.", 400, error.flatten());
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    handledError = mapPrismaError(error);
  } else if (error instanceof Error) {
    handledError = new AppError(error.message, 500);
  } else {
    handledError = new AppError("Error interno del servidor.", 500);
  }

  const body: ErrorBody = {
    success: false,
    message: handledError.message,
    details: handledError.details
  };

  if (env.NODE_ENV !== "production") {
    body.stack = handledError.stack;
  }

  res.status(handledError.statusCode).json(body);
};
