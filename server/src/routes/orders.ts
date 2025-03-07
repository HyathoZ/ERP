import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { validateSchema } from "../middlewares/validateSchema";
import { createOrderSchema, updateOrderSchema, updateOrderStatusSchema } from "../schemas/order";

const orderRoutes = Router();
const orderController = new OrderController();

// Listar pedidos
orderRoutes.get("/", orderController.list);

// Buscar pedido por ID
orderRoutes.get("/:id", orderController.findById);

// Criar pedido
orderRoutes.post("/", validateSchema(createOrderSchema), orderController.create);

// Atualizar pedido
orderRoutes.put("/:id", validateSchema(updateOrderSchema), orderController.update);

// Atualizar status do pedido
orderRoutes.patch("/:id/status", validateSchema(updateOrderStatusSchema), orderController.updateStatus);

// Excluir pedido
orderRoutes.delete("/:id", orderController.delete);

export { orderRoutes };
