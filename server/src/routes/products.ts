import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { validateSchema } from "../middlewares/validateSchema";
import { createProductSchema, updateProductSchema } from "../schemas/product";

const productRoutes = Router();
const productController = new ProductController();

// Listar produtos
productRoutes.get("/", productController.list);

// Buscar produto por ID
productRoutes.get("/:id", productController.findById);

// Criar produto
productRoutes.post("/", validateSchema(createProductSchema), productController.create);

// Atualizar produto
productRoutes.put("/:id", validateSchema(updateProductSchema), productController.update);

// Excluir produto
productRoutes.delete("/:id", productController.delete);

// Ajustar estoque
productRoutes.post(
  "/:id/stock",
  validateSchema({
    body: {
      quantity: "number",
      type: "add | remove",
      reason: "string",
    },
  }),
  productController.adjustStock
);

export { productRoutes };
