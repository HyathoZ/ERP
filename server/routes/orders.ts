import { Router } from "express";
import { prisma } from "../../src/lib/prisma";

const router = Router();

// Pedidos
router.post("/orders", async (req, res) => {
  try {
    const { customerId, items, notes } = req.body;

    // Gerar número sequencial do pedido
    const lastOrder = await prisma.order.findFirst({
      orderBy: { number: "desc" },
    });

    const nextNumber = lastOrder ? String(Number(lastOrder.number) + 1).padStart(6, "0") : "000001";

    // Calcular totais
    const subtotal = items.reduce(
      (acc: number, item: { quantity: number; unitPrice: number; discount: number }) =>
        acc + item.quantity * item.unitPrice,
      0
    );

    const totalDiscount = items.reduce(
      (acc: number, item: { quantity: number; unitPrice: number; discount: number }) =>
        acc + (item.quantity * item.unitPrice * item.discount) / 100,
      0
    );

    const order = await prisma.order.create({
      data: {
        number: nextNumber,
        customerId,
        notes,
        subtotal,
        discount: totalDiscount,
        total: subtotal - totalDiscount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.quantity * item.unitPrice * (1 - item.discount / 100),
            notes: item.notes,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Criar conta a receber
    await prisma.receivable.create({
      data: {
        description: `Pedido #${order.number}`,
        amount: order.total,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        customerId: order.customerId,
        orderId: order.id,
      },
    });

    // Atualizar estoque dos produtos
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return res.json(order);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const { status, customerId, startDate, endDate } = req.query;

    const where: any = {};

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Atualizar status do pedido
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.json(order);
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export default router;
