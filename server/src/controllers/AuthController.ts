import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      throw new AppError("Email ou senha incorretos", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email ou senha incorretos", 401);
    }

    const token = sign(
      {
        sub: user.id,
        role: user.role,
        companyId: user.companyId,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = sign(
      {
        sub: user.id,
      },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: {
          id: user.company.id,
          name: user.company.name,
        },
      },
      token,
      refreshToken,
    });
  }

  async register(req: Request, res: Response) {
    const { name, email, password, company } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError("Email já cadastrado");
    }

    const companyExists = await prisma.company.findUnique({
      where: { document: company.document },
    });

    if (companyExists) {
      throw new AppError("CNPJ já cadastrado");
    }

    const hashedPassword = await hash(password, 10);

    const newCompany = await prisma.company.create({
      data: {
        ...company,
        users: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: "admin",
          },
        },
      },
      include: {
        users: true,
      },
    });

    const user = newCompany.users[0];

    const token = sign(
      {
        sub: user.id,
        role: user.role,
        companyId: newCompany.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = sign(
      {
        sub: user.id,
      },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: {
          id: newCompany.id,
          name: newCompany.name,
        },
      },
      token,
      refreshToken,
    });
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Retornamos 200 mesmo se o usuário não existir por segurança
      return res.json({
        message: "Se o email existir, você receberá instruções para redefinir sua senha",
      });
    }

    const resetToken = sign(
      {
        sub: user.id,
        type: "reset_password",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    // TODO: Enviar email com o token
    console.log("Reset token:", resetToken);

    return res.json({
      message: "Se o email existir, você receberá instruções para redefinir sua senha",
    });
  }

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    try {
      const decoded = sign(token, process.env.JWT_SECRET!) as {
        sub: string;
        type: string;
      };

      if (decoded.type !== "reset_password") {
        throw new AppError("Token inválido", 401);
      }

      const hashedPassword = await hash(password, 10);

      await prisma.user.update({
        where: { id: decoded.sub },
        data: { password: hashedPassword },
      });

      return res.json({
        message: "Senha alterada com sucesso",
      });
    } catch {
      throw new AppError("Token inválido ou expirado", 401);
    }
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token não fornecido", 401);
    }

    try {
      const decoded = sign(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        sub: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        include: { company: true },
      });

      if (!user) {
        throw new AppError("Usuário não encontrado", 401);
      }

      const token = sign(
        {
          sub: user.id,
          role: user.role,
          companyId: user.companyId,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      const newRefreshToken = sign(
        {
          sub: user.id,
        },
        process.env.JWT_REFRESH_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        token,
        refreshToken: newRefreshToken,
      });
    } catch {
      throw new AppError("Refresh token inválido", 401);
    }
  }
}
