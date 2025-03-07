import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateSchema } from "../middlewares/validateSchema";
import { loginSchema, registerSchema, resetPasswordSchema } from "../schemas/auth";

const authRoutes = Router();
const authController = new AuthController();

// Login
authRoutes.post("/login", validateSchema(loginSchema), authController.login);

// Registro
authRoutes.post("/register", validateSchema(registerSchema), authController.register);

// Recuperação de senha
authRoutes.post("/forgot-password", validateSchema({ email: "string" }), authController.forgotPassword);

authRoutes.post("/reset-password", validateSchema(resetPasswordSchema), authController.resetPassword);

// Refresh token
authRoutes.post("/refresh-token", authController.refreshToken);

export { authRoutes };
