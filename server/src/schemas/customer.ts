import { z } from "zod";

const customerSchema = {
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  document: z.string().min(11, "CPF/CNPJ inválido"),
  type: z.enum(["individual", "company"] as const),
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  city: z.string().min(3, "Cidade deve ter no mínimo 3 caracteres"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().length(8, "CEP deve ter 8 caracteres"),
  status: z.enum(["active", "inactive"] as const).default("active"),
};

export const createCustomerSchema = z.object({
  body: z.object(customerSchema),
});

export const updateCustomerSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object(customerSchema).partial(),
});
