import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { router } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { prisma } from "./lib/prisma";

const app = express();

// Middlewares
app.use(helmet()); // Segurança
app.use(compression()); // Compressão de resposta
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(requestLogger);

// Rotas
app.use("/api", router);

// Tratamento de erros
app.use(errorHandler);

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Conexão com o banco
prisma
  .$connect()
  .then(() => {
    console.log("📦 Conectado ao banco de dados");
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  });

export { app };
