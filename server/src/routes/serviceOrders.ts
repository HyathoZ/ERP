import { Router } from "express";
import { ServiceOrderController } from "../controllers/ServiceOrderController";
import { validateSchema } from "../middlewares/validateSchema";
import {
  createServiceOrderSchema,
  updateServiceOrderSchema,
  updateServiceOrderStatusSchema,
} from "../schemas/serviceOrder";

const serviceOrderRoutes = Router();
const serviceOrderController = new ServiceOrderController();

// Listar ordens de serviço
serviceOrderRoutes.get("/", serviceOrderController.list);

// Buscar ordem de serviço por ID
serviceOrderRoutes.get("/:id", serviceOrderController.findById);

// Criar ordem de serviço
serviceOrderRoutes.post("/", validateSchema(createServiceOrderSchema), serviceOrderController.create);

// Atualizar ordem de serviço
serviceOrderRoutes.put("/:id", validateSchema(updateServiceOrderSchema), serviceOrderController.update);

// Atualizar status da ordem de serviço
serviceOrderRoutes.patch(
  "/:id/status",
  validateSchema(updateServiceOrderStatusSchema),
  serviceOrderController.updateStatus
);

// Excluir ordem de serviço
serviceOrderRoutes.delete("/:id", serviceOrderController.delete);

export { serviceOrderRoutes };
