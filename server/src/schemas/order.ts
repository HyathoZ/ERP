import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid("ID do produto inválido"),
  quantity: z.number().int().min(1, "Quantidade deve ser maior que zero"),
  unitPrice: z.number().min(0, "Preço unitário deve ser maior que zero"),
  discount: z.number().min(0, "Desconto deve ser maior ou igual a zero"),
});

export const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string().uuid("ID do cliente inválido"),
    items: z.array(orderItemSchema).min(1, "Pedido deve ter pelo menos um item"),
    notes: z.string().optional(),
  }),
});

export const updateOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    items: z.array(orderItemSchema).min(1, "Pedido deve ter pelo menos um item"),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    status: z.enum(["pending", "approved", "cancelled", "completed"] as const),
    reason: z.string().optional(),
  }),
});
