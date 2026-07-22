import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodType } from "zod";

type RequestPart = "body" | "query" | "params";
type ValidationSchemas = Partial<Record<RequestPart, ZodType<unknown>>>;

export const validate =
  (schemas: ValidationSchemas): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    for (const [part, schema] of Object.entries(schemas) as [
      RequestPart,
      ZodType<unknown>
    ][]) {
      const parsed = schema.parse(req[part]);
      req[part] = parsed as typeof req[typeof part];
    }

    next();
  };
