import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.config";
import { AppError } from "./app-error";

export type UserRole = "ADMIN" | "PASANTE" | "TRABAJADOR";

export interface AuthTokenPayload {
  usr_id: number;
  usr_username: string;
  usr_role: UserRole;
  emp_id: number | null;
}

const isRole = (value: unknown): value is UserRole =>
  value === "ADMIN" || value === "PASANTE" || value === "TRABAJADOR";

const isAuthTokenPayload = (value: unknown): value is AuthTokenPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.usr_id === "number" &&
    typeof candidate.usr_username === "string" &&
    isRole(candidate.usr_role) &&
    (typeof candidate.emp_id === "number" || candidate.emp_id === null)
  );
};

export const signJwt = (payload: AuthTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyJwt = (token: string): AuthTokenPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!isAuthTokenPayload(decoded)) {
      throw new AppError("Token con estructura invalida.", 401);
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Token invalido o expirado.", 401);
  }
};
