import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class ProductController {
  async list(req: Request, res: Response) {
    const { search, status, minStock, page = 1, limit = 10 } = req.query;

    const where = {
      companyId: req.user.companyId,
      ...(search && {
        OR: [
          { name: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(minStock === "true" && {
        stock: {
          lte: { minStock: true },
        },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      data: products,
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

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return res.json(product);
  }

  async create(req: Request, res: Response) {
    const { body } = req;

    const product = await prisma.product.create({
      data: {
        ...body,
        companyId: req.user.companyId,
      },
    });

    return res.status(201).json(product);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
    });

    return res.json(updatedProduct);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        orderItems: {
          where: {
            order: {
              status: {
                in: ["pending", "approved"],
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.orderItems.length > 0) {
      throw new AppError("Produto não pode ser excluído pois está em pedidos em andamento");
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(204).send();
  }

  async adjustStock(req: Request, res: Response) {
    const { id } = req.params;
    const { quantity, type, reason } = req.body;

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (type === "remove" && product.stock < quantity) {
      throw new AppError("Estoque insuficiente");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: type === "add" ? product.stock + quantity : product.stock - quantity,
      },
    });

    // TODO: Registrar movimentação de estoque
    console.log("Movimentação de estoque:", {
      productId: id,
      type,
      quantity,
      reason,
      previousStock: product.stock,
      currentStock: updatedProduct.stock,
    });

    return res.json(updatedProduct);
  }
}
