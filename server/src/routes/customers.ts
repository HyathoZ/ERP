import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { validateSchema } from "../middlewares/validateSchema";
import { createCustomerSchema, updateCustomerSchema } from "../schemas/customer";

const customerRoutes = Router();
const customerController = new CustomerController();

// Listar clientes
customerRoutes.get("/", customerController.list);

// Buscar cliente por ID
customerRoutes.get("/:id", customerController.findById);

// Criar cliente
customerRoutes.post("/", validateSchema(createCustomerSchema), customerController.create);

// Atualizar cliente
customerRoutes.put("/:id", validateSchema(updateCustomerSchema), customerController.update);

// Excluir cliente
customerRoutes.delete("/:id", customerController.delete);

export { customerRoutes };
