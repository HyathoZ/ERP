import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export class EmployeeController {
  async list(req: Request, res: Response) {
    const { search, status, roleId, page = 1, limit = 10 } = req.query;

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
      ...(roleId && { roleId: roleId as string }),
    };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          role: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { name: "asc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.employee.count({ where }),
    ]);

    return res.json({
      data: employees,
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

    const employee = await prisma.employee.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        role: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        serviceOrders: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            customer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new AppError("Funcionário não encontrado", 404);
    }

    return res.json(employee);
  }

  async create(req: Request, res: Response) {
    const { body } = req;

    const employeeExists = await prisma.employee.findFirst({
      where: {
        document: body.document,
        companyId: req.user.companyId,
      },
    });

    if (employeeExists) {
      throw new AppError("Funcionário já cadastrado com este documento");
    }

    // Verifica se o cargo existe e pertence à empresa
    const role = await prisma.role.findFirst({
      where: {
        id: body.roleId,
        companyId: req.user.companyId,
      },
    });

    if (!role) {
      throw new AppError("Cargo não encontrado", 404);
    }

    // Se informado um usuário, verifica se existe e está disponível
    if (body.userId) {
      const user = await prisma.user.findFirst({
        where: {
          id: body.userId,
          companyId: req.user.companyId,
        },
        include: {
          employee: true,
        },
      });

      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      if (user.employee) {
        throw new AppError("Usuário já está vinculado a outro funcionário");
      }
    }

    const employee = await prisma.employee.create({
      data: {
        ...body,
        companyId: req.user.companyId,
      },
      include: {
        role: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json(employee);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;

    const employee = await prisma.employee.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!employee) {
      throw new AppError("Funcionário não encontrado", 404);
    }

    if (body.document && body.document !== employee.document) {
      const employeeExists = await prisma.employee.findFirst({
        where: {
          document: body.document,
          companyId: req.user.companyId,
          NOT: {
            id: employee.id,
          },
        },
      });

      if (employeeExists) {
        throw new AppError("Funcionário já cadastrado com este documento");
      }
    }

    // Se informado um cargo, verifica se existe e pertence à empresa
    if (body.roleId) {
      const role = await prisma.role.findFirst({
        where: {
          id: body.roleId,
          companyId: req.user.companyId,
        },
      });

      if (!role) {
        throw new AppError("Cargo não encontrado", 404);
      }
    }

    // Se informado um usuário, verifica se existe e está disponível
    if (body.userId && body.userId !== employee.userId) {
      const user = await prisma.user.findFirst({
        where: {
          id: body.userId,
          companyId: req.user.companyId,
        },
        include: {
          employee: true,
        },
      });

      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      if (user.employee && user.employee.id !== employee.id) {
        throw new AppError("Usuário já está vinculado a outro funcionário");
      }
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: body,
      include: {
        role: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.json(updatedEmployee);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const employee = await prisma.employee.findFirst({
      where: {
        id,
        companyId: req.user.companyId,
      },
      include: {
        serviceOrders: {
          where: {
            status: {
              in: ["pending", "in_progress", "waiting_parts", "waiting_approval"],
            },
          },
        },
      },
    });

    if (!employee) {
      throw new AppError("Funcionário não encontrado", 404);
    }

    if (employee.serviceOrders.length > 0) {
      throw new AppError("Funcionário possui ordens de serviço em andamento");
    }

    await prisma.employee.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}
