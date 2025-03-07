import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class CarrierController {
  async list(req: Request, res: Response) {
    const { search, status, page = 1, limit = 10 } = req.query;

    const where = {
      companyId: req.user.companyId,
      ...(search && {
        OR: [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
          { document: { contains: search as string } },
        ],
      }),
      ...(status && { status }),
    };

    const [carriers, total] = await Promise.all([
      prisma.carrier.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.carrier.count({ where }),
    ]);

    return res.json({
      data: carriers,
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

    const carrier = await prisma.carrier.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!carrier) {
      throw new AppError("Transportadora não encontrada", 404);
    }

    return res.json(carrier);
  }

  async create(req: Request, res: Response) {
    const { body } = req;

    const carrierExists = await prisma.carrier.findFirst({
      where: {
        document: body.document,
        companyId: req.user.companyId,
      },
    });

    if (carrierExists) {
      throw new AppError("Transportadora já cadastrada com este documento");
    }

    const carrier = await prisma.carrier.create({
      data: {
        ...body,
        companyId: req.user.companyId,
      },
    });

    return res.status(201).json(carrier);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;

    const carrier = await prisma.carrier.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!carrier) {
      throw new AppError("Transportadora não encontrada", 404);
    }

    if (body.document && body.document !== carrier.document) {
      const carrierExists = await prisma.carrier.findFirst({
        where: {
          document: body.document,
          companyId: req.user.companyId,
          NOT: {
            id: carrier.id,
          },
        },
      });

      if (carrierExists) {
        throw new AppError("Transportadora já cadastrada com este documento");
      }
    }

    const updatedCarrier = await prisma.carrier.update({
      where: { id },
      data: body,
    });

    return res.json(updatedCarrier);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const carrier = await prisma.carrier.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!carrier) {
      throw new AppError("Transportadora não encontrada", 404);
    }

    await prisma.carrier.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}
