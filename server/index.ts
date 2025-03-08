import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import "dotenv/config";

// Tipos personalizados
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role: Role;
    }

    interface Request {
      user?: User;
    }
  }
}

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no ambiente");
}

const app = express();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Configurações de segurança
app.use(helmet());

// Configuração do CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
});
app.use(limiter);

// Configuração do payload
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Middleware de log
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Middleware de autenticação
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!dbUser) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...user } = dbUser;
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token inválido" });
    }
    return res.status(500).json({ message: "Erro ao autenticar usuário" });
  }
};

// Rotas de autenticação
router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

router.get("/auth/me", authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    return res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.post("/auth/logout", (req, res) => {
  return res.json({ success: true });
});

router.put("/auth/password/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.put("/auth/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: "E-mail já está em uso" });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // TODO: Implementar lógica de envio de email
    // Por enquanto, apenas retorna sucesso
    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao solicitar reset de senha:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Registra o router com o prefixo /api
app.use("/api", router);

// Inicialização do servidor
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "localhost";

const server = app.listen(PORT, HOST, () => {
  console.log(
    `[${new Date().toISOString()}] Servidor iniciado em http://${HOST}:${PORT}`
  );
  console.log(`Origens permitidas: ${allowedOrigins.join(", ")}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});

// Tratamento de erros do servidor
server.on("error", (error: NodeJS.ErrnoException) => {
  console.error("Erro no servidor:", error);
  if (error.code === "EADDRINUSE") {
    console.error(`Porta ${PORT} já está em uso. Tente outra porta.`);
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Recebido SIGTERM. Encerrando servidor...");
  server.close(() => {
    prisma.$disconnect();
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("Recebido SIGINT. Encerrando servidor...");
  server.close(() => {
    prisma.$disconnect();
    process.exit(0);
  });
});
