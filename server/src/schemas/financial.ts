import { z } from "zod";

const financialSchema = {
  type: z.enum(["income", "expense"] as const),
  category: z.string().min(3, "Categoria deve ter no mínimo 3 caracteres"),
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  amount: z.number().min(0, "Valor deve ser maior que zero"),
  dueDate: z.string().datetime("Data de vencimento inválida"),
  status: z.enum(["pending", "paid", "cancelled"] as const).default("pending"),
  paymentMethod: z.string().optional(),
  paymentDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  customerId: z.string().uuid("ID do cliente inválido").optional(),
  orderId: z.string().uuid("ID do pedido inválido").optional(),
};

export const createFinancialSchema = z.object({
  body: z.object(financialSchema),
});

export const updateFinancialSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object(financialSchema).partial(),
});

export const payFinancialSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    paymentDate: z.string().datetime("Data de pagamento inválida"),
    paymentMethod: z.string().min(3, "Método de pagamento deve ter no mínimo 3 caracteres"),
    notes: z.string().optional(),
  }),
});

export const cancelFinancialSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    reason: z.string().min(3, "Motivo deve ter no mínimo 3 caracteres"),
  }),
});
