import { z } from "zod";

const roleSchema = {
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"] as const).default("active"),
};

export const createRoleSchema = z.object({
  body: z.object(roleSchema),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object(roleSchema).partial(),
});
