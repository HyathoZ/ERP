import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";
import { validateSchema } from "../middlewares/validateSchema";
import { createEmployeeSchema, updateEmployeeSchema } from "../schemas/employee";

const employeeRoutes = Router();
const employeeController = new EmployeeController();

// Listar funcionários
employeeRoutes.get("/", employeeController.list);

// Buscar funcionário por ID
employeeRoutes.get("/:id", employeeController.findById);

// Criar funcionário
employeeRoutes.post("/", validateSchema(createEmployeeSchema), employeeController.create);

// Atualizar funcionário
employeeRoutes.put("/:id", validateSchema(updateEmployeeSchema), employeeController.update);

// Excluir funcionário
employeeRoutes.delete("/:id", employeeController.delete);

export { employeeRoutes };
