import { Router, Request, Response } from "express";

const router = Router();

// Contas
router.post("/accounts", async (req, res) => {
  try {
    const { name, type, bankName, bankBranch, bankAccount } = req.body;

    const account = await prisma.account.create({
      data: {
        name,
        type,
        bankName,
        bankBranch,
        bankAccount,
      },
    });

    return res.json(account);
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/accounts", async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        _count: {
          select: {
            transactions: true,
            payables: true,
            receivables: true,
          },
        },
      },
    });

    return res.json(accounts);
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Rota para listar transações financeiras
router.get("/transactions", (req: Request, res: Response) => {
  res.json({ message: "Lista de transações financeiras" });
});

// Rota para criar uma nova transação
router.post("/transactions", (req: Request, res: Response) => {
  res.json({ message: "Nova transação criada" });
});

// Contas a Pagar
router.post("/payables", async (req, res) => {
  try {
    const { description, amount, dueDate, supplier, category, accountId } = req.body;

    const payable = await prisma.payable.create({
      data: {
        description,
        amount,
        dueDate: new Date(dueDate),
        supplier,
        category,
        accountId,
      },
    });

    return res.json(payable);
  } catch (error) {
    console.error("Erro ao criar conta a pagar:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/payables", async (req, res) => {
  try {
    const { status } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const payables = await prisma.payable.findMany({
      where,
      include: {
        account: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return res.json(payables);
  } catch (error) {
    console.error("Erro ao buscar contas a pagar:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Contas a Receber
router.post("/receivables", async (req, res) => {
  try {
    const { description, amount, dueDate, customer, category, accountId } = req.body;

    const receivable = await prisma.receivable.create({
      data: {
        description,
        amount,
        dueDate: new Date(dueDate),
        customer,
        category,
        accountId,
      },
    });

    return res.json(receivable);
  } catch (error) {
    console.error("Erro ao criar conta a receber:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/receivables", async (req, res) => {
  try {
    const { status } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const receivables = await prisma.receivable.findMany({
      where,
      include: {
        account: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return res.json(receivables);
  } catch (error) {
    console.error("Erro ao buscar contas a receber:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Orçamentos
router.post("/budgets", async (req, res) => {
  try {
    const { year, month, department, category, planned } = req.body;

    const budget = await prisma.budget.create({
      data: {
        year,
        month,
        department,
        category,
        planned,
      },
    });

    return res.json(budget);
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/budgets", async (req, res) => {
  try {
    const { year, month, department } = req.query;

    const where: any = {};

    if (year) where.year = parseInt(year as string);
    if (month) where.month = parseInt(month as string);
    if (department) where.department = department;

    const budgets = await prisma.budget.findMany({
      where,
      orderBy: [{ year: "desc" }, { month: "asc" }],
    });

    return res.json(budgets);
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Rota para obter relatórios financeiros
router.get("/reports", (req: Request, res: Response) => {
  res.json({ message: "Relatórios financeiros" });
});

export default router;
