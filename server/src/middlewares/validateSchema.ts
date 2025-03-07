import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export function validateSchema(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Erro de validação",
          errors: error.errors,
        });
      }

      return next(error);
    }
  };
}
