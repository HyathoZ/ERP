import { Router } from "express";
import { prisma } from "../../src/lib/prisma";

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

// Transações
router.post("/transactions", async (req, res) => {
  try {
    const { type, amount, description, date, category, accountId } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        description,
        date: new Date(date),
        category,
        accountId,
      },
    });

    // Atualizar saldo da conta
    await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: type === "INCOME" ? amount : -amount,
        },
      },
    });

    return res.json(transaction);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const { startDate, endDate, accountId } = req.query;

    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (accountId) {
      where.accountId = accountId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.json(transactions);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
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

export default router;
