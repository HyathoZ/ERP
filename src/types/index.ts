// Tipos base
export type UserRole = "superadmin" | "admin" | "manager" | "user";

export type PlanType = "basic" | "professional" | "enterprise";

export type TransactionType = "income" | "expense";

export type TransactionStatus = "pending" | "paid" | "cancelled";

export type DocumentType = "cpf" | "cnpj";

export type ServiceOrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type ServiceOrderPriority = "low" | "medium" | "high" | "urgent";

export type ProductionOrderStatus = "planned" | "in_progress" | "completed" | "cancelled";

export type EmployeeStatus = "active" | "inactive" | "vacation" | "leave";

export type InvoiceType = "nfe" | "nfse" | "nfce";

export type InvoiceStatus = "draft" | "issued" | "cancelled";

// Entidades principais
export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id?: string;
  department?: string;
  phone?: string;
  active: boolean;
  last_login?: string;
  created_at: string;
};

export type Company = {
  id: string;
  name: string;
  plan: PlanType;
  active: boolean;
  max_users: number;
  current_users: number;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  expires_at: string;
};

export type Plan = {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  max_users: number;
  features: string[];
  created_at: string;
};

// Gestão Financeira
export type BankAccount = {
  id: string;
  company_id: string;
  bank_name: string;
  account_number: string;
  branch_number: string;
  balance: number;
  type: string;
  created_at: string;
};

export type FinancialTransaction = {
  id: string;
  company_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: TransactionStatus;
  description?: string;
  bank_account_id?: string;
  created_at: string;
};

export type Budget = {
  id: string;
  company_id: string;
  department: string;
  year: number;
  month: number;
  amount: number;
  actual_amount: number;
  created_at: string;
};

// Gestão de Vendas e CRM
export type Customer = {
  id: string;
  company_id: string;
  name: string;
  type: DocumentType;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
  segment?: string;
  created_at: string;
};

export type Quotation = {
  id: string;
  company_id: string;
  customer_id: string;
  status: string;
  total_amount: number;
  valid_until?: string;
  items: QuotationItem[];
  created_by: string;
  created_at: string;
};

export type QuotationItem = {
  product_id: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  total: number;
};

export type Contract = {
  id: string;
  company_id: string;
  customer_id: string;
  start_date: string;
  end_date?: string;
  value: number;
  status: string;
  terms?: string;
  created_at: string;
};

export type CustomerInteraction = {
  id: string;
  company_id: string;
  customer_id: string;
  type: string;
  description: string;
  scheduled_date?: string;
  completed_date?: string;
  created_by: string;
  created_at: string;
};

// Gestão de Estoque e Compras
export type Product = {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  unit?: string;
  cost_price?: number;
  sale_price?: number;
  min_stock?: number;
  current_stock: number;
  created_at: string;
};

export type Supplier = {
  id: string;
  company_id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
};

export type PurchaseOrder = {
  id: string;
  company_id: string;
  supplier_id: string;
  status: string;
  total_amount: number;
  expected_date?: string;
  items: PurchaseOrderItem[];
  created_by: string;
  created_at: string;
};

export type PurchaseOrderItem = {
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
};

export type InventoryMovement = {
  id: string;
  company_id: string;
  product_id: string;
  type: "in" | "out";
  quantity: number;
  unit_price: number;
  document_type?: string;
  document_id?: string;
  created_by: string;
  created_at: string;
};

// Gestão de Ordem de Serviço
export type ServiceOrder = {
  id: string;
  company_id: string;
  customer_id: string;
  status: ServiceOrderStatus;
  priority: ServiceOrderPriority;
  description: string;
  scheduled_date?: string;
  completion_date?: string;
  items?: ServiceOrderItem[];
  total_amount?: number;
  assigned_to: string;
  signature?: Uint8Array;
  created_by: string;
  created_at: string;
};

export type ServiceOrderItem = {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
};

// Gestão de Produção
export type ProductionOrder = {
  id: string;
  company_id: string;
  product_id: string;
  status: ProductionOrderStatus;
  quantity: number;
  start_date?: string;
  end_date?: string;
  actual_cost?: number;
  materials?: ProductionMaterial[];
  steps?: ProductionStep[];
  created_by: string;
  created_at: string;
};

export type ProductionMaterial = {
  product_id: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
};

export type ProductionStep = {
  name: string;
  status: string;
  start_date?: string;
  end_date?: string;
  responsible?: string;
  observations?: string;
};

// Gestão de RH
export type Employee = {
  id: string;
  company_id: string;
  user_id: string;
  name: string;
  document: string;
  position: string;
  department: string;
  salary: number;
  hire_date: string;
  status: EmployeeStatus;
  created_at: string;
};

export type Payroll = {
  id: string;
  company_id: string;
  employee_id: string;
  year: number;
  month: number;
  base_salary: number;
  benefits?: PayrollBenefit[];
  deductions?: PayrollDeduction[];
  net_salary: number;
  payment_date?: string;
  created_at: string;
};

export type PayrollBenefit = {
  name: string;
  amount: number;
};

export type PayrollDeduction = {
  name: string;
  amount: number;
};

export type Timesheet = {
  id: string;
  company_id: string;
  employee_id: string;
  date: string;
  clock_in?: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  total_hours?: number;
  created_at: string;
};

export type Training = {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  participants?: TrainingParticipant[];
  created_at: string;
};

export type TrainingParticipant = {
  employee_id: string;
  status: string;
  completion_date?: string;
  score?: number;
};

// Gestão Fiscal
export type Invoice = {
  id: string;
  company_id: string;
  type: InvoiceType;
  number: string;
  series?: string;
  customer_id: string;
  items: InvoiceItem[];
  total_amount: number;
  tax_amount: number;
  status: InvoiceStatus;
  issue_date?: string;
  created_by: string;
  created_at: string;
};

export type InvoiceItem = {
  product_id: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
};
