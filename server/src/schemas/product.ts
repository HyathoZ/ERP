import { z } from "zod";

const productSchema = {
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().min(0, "Preço deve ser maior que zero"),
  cost: z.number().min(0, "Custo deve ser maior que zero"),
  stock: z.number().int().min(0, "Estoque deve ser maior ou igual a zero"),
  minStock: z.number().int().min(0, "Estoque mínimo deve ser maior ou igual a zero"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  status: z.enum(["active", "inactive"] as const).default("active"),
};

export const createProductSchema = z.object({
  body: z.object(productSchema),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object(productSchema).partial(),
});

export const adjustStockSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    quantity: z.number().int("Quantidade deve ser um número inteiro"),
    type: z.enum(["add", "remove"] as const),
    reason: z.string().min(3, "Motivo deve ter no mínimo 3 caracteres"),
  }),
});
