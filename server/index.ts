import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import "./types/express";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no ambiente");
}

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

// Configurações de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
});
app.use(limiter);

// Configuração do payload
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Log de todas as requisições
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// CORS configurado apenas para ambientes permitidos
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Origin not allowed:", origin);
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Requested-With"],
  })
);

// Middleware de log
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware de autenticação
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
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
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validação
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "A senha deve ter no mínimo 8 caracteres" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ message: "E-mail já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData: Prisma.UserCreateInput = {
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role: Role.USER,
      active: true,
    };

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ user, token });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "E-mail ou senha incorretos" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "E-mail ou senha incorretos" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.get("/api/auth/me", authenticate, async (req: Request, res: Response) => {
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

app.post("/api/auth/logout", (req, res) => {
  return res.json({ success: true });
});

app.put("/api/auth/password/:userId", async (req, res) => {
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

app.put("/api/auth/profile/:userId", async (req, res) => {
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

app.post("/api/auth/reset-password", async (req, res) => {
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Tratamento global de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno do servidor" });
  next(err); // Necessário para o Express saber que o erro foi tratado
});

// Tratamento de rotas não encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Inicialização do servidor
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`[${new Date().toISOString()}] Servidor iniciado em http://${HOST}:${PORT}`);
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
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Recebido SIGINT. Encerrando servidor...");
  process.exit(0);
});
