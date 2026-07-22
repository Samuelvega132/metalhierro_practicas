import { Router } from "express";
import { z } from "zod";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { DashboardController } from "./dashboard.controller";

export const dashboardRoutes = Router();

const metricsQuerySchema = z.object({
  empresaId: z.coerce.number().int().positive().optional()
});

/**
 * @openapi
 * /api/v1/dashboard/metrics:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Obtiene metricas globales de inventario, garantias, licencias y suministros.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: empresaId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtra metricas por empresa.
 *     responses:
 *       200:
 *         description: Metricas devueltas correctamente.
 *       403:
 *         description: Rol sin permisos.
 */
dashboardRoutes.get(
  "/metrics",
  authenticate,
  authorizeRoles("ADMIN", "PASANTE"),
  validate({ query: metricsQuerySchema }),
  asyncHandler(DashboardController.metrics)
);
