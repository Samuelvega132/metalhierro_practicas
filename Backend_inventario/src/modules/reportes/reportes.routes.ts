import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { ReportesController } from "./reportes.controller";
import {
  inventarioGeneralQuerySchema,
  licenciasVencimientoQuerySchema,
  movimientosSuministrosQuerySchema
} from "./reportes.dto";

export const reportesRoutes = Router();

reportesRoutes.use(authenticate, authorizeRoles("ADMIN", "PASANTE"));

/**
 * @openapi
 * /api/v1/reportes/inventario-general:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Consolidado de activos por empresa, departamento y empleado asignado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: empresaId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte de inventario general.
 */
reportesRoutes.get(
  "/inventario-general",
  validate({ query: inventarioGeneralQuerySchema }),
  asyncHandler(ReportesController.inventarioGeneral)
);

/**
 * @openapi
 * /api/v1/reportes/licencias-vencimiento:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Reporte de licencias activas, por vencer y vencidas.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dias
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Ventana de dias para considerar una licencia por vencer.
 *     responses:
 *       200:
 *         description: Reporte de licencias por vencimiento.
 */
reportesRoutes.get(
  "/licencias-vencimiento",
  validate({ query: licenciasVencimientoQuerySchema }),
  asyncHandler(ReportesController.licenciasVencimiento)
);

/**
 * @openapi
 * /api/v1/reportes/movimientos-suministros:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Historial de entradas y salidas de suministros por rango de fechas.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: sumId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movimientos de suministros.
 */
reportesRoutes.get(
  "/movimientos-suministros",
  validate({ query: movimientosSuministrosQuerySchema }),
  asyncHandler(ReportesController.movimientosSuministros)
);
