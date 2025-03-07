import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role: Role;
      active: boolean;
    }

    interface Request {
      user?: User;
    }
  }
}
