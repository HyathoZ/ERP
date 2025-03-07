export type UserRole = "user" | "admin" | "superadmin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: "individual" | "company";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: "active" | "inactive";
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  unit: string;
  status: "active" | "inactive";
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  status: "pending" | "approved" | "cancelled" | "completed";
  subtotal: number;
  discount: number;
  total: number;
  notes: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
