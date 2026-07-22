import { PrismaClient } from "@prisma/client";
import { env } from "./env.config";

const logLevels =
  env.NODE_ENV === "production"
    ? ["error"]
    : ["query", "info", "warn", "error"];

// Un unico cliente evita crear multiples pools de conexion contra SQL Server.
export const prisma = new PrismaClient({
  log: logLevels as ("query" | "info" | "warn" | "error")[]
});
