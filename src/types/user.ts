export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};
