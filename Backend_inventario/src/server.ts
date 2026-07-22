import { app } from "./app";
import { env } from "./config/env.config";
import { prisma } from "./config/prisma.config";

const server = app.listen(env.PORT, () => {
  console.log(`API Metalhierro escuchando en http://localhost:${env.PORT}`);
});

const shutdown = async (signal: string): Promise<void> => {
  console.log(`Recibida senal ${signal}. Cerrando servidor...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
