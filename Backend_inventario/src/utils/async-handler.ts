import { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Adaptador pequeno para que los errores async lleguen al middleware global.
export const asyncHandler =
  (controller: AsyncController) =>
  (req: Request, res: Response, next: NextFunction): void => {
    void controller(req, res, next).catch(next);
  };
