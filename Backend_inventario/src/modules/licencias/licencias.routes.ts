import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { LicenciasController } from "./licencias.controller";
import { asignarLicenciaEquipoSchema } from "./licencias.dto";

export const licenciasRoutes = Router();

licenciasRoutes.use(authenticate, authorizeRoles("ADMIN", "PASANTE"));

/**
 * @openapi
 * /api/v1/licencias:
 *   get:
 *     tags:
 *       - Licencias
 *     summary: Lista licencias vinculadas con su software correspondiente.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de licencias.
 */
licenciasRoutes.get("/", asyncHandler(LicenciasController.list));

/**
 * @openapi
 * /api/v1/licencias/asignar-equipo:
 *   post:
 *     tags:
 *       - Licencias
 *     summary: Vincula una licencia a un equipo especifico.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsignarLicenciaEquipoRequest'
 *     responses:
 *       201:
 *         description: Licencia asignada al equipo.
 *       409:
 *         description: Sin cupos disponibles o asignacion duplicada.
 */
licenciasRoutes.post(
  "/asignar-equipo",
  validate({ body: asignarLicenciaEquipoSchema }),
  asyncHandler(LicenciasController.asignarEquipo)
);
