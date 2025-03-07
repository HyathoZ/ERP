import { Router } from "express";
import { authRoutes } from "./auth";
import { customerRoutes } from "./customers";
import { productRoutes } from "./products";
import { orderRoutes } from "./orders";
import { financialRoutes } from "./financial";
import { supplierRoutes } from "./suppliers";
import { carrierRoutes } from "./carriers";
import { roleRoutes } from "./roles";
import { employeeRoutes } from "./employees";
import { serviceOrderRoutes } from "./serviceOrders";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const routes = Router();

// Rotas públicas
routes.use("/auth", authRoutes);

// Rotas protegidas
routes.use(ensureAuthenticated);
routes.use("/customers", customerRoutes);
routes.use("/products", productRoutes);
routes.use("/orders", orderRoutes);
routes.use("/financial", financialRoutes);
routes.use("/suppliers", supplierRoutes);
routes.use("/carriers", carrierRoutes);
routes.use("/roles", roleRoutes);
routes.use("/employees", employeeRoutes);
routes.use("/service-orders", serviceOrderRoutes);

export { routes };
