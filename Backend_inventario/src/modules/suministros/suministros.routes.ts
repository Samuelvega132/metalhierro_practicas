import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { SuministrosController } from "./suministros.controller";
import { transaccionSuministroSchema } from "./suministros.dto";

export const suministrosRoutes = Router();

suministrosRoutes.use(authenticate, authorizeRoles("ADMIN", "PASANTE"));

/**
 * @openapi
 * /api/v1/suministros:
 *   get:
 *     tags:
 *       - Suministros
 *     summary: Consulta catalogo de suministros y stock disponible.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de suministros.
 */
suministrosRoutes.get("/", asyncHandler(SuministrosController.list));

/**
 * @openapi
 * /api/v1/suministros/transaccion:
 *   post:
 *     tags:
 *       - Suministros
 *     summary: Registra ingreso o egreso de suministros y actualiza stock.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransaccionSuministroRequest'
 *     responses:
 *       201:
 *         description: Transaccion registrada.
 *       409:
 *         description: Stock insuficiente para egreso.
 */
suministrosRoutes.post(
  "/transaccion",
  validate({ body: transaccionSuministroSchema }),
  asyncHandler(SuministrosController.registrarTransaccion)
);
