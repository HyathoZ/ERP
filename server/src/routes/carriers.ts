import { Router } from "express";
import { CarrierController } from "../controllers/CarrierController";
import { validateSchema } from "../middlewares/validateSchema";
import { createCarrierSchema, updateCarrierSchema } from "../schemas/carrier";

const carrierRoutes = Router();
const carrierController = new CarrierController();

// Listar transportadoras
carrierRoutes.get("/", carrierController.list);

// Buscar transportadora por ID
carrierRoutes.get("/:id", carrierController.findById);

// Criar transportadora
carrierRoutes.post("/", validateSchema(createCarrierSchema), carrierController.create);

// Atualizar transportadora
carrierRoutes.put("/:id", validateSchema(updateCarrierSchema), carrierController.update);

// Excluir transportadora
carrierRoutes.delete("/:id", carrierController.delete);

export { carrierRoutes };
