import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { AuthController } from "./auth.controller";
import { loginSchema } from "./auth.dto";

export const authRoutes = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inicia sesion y devuelve un JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Credenciales validas.
 *       401:
 *         description: Credenciales invalidas.
 */
authRoutes.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(AuthController.login)
);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Obtiene los datos del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual.
 *       401:
 *         description: Token requerido, invalido o expirado.
 */
authRoutes.get("/me", authenticate, asyncHandler(AuthController.me));
