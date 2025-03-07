import { Router, Request, Response } from "express";

const router = Router();

// Rota para listar vendas
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Lista de vendas" });
});

// Rota para criar uma nova venda
router.post("/", (req: Request, res: Response) => {
  res.json({ message: "Nova venda criada" });
});

// Rota para obter relatórios de vendas
router.get("/reports", (req: Request, res: Response) => {
  res.json({ message: "Relatórios de vendas" });
});

export default router;
