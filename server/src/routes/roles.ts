import { Router } from "express";
import { RoleController } from "../controllers/RoleController";
import { validateSchema } from "../middlewares/validateSchema";
import { createRoleSchema, updateRoleSchema } from "../schemas/role";

const roleRoutes = Router();
const roleController = new RoleController();

// Listar cargos
roleRoutes.get("/", roleController.list);

// Buscar cargo por ID
roleRoutes.get("/:id", roleController.findById);

// Criar cargo
roleRoutes.post("/", validateSchema(createRoleSchema), roleController.create);

// Atualizar cargo
roleRoutes.put("/:id", validateSchema(updateRoleSchema), roleController.update);

// Excluir cargo
roleRoutes.delete("/:id", roleController.delete);

export { roleRoutes };
