import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { authRoutes } from "./modules/auth/auth.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { equiposRoutes } from "./modules/equipos/equipos.routes";
import { licenciasRoutes } from "./modules/licencias/licencias.routes";
import { reportesRoutes } from "./modules/reportes/reportes.routes";
import { suministrosRoutes } from "./modules/suministros/suministros.routes";

export const app = express();

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"]
      }
    }
  })
);
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "metalhierro-inventario-api",
    status: "ok"
  });
});

app.get("/api-docs.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/equipos", equiposRoutes);
app.use("/api/v1/suministros", suministrosRoutes);
app.use("/api/v1/licencias", licenciasRoutes);
app.use("/api/v1/reportes", reportesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
