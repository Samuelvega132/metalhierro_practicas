import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.config";

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentacion de la API Backend Metalhierro",
      version: "1.0.0",
      description:
        "Interfaz grafica para probar los endpoints del sistema de inventario, auditoria y reportes de TI."
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Servidor local"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" }
          }
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Datos de entrada invalidos." }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["usr_username", "usr_password"],
          properties: {
            usr_username: { type: "string", example: "admin" },
            usr_password: { type: "string", example: "Password123" }
          }
        },
        EquipoRequest: {
          type: "object",
          required: [
            "equ_tpe_id",
            "equ_mrc_id",
            "equ_sn",
            "equ_especificacion",
            "equ_fechaComp",
            "equ_pu",
            "pvr_id",
            "equ_numFact",
            "equ_numOC",
            "equ_garantia",
            "equ_est_id"
          ],
          properties: {
            equ_tpe_id: { type: "integer", example: 1 },
            equ_mrc_id: { type: "integer", example: 1 },
            equ_sn: { type: "string", example: "MH-LAP-0001" },
            equ_especificacion: { type: "string", example: "Core i7, 16GB RAM, SSD 512GB" },
            equ_fechaComp: { type: "string", format: "date-time" },
            equ_pu: { type: "number", example: 850.5 },
            pvr_id: { type: "integer", example: 1 },
            equ_numFact: { type: "string", example: "FAC-001" },
            equ_numOC: { type: "string", example: "OC-001" },
            equ_garantia: { type: "string", format: "date-time" },
            equ_est_id: { type: "integer", example: 1 }
          }
        },
        AsignarEquipoRequest: {
          type: "object",
          required: ["ase_equ_id", "ase_emp_id", "ase_numActEntr"],
          properties: {
            ase_equ_id: { type: "integer", example: 1 },
            ase_emp_id: { type: "integer", example: 1 },
            ase_fechaAsig: { type: "string", format: "date-time" },
            ase_numActEntr: { type: "string", example: "ACT-ENT-001" }
          }
        },
        DevolverEquipoRequest: {
          type: "object",
          required: ["ase_equ_id"],
          properties: {
            ase_equ_id: { type: "integer", example: 1 },
            ase_fechaDev: { type: "string", format: "date-time" }
          }
        },
        TransaccionSuministroRequest: {
          type: "object",
          required: ["sum_id", "trs_tipotransa", "trs_cant", "trs_emp_id", "trs_nota"],
          properties: {
            sum_id: { type: "integer", example: 1 },
            trs_tipotransa: { type: "string", enum: ["INGRESO", "EGRESO"] },
            trs_cant: { type: "integer", example: 2 },
            trs_fecha: { type: "string", format: "date-time" },
            trs_emp_id: { type: "integer", example: 1 },
            trs_nota: { type: "string", example: "Entrega para mantenimiento" }
          }
        },
        AsignarLicenciaEquipoRequest: {
          type: "object",
          required: ["elc_lcd_id", "elc_equ_id", "elc_usuarioInsta"],
          properties: {
            elc_lcd_id: { type: "integer", example: 1 },
            elc_equ_id: { type: "integer", example: 1 },
            elc_fechainsta: { type: "string", format: "date-time" },
            elc_usuarioInsta: { type: "string", example: "sistemas" },
            elc_observacion: { type: "string", example: "Instalacion inicial" },
            elc_estado: { type: "string", example: "ACTIVA" }
          }
        }
      }
    }
  },
  apis: ["./src/modules/**/*.routes.ts"]
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
