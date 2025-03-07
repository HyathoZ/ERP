import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class RoleController {
  async list(req: Request, res: Response) {
    const { search, status, page = 1, limit = 10 } = req.query;

    const where = {
      companyId: req.user.companyId,
      ...(search && {
        OR: [
          { name: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
    };

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.role.count({ where }),
    ]);

    return res.json({
      data: roles,
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

    const role = await prisma.role.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!role) {
      throw new AppError("Cargo não encontrado", 404);
    }

    return res.json(role);
  }

  async create(req: Request, res: Response) {
    const { body } = req;

    const roleExists = await prisma.role.findFirst({
      where: {
        name: body.name,
        companyId: req.user.companyId,
      },
    });

    if (roleExists) {
      throw new AppError("Já existe um cargo com este nome");
    }

    const role = await prisma.role.create({
      data: {
        ...body,
        companyId: req.user.companyId,
      },
    });

    return res.status(201).json(role);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;

    const role = await prisma.role.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!role) {
      throw new AppError("Cargo não encontrado", 404);
    }

    if (body.name && body.name !== role.name) {
      const roleExists = await prisma.role.findFirst({
        where: {
          name: body.name,
          companyId: req.user.companyId,
          NOT: {
            id: role.id,
          },
        },
      });

      if (roleExists) {
        throw new AppError("Já existe um cargo com este nome");
      }
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: body,
    });

    return res.json(updatedRole);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const role = await prisma.role.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        employees: true,
      },
    });

    if (!role) {
      throw new AppError("Cargo não encontrado", 404);
    }

    if (role.employees.length > 0) {
      throw new AppError("Não é possível excluir um cargo que possui funcionários");
    }

    await prisma.role.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}
