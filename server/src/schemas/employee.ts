import { z } from "zod";

const employeeSchema = {
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  document: z.string().min(11, "CPF inválido"),
  email: z.string().email("Email inválido").optional().nullable(),
  phone: z.string().min(10, "Telefone inválido").optional().nullable(),
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  city: z.string().min(3, "Cidade deve ter no mínimo 3 caracteres"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().length(8, "CEP deve ter 8 caracteres"),
  birthDate: z.string().datetime("Data de nascimento inválida"),
  hireDate: z.string().datetime("Data de contratação inválida"),
  roleId: z.string().uuid("ID do cargo inválido"),
  userId: z.string().uuid("ID do usuário inválido").optional().nullable(),
  status: z.enum(["active", "inactive"] as const).default("active"),
};

export const createEmployeeSchema = z.object({
  body: z.object(employeeSchema),
});

export const updateEmployeeSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object(employeeSchema).partial(),
});
