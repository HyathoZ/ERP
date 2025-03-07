import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class ServiceOrderController {
  async list(req: Request, res: Response) {
    const { search, status, customerId, employeeId, startDate, endDate, page = 1, limit = 10 } = req.query;

    const where = {
      companyId: req.user.companyId,
      ...(search && {
        OR: [
          { number: { contains: search as string } },
          { description: { contains: search as string, mode: "insensitive" } },
          { problem: { contains: search as string, mode: "insensitive" } },
          { customer: { name: { contains: search as string, mode: "insensitive" } } },
        ],
      }),
      ...(status && { status }),
      ...(customerId && { customerId: customerId as string }),
      ...(employeeId && { employeeId: employeeId as string }),
      ...(startDate &&
        endDate && {
          startDate: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        }),
    };

    const [serviceOrders, total] = await Promise.all([
      prisma.serviceOrder.findMany({
        where,
        include: {
          customer: {
            select: {
              name: true,
            },
          },
          employee: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.serviceOrder.count({ where }),
    ]);

    return res.json({
      data: serviceOrders,
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

    const serviceOrder = await prisma.serviceOrder.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        customer: true,
        employee: true,
        items: {
          include: {
            product: true,
          },
        },
        history: {
          include: {
            employee: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!serviceOrder) {
      throw new AppError("Ordem de serviço não encontrada", 404);
    }

    return res.json(serviceOrder);
  }

  async create(req: Request, res: Response) {
    const { customerId, employeeId, description, problem, priority, startDate, items, notes } = req.body;

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

    // Verifica se o funcionário existe e pertence à empresa
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        companyId: req.user.companyId,
      },
    });

    if (!employee) {
      throw new AppError("Funcionário não encontrado", 404);
    }

    // Se houver itens, verifica se os produtos existem e têm estoque
    let orderItems = [];
    if (items && items.length > 0) {
      orderItems = await Promise.all(
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
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            total: item.quantity * item.unitPrice - (item.discount || 0),
          };
        })
      );
    }

    // Gera o número da OS
    const number = await this.generateServiceOrderNumber(req.user.companyId);

    // Cria a OS e atualiza estoque dos produtos
    const serviceOrder = await prisma.$transaction(async (tx) => {
      // Cria a OS
      const serviceOrder = await tx.serviceOrder.create({
        data: {
          companyId: req.user.companyId,
          customerId,
          employeeId,
          number,
          description,
          problem,
          priority,
          startDate: new Date(startDate),
          notes,
          items: {
            create: orderItems,
          },
          history: {
            create: {
              status: "pending",
              description: "Ordem de serviço criada",
              employeeId,
            },
          },
        },
        include: {
          customer: true,
          employee: true,
          items: {
            include: {
              product: true,
            },
          },
          history: {
            include: {
              employee: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      // Atualiza estoque dos produtos
      if (orderItems.length > 0) {
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
      }

      return serviceOrder;
    });

    return res.status(201).json(serviceOrder);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { employeeId, description, problem, solution, priority, startDate, endDate, items, notes } = req.body;

    const serviceOrder = await prisma.serviceOrder.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        items: true,
      },
    });

    if (!serviceOrder) {
      throw new AppError("Ordem de serviço não encontrada", 404);
    }

    if (["completed", "cancelled"].includes(serviceOrder.status)) {
      throw new AppError("Ordem de serviço não pode ser alterada");
    }

    // Se informado um funcionário, verifica se existe e pertence à empresa
    if (employeeId) {
      const employee = await prisma.employee.findFirst({
        where: {
          id: employeeId,
          companyId: req.user.companyId,
        },
      });

      if (!employee) {
        throw new AppError("Funcionário não encontrado", 404);
      }
    }

    // Se houver itens, verifica se os produtos existem e têm estoque
    let orderItems = [];
    if (items && items.length > 0) {
      orderItems = await Promise.all(
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

          // Encontra o item atual da OS
          const currentItem = serviceOrder.items.find((orderItem) => orderItem.productId === item.productId);

          // Calcula a diferença de quantidade
          const quantityDiff = item.quantity - (currentItem?.quantity || 0);

          if (product.stock < quantityDiff) {
            throw new AppError(`Produto ${product.name} não possui estoque suficiente`);
          }

          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            total: item.quantity * item.unitPrice - (item.discount || 0),
            quantityDiff,
          };
        })
      );
    }

    // Atualiza a OS e estoque dos produtos
    const updatedServiceOrder = await prisma.$transaction(async (tx) => {
      // Remove itens antigos
      if (items) {
        await tx.serviceOrderItem.deleteMany({
          where: { serviceOrderId: id },
        });
      }

      // Atualiza a OS
      const serviceOrder = await tx.serviceOrder.update({
        where: { id },
        data: {
          ...(employeeId && { employeeId }),
          ...(description && { description }),
          ...(problem && { problem }),
          ...(solution && { solution }),
          ...(priority && { priority }),
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
          ...(notes && { notes }),
          ...(items && {
            items: {
              create: orderItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount,
                total: item.total,
              })),
            },
          }),
        },
        include: {
          customer: true,
          employee: true,
          items: {
            include: {
              product: true,
            },
          },
          history: {
            include: {
              employee: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      // Atualiza estoque dos produtos
      if (orderItems.length > 0) {
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
      }

      return serviceOrder;
    });

    return res.json(updatedServiceOrder);
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, description } = req.body;

    const serviceOrder = await prisma.serviceOrder.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!serviceOrder) {
      throw new AppError("Ordem de serviço não encontrada", 404);
    }

    if (serviceOrder.status === status) {
      throw new AppError(`Ordem de serviço já está com status ${status}`);
    }

    if (["completed", "cancelled"].includes(serviceOrder.status)) {
      throw new AppError("Ordem de serviço não pode ser alterada");
    }

    const updatedServiceOrder = await prisma.serviceOrder.update({
      where: { id },
      data: {
        status,
        history: {
          create: {
            status,
            description,
            employeeId: req.user.employeeId,
          },
        },
      },
      include: {
        customer: true,
        employee: true,
        items: {
          include: {
            product: true,
          },
        },
        history: {
          include: {
            employee: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return res.json(updatedServiceOrder);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const serviceOrder = await prisma.serviceOrder.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        items: true,
      },
    });

    if (!serviceOrder) {
      throw new AppError("Ordem de serviço não encontrada", 404);
    }

    if (serviceOrder.status !== "pending") {
      throw new AppError("Apenas ordens de serviço pendentes podem ser excluídas");
    }

    // Exclui a OS e devolve o estoque dos produtos
    await prisma.$transaction(async (tx) => {
      // Devolve o estoque dos produtos
      await Promise.all(
        serviceOrder.items.map((item) =>
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

      // Remove os itens
      await tx.serviceOrderItem.deleteMany({
        where: { serviceOrderId: id },
      });

      // Remove o histórico
      await tx.serviceOrderHistory.deleteMany({
        where: { serviceOrderId: id },
      });

      // Remove a OS
      await tx.serviceOrder.delete({
        where: { id },
      });
    });

    return res.status(204).send();
  }

  private async generateServiceOrderNumber(companyId: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    const lastOrder = await prisma.serviceOrder.findFirst({
      where: {
        companyId,
        number: {
          startsWith: `OS${year}${month}`,
        },
      },
      orderBy: {
        number: "desc",
      },
    });

    const sequence = lastOrder ? (parseInt(lastOrder.number.slice(-4)) + 1).toString().padStart(4, "0") : "0001";

    return `OS${year}${month}${sequence}`;
  }
}
