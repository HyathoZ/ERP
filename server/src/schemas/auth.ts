import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    company: z.object({
      name: z.string().min(3, "Nome da empresa deve ter no mínimo 3 caracteres"),
      document: z.string().min(14, "CNPJ inválido"),
      email: z.string().email("Email da empresa inválido"),
      phone: z.string().min(10, "Telefone inválido"),
      address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
      city: z.string().min(3, "Cidade deve ter no mínimo 3 caracteres"),
      state: z.string().length(2, "Estado deve ter 2 caracteres"),
      zipCode: z.string().length(8, "CEP deve ter 8 caracteres"),
    }),
  }),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string(),
      password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Senhas não conferem",
      path: ["confirmPassword"],
    }),
});
