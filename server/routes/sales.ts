import { Router } from "express";
import { prisma } from "../../src/lib/prisma";

const router = Router();

// Clientes
router.post("/customers", async (req, res) => {
  try {
    const { name, email, phone, document, type, address, city, state, zipCode, companyId } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        document,
        type,
        address,
        city,
        state,
        zipCode,
        companyId,
      },
    });

    return res.json(customer);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/customers", async (req, res) => {
  try {
    const { search, type, status } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
        { document: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (type) where.type = type;
    if (status) where.status = status;

    const customers = await prisma.customer.findMany({
      where,
      include: {
        _count: {
          select: {
            orders: true,
            opportunities: true,
            interactions: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return res.json(customers);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Interações
router.post("/interactions", async (req, res) => {
  try {
    const { type, description, date, customerId, userId } = req.body;

    const interaction = await prisma.interaction.create({
      data: {
        type,
        description,
        date: new Date(date),
        customerId,
        userId,
      },
      include: {
        customer: true,
      },
    });

    return res.json(interaction);
  } catch (error) {
    console.error("Erro ao criar interação:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/interactions", async (req, res) => {
  try {
    const { customerId, startDate, endDate } = req.query;

    const where: any = {};

    if (customerId) where.customerId = customerId;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const interactions = await prisma.interaction.findMany({
      where,
      include: {
        customer: true,
      },
      orderBy: { date: "desc" },
    });

    return res.json(interactions);
  } catch (error) {
    console.error("Erro ao buscar interações:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Oportunidades
router.post("/opportunities", async (req, res) => {
  try {
    const { title, value, probability, expectedCloseDate, customerId, userId, notes } = req.body;

    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        value,
        probability,
        expectedCloseDate: new Date(expectedCloseDate),
        customerId,
        userId,
        notes,
      },
      include: {
        customer: true,
      },
    });

    return res.json(opportunity);
  } catch (error) {
    console.error("Erro ao criar oportunidade:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/opportunities", async (req, res) => {
  try {
    const { status, customerId } = req.query;

    const where: any = {};

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        customer: true,
        quotes: {
          select: {
            id: true,
            status: true,
            total: true,
          },
        },
      },
      orderBy: { expectedCloseDate: "asc" },
    });

    return res.json(opportunities);
  } catch (error) {
    console.error("Erro ao buscar oportunidades:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Orçamentos
router.post("/quotes", async (req, res) => {
  try {
    const { customerId, opportunityId, items, notes, validUntil } = req.body;

    // Gerar número sequencial do orçamento
    const lastQuote = await prisma.quote.findFirst({
      orderBy: { number: "desc" },
    });

    const nextNumber = lastQuote ? String(Number(lastQuote.number) + 1).padStart(6, "0") : "000001";

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

    const quote = await prisma.quote.create({
      data: {
        number: nextNumber,
        customerId,
        opportunityId,
        notes,
        validUntil: new Date(validUntil),
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

    return res.json(quote);
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/quotes", async (req, res) => {
  try {
    const { status, customerId } = req.query;

    const where: any = {};

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const quotes = await prisma.quote.findMany({
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

    return res.json(quotes);
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export default router;
