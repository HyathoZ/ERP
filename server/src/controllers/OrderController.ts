import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class OrderController {
  async list(req: Request, res: Response) {
    const { search, status, customerId, startDate, endDate, page = 1, limit = 10 } = req.query;

    const where = {
      companyId: req.user.companyId,
      ...(search && {
        OR: [
          { number: { contains: search as string } },
          { customer: { name: { contains: search as string, mode: "insensitive" } } },
        ],
      }),
      ...(status && { status }),
      ...(customerId && { customerId: customerId as string }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              name: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    return res.json({
      data: orders,
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

    const order = await prisma.order.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
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

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    return res.json(order);
  }

  async create(req: Request, res: Response) {
    const { customerId, items, notes } = req.body;

    // Verifica se o cliente existe e pertence à empresa
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        companyId: req.user.companyId,
      },
    });

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404);
    }

    // Busca os produtos e valida estoque
    const products = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findFirst({
          where: {
            id: item.productId,
            companyId: req.user.companyId,
          },
        });

        if (!product) {
          throw new AppError(`Produto ${item.productId} não encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new AppError(`Produto ${product.name} não possui estoque suficiente`);
        }

        return {
          ...product,
          orderQuantity: item.quantity,
          orderDiscount: item.discount || 0,
        };
      })
    );

    // Calcula totais
    const orderItems = products.map((product) => ({
      productId: product.id,
      quantity: product.orderQuantity,
      unitPrice: product.price,
      discount: product.orderDiscount,
      total: product.orderQuantity * product.price - (product.orderDiscount || 0),
    }));

    const subtotal = orderItems.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal;

    // Cria o pedido e atualiza estoque
    const order = await prisma.$transaction(async (tx) => {
      // Cria o pedido
      const order = await tx.order.create({
        data: {
          companyId: req.user.companyId,
          customerId,
          number: await this.generateOrderNumber(req.user.companyId),
          subtotal,
          discount: 0,
          total,
          notes,
          items: {
            create: orderItems,
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

      // Atualiza estoque dos produtos
      await Promise.all(
        orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      );

      return order;
    });

    return res.status(201).json(order);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { items, notes } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    if (order.status !== "pending") {
      throw new AppError("Apenas pedidos pendentes podem ser alterados");
    }

    // Busca os produtos e valida estoque
    const products = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findFirst({
          where: {
            id: item.productId,
            companyId: req.user.companyId,
          },
        });

        if (!product) {
          throw new AppError(`Produto ${item.productId} não encontrado`);
        }

        // Encontra o item atual do pedido
        const currentItem = order.items.find((orderItem) => orderItem.productId === item.productId);

        // Calcula a diferença de quantidade
        const quantityDiff = item.quantity - (currentItem?.quantity || 0);

        if (product.stock < quantityDiff) {
          throw new AppError(`Produto ${product.name} não possui estoque suficiente`);
        }

        return {
          ...product,
          orderQuantity: item.quantity,
          orderDiscount: item.discount || 0,
          quantityDiff,
        };
      })
    );

    // Calcula totais
    const orderItems = products.map((product) => ({
      productId: product.id,
      quantity: product.orderQuantity,
      unitPrice: product.price,
      discount: product.orderDiscount,
      total: product.orderQuantity * product.price - (product.orderDiscount || 0),
      quantityDiff: product.quantityDiff,
    }));

    const subtotal = orderItems.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal;

    // Atualiza o pedido e estoque
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Remove itens antigos
      await tx.orderItem.deleteMany({
        where: { orderId: id },
      });

      // Atualiza o pedido
      const order = await tx.order.update({
        where: { id },
        data: {
          subtotal,
          total,
          notes,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              total: item.total,
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

      // Atualiza estoque dos produtos
      await Promise.all(
        orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantityDiff,
              },
            },
          })
        )
      );

      return order;
    });

    return res.json(updatedOrder);
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, reason } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // Validações de status
    if (order.status === status) {
      throw new AppError(`Pedido já está com status ${status}`);
    }

    if (order.status === "cancelled") {
      throw new AppError("Pedido cancelado não pode ser alterado");
    }

    if (order.status === "completed") {
      throw new AppError("Pedido concluído não pode ser alterado");
    }

    // Se estiver cancelando, devolve o estoque
    if (status === "cancelled") {
      await prisma.$transaction(
        order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          })
        )
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        notes: reason
          ? `${order.notes ? order.notes + "\n" : ""}${new Date().toISOString()} - ${status.toUpperCase()}: ${reason}`
          : order.notes,
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

    return res.json(updatedOrder);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    if (order.status !== "pending") {
      throw new AppError("Apenas pedidos pendentes podem ser excluídos");
    }

    // Devolve o estoque e exclui o pedido
    await prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({
        where: { orderId: id },
      });

      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          })
        )
      );

      await tx.order.delete({
        where: { id },
      });
    });

    return res.status(204).send();
  }

  private async generateOrderNumber(companyId: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    const lastOrder = await prisma.order.findFirst({
      where: {
        companyId,
        number: {
          startsWith: `${year}${month}`,
        },
      },
      orderBy: {
        number: "desc",
      },
    });

    const sequence = lastOrder ? (parseInt(lastOrder.number.slice(-4)) + 1).toString().padStart(4, "0") : "0001";

    return `${year}${month}${sequence}`;
  }
}
