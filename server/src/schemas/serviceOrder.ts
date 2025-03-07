import { z } from "zod";

const serviceOrderItemSchema = z.object({
  productId: z.string().uuid("ID do produto inválido"),
  quantity: z.number().int().min(1, "Quantidade deve ser maior que zero"),
  unitPrice: z.number().min(0, "Preço unitário deve ser maior que zero"),
  discount: z.number().min(0, "Desconto deve ser maior ou igual a zero"),
});

export const createServiceOrderSchema = z.object({
  body: z.object({
    customerId: z.string().uuid("ID do cliente inválido"),
    employeeId: z.string().uuid("ID do funcionário inválido"),
    description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
    problem: z.string().min(10, "Problema deve ter no mínimo 10 caracteres"),
    priority: z.enum(["low", "normal", "high", "urgent"] as const).default("normal"),
    startDate: z.string().datetime("Data de início inválida"),
    items: z.array(serviceOrderItemSchema).optional(),
    notes: z.string().optional(),
  }),
});

export const updateServiceOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    employeeId: z.string().uuid("ID do funcionário inválido").optional(),
    description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").optional(),
    problem: z.string().min(10, "Problema deve ter no mínimo 10 caracteres").optional(),
    solution: z.string().min(10, "Solução deve ter no mínimo 10 caracteres").optional(),
    priority: z.enum(["low", "normal", "high", "urgent"] as const).optional(),
    startDate: z.string().datetime("Data de início inválida").optional(),
    endDate: z.string().datetime("Data de término inválida").optional(),
    items: z.array(serviceOrderItemSchema).optional(),
    notes: z.string().optional(),
  }),
});

export const updateServiceOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    status: z.enum([
      "pending",
      "in_progress",
      "waiting_parts",
      "waiting_approval",
      "approved",
      "completed",
      "cancelled",
    ] as const),
    description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  }),
});
