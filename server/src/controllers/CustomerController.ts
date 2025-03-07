import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class CustomerController {
  async list(req: Request, res: Response) {
    const { search, type, status, page = 1, limit = 10 } = req.query;

    const where = {
      companyId: req.user.companyId,
      ...(search && {
        OR: [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
          { document: { contains: search as string } },
        ],
      }),
      ...(type && { type }),
      ...(status && { status }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.customer.count({ where }),
    ]);

    return res.json({
      data: customers,
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

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404);
    }

    return res.json(customer);
  }

  async create(req: Request, res: Response) {
    const { body } = req;

    const customerExists = await prisma.customer.findFirst({
      where: {
        document: body.document,
        companyId: req.user.companyId,
      },
    });

    if (customerExists) {
      throw new AppError("Cliente já cadastrado com este documento");
    }

    const customer = await prisma.customer.create({
      data: {
        ...body,
        companyId: req.user.companyId,
      },
    });

    return res.status(201).json(customer);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404);
    }

    if (body.document && body.document !== customer.document) {
      const customerExists = await prisma.customer.findFirst({
        where: {
          document: body.document,
          companyId: req.user.companyId,
          NOT: {
            id: customer.id,
          },
        },
      });

      if (customerExists) {
        throw new AppError("Cliente já cadastrado com este documento");
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: body,
    });

    return res.json(updatedCustomer);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        orders: {
          where: {
            status: {
              in: ["pending", "approved"],
            },
          },
        },
      },
    });

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404);
    }

    if (customer.orders.length > 0) {
      throw new AppError("Cliente não pode ser excluído pois possui pedidos em andamento");
    }

    await prisma.customer.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}
