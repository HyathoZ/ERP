import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class FinancialController {
  async list(req: Request, res: Response) {
    const { search, type, status, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const where = {
      companyId: req.user.companyId,
      ...(search && {
        OR: [
          { description: { contains: search as string, mode: "insensitive" } },
          { category: { contains: search as string, mode: "insensitive" } },
        ],
      }),
      ...(type && { type }),
      ...(status && { status }),
      ...(category && { category }),
      ...(startDate &&
        endDate && {
          dueDate: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        }),
    };

    const [transactions, total] = await Promise.all([
      prisma.financial.findMany({
        where,
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { dueDate: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.financial.count({ where }),
    ]);

    return res.json({
      data: transactions,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const transaction = await prisma.financial.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        customer: true,
      },
    });

    if (!transaction) {
      throw new AppError("Lançamento não encontrado", 404);
    }

    return res.json(transaction);
  }

  async create(req: Request, res: Response) {
    const { body } = req;

    if (body.customerId) {
      const customer = await prisma.customer.findFirst({
        where: {
          id: body.customerId,
          companyId: req.user.companyId,
        },
      });

      if (!customer) {
        throw new AppError("Cliente não encontrado", 404);
      }
    }

    if (body.orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: body.orderId,
          companyId: req.user.companyId,
        },
      });

      if (!order) {
        throw new AppError("Pedido não encontrado", 404);
      }
    }

    const transaction = await prisma.financial.create({
      data: {
        ...body,
        companyId: req.user.companyId,
      },
      include: {
        customer: true,
      },
    });

    return res.status(201).json(transaction);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;

    const transaction = await prisma.financial.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!transaction) {
      throw new AppError("Lançamento não encontrado", 404);
    }

    if (transaction.status !== "pending") {
      throw new AppError("Apenas lançamentos pendentes podem ser alterados");
    }

    if (body.customerId) {
      const customer = await prisma.customer.findFirst({
        where: {
          id: body.customerId,
          companyId: req.user.companyId,
        },
      });

      if (!customer) {
        throw new AppError("Cliente não encontrado", 404);
      }
    }

    if (body.orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: body.orderId,
          companyId: req.user.companyId,
        },
      });

      if (!order) {
        throw new AppError("Pedido não encontrado", 404);
      }
    }

    const updatedTransaction = await prisma.financial.update({
      where: { id },
      data: body,
      include: {
        customer: true,
      },
    });

    return res.json(updatedTransaction);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const transaction = await prisma.financial.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!transaction) {
      throw new AppError("Lançamento não encontrado", 404);
    }

    if (transaction.status !== "pending") {
      throw new AppError("Apenas lançamentos pendentes podem ser excluídos");
    }

    await prisma.financial.delete({
      where: { id },
    });

    return res.status(204).send();
  }

  async pay(req: Request, res: Response) {
    const { id } = req.params;
    const { paymentDate, paymentMethod, notes } = req.body;

    const transaction = await prisma.financial.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!transaction) {
      throw new AppError("Lançamento não encontrado", 404);
    }

    if (transaction.status !== "pending") {
      throw new AppError("Apenas lançamentos pendentes podem ser pagos");
    }

    const updatedTransaction = await prisma.financial.update({
      where: { id },
      data: {
        status: "paid",
        paymentDate: new Date(paymentDate),
        paymentMethod,
        notes: notes
          ? `${transaction.notes ? transaction.notes + "\n" : ""}${new Date().toISOString()} - PAGO: ${notes}`
          : transaction.notes,
      },
      include: {
        customer: true,
      },
    });

    return res.json(updatedTransaction);
  }

  async cancel(req: Request, res: Response) {
    const { id } = req.params;
    const { reason } = req.body;

    const transaction = await prisma.financial.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!transaction) {
      throw new AppError("Lançamento não encontrado", 404);
    }

    if (transaction.status === "cancelled") {
      throw new AppError("Lançamento já está cancelado");
    }

    const updatedTransaction = await prisma.financial.update({
      where: { id },
      data: {
        status: "cancelled",
        notes: `${transaction.notes ? transaction.notes + "\n" : ""}${new Date().toISOString()} - CANCELADO: ${reason}`,
      },
      include: {
        customer: true,
      },
    });

    return res.json(updatedTransaction);
  }

  async cashFlowReport(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError("Data inicial e final são obrigatórias");
    }

    const transactions = await prisma.financial.findMany({
      where: {
        companyId: req.user.companyId,
        status: "paid",
        paymentDate: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      orderBy: {
        paymentDate: "asc",
      },
    });

    const cashFlow = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );

    return res.json({
      startDate,
      endDate,
      ...cashFlow,
      transactions,
    });
  }

  async receivablesReport(req: Request, res: Response) {
    const transactions = await prisma.financial.findMany({
      where: {
        companyId: req.user.companyId,
        type: "income",
        status: "pending",
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const byDueDate = transactions.reduce((acc, transaction) => {
      const dueDate = transaction.dueDate.toISOString().split("T")[0];
      if (!acc[dueDate]) {
        acc[dueDate] = {
          total: 0,
          transactions: [],
        };
      }
      acc[dueDate].total += transaction.amount;
      acc[dueDate].transactions.push(transaction);
      return acc;
    }, {} as Record<string, { total: number; transactions: typeof transactions }>);

    return res.json({
      total,
      byDueDate,
    });
  }

  async payablesReport(req: Request, res: Response) {
    const transactions = await prisma.financial.findMany({
      where: {
        companyId: req.user.companyId,
        type: "expense",
        status: "pending",
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const byDueDate = transactions.reduce((acc, transaction) => {
      const dueDate = transaction.dueDate.toISOString().split("T")[0];
      if (!acc[dueDate]) {
        acc[dueDate] = {
          total: 0,
          transactions: [],
        };
      }
      acc[dueDate].total += transaction.amount;
      acc[dueDate].transactions.push(transaction);
      return acc;
    }, {} as Record<string, { total: number; transactions: typeof transactions }>);

    return res.json({
      total,
      byDueDate,
    });
  }
}
