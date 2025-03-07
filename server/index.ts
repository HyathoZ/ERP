import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../src/lib/prisma";
import { Role } from "@prisma/client";
import financialRoutes from "./routes/financial";
import salesRouter from "./routes/sales";
import ordersRouter from "./routes/orders";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-temporaria";

// Aumentar o limite do payload JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Configuração do CORS mais permissiva para desenvolvimento
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
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
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Rotas protegidas
app.use("/api/financial", authenticate, financialRoutes);
app.use("/api/sales", authenticate, salesRouter);
app.use("/api/orders", authenticate, ordersRouter);

// Rotas de autenticação
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "E-mail já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: Role.USER,
      },
    });

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

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
