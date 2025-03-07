import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400, public code?: string) {
    super(message);
  }
}

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error(error);

  // Erro da aplicação
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
      code: error.code,
    });
  }

  // Erro de validação do Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Erro de validação",
      errors: error.errors,
    });
  }

  // Erros do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "Registro já existe",
        code: error.code,
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Registro não encontrado",
        code: error.code,
      });
    }
  }

  // Erro interno do servidor
  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
}
