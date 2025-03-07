import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "./errorHandler";

interface TokenPayload {
  sub: string;
  role: string;
  companyId: string;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
        companyId: string;
      };
    }
  }
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não fornecido", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as TokenPayload;

    req.user = {
      id: decoded.sub,
      role: decoded.role,
      companyId: decoded.companyId,
    };

    return next();
  } catch {
    throw new AppError("Token inválido", 401);
  }
}
