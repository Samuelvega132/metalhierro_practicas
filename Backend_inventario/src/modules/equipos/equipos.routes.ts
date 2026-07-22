import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { EquiposController } from "./equipos.controller";
import {
  asignarEquipoSchema,
  createEquipoSchema,
  devolverEquipoSchema,
  equipoIdParamSchema,
  listEquiposQuerySchema
} from "./equipos.dto";

export const equiposRoutes = Router();

equiposRoutes.use(authenticate);

/**
 * @openapi
 * /api/v1/equipos:
 *   get:
 *     tags:
 *       - Equipos
 *     summary: Lista equipos con paginacion, busqueda y filtros.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por numero de serie.
 *       - in: query
 *         name: tipoId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: marcaId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: empresaId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listado de equipos.
 */
equiposRoutes.get(
  "/",
  authorizeRoles("ADMIN", "PASANTE", "TRABAJADOR"),
  validate({ query: listEquiposQuerySchema }),
  asyncHandler(EquiposController.list)
);

/**
 * @openapi
 * /api/v1/equipos:
 *   post:
 *     tags:
 *       - Equipos
 *     summary: Registra un nuevo equipo informatico.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EquipoRequest'
 *     responses:
 *       201:
 *         description: Equipo registrado.
 *       400:
 *         description: Datos invalidos.
 */
equiposRoutes.post(
  "/",
  authorizeRoles("ADMIN", "PASANTE"),
  validate({ body: createEquipoSchema }),
  asyncHandler(EquiposController.create)
);

/**
 * @openapi
 * /api/v1/equipos/asignar:
 *   post:
 *     tags:
 *       - Equipos
 *     summary: Asigna un equipo a un empleado y cambia su estado a Asignado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsignarEquipoRequest'
 *     responses:
 *       201:
 *         description: Asignacion registrada.
 *       409:
 *         description: El equipo ya tiene asignacion activa.
 */
equiposRoutes.post(
  "/asignar",
  authorizeRoles("ADMIN", "PASANTE"),
  validate({ body: asignarEquipoSchema }),
  asyncHandler(EquiposController.asignar)
);

/**
 * @openapi
 * /api/v1/equipos/devolver:
 *   post:
 *     tags:
 *       - Equipos
 *     summary: Registra la devolucion de un equipo y cambia su estado a Bodega.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DevolverEquipoRequest'
 *     responses:
 *       200:
 *         description: Devolucion registrada.
 *       404:
 *         description: No existe asignacion activa.
 */
equiposRoutes.post(
  "/devolver",
  authorizeRoles("ADMIN", "PASANTE"),
  validate({ body: devolverEquipoSchema }),
  asyncHandler(EquiposController.devolver)
);

/**
 * @openapi
 * /api/v1/equipos/{id}/historial:
 *   get:
 *     tags:
 *       - Equipos
 *     summary: Obtiene el historial completo de custodia de un equipo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial del equipo.
 *       404:
 *         description: Equipo no encontrado.
 */
equiposRoutes.get(
  "/:id/historial",
  authorizeRoles("ADMIN", "PASANTE", "TRABAJADOR"),
  validate({ params: equipoIdParamSchema }),
  asyncHandler(EquiposController.historial)
);
