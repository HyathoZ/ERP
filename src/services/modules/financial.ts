import { api } from "../../lib/api";
import type { BankAccount, FinancialTransaction, Budget, TransactionType, TransactionStatus } from "../../types";

// Contas Bancárias
export const bankAccountService = {
  async create(data: Omit<BankAccount, "id" | "created_at">) {
    const response = await api.post("/api/financial/bank-accounts", data);
    return response.data;
  },

  async update(id: string, data: Partial<BankAccount>) {
    const response = await api.put(`/api/financial/bank-accounts/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/api/financial/bank-accounts/${id}`);
  },

  async getById(id: string) {
    const response = await api.get(`/api/financial/bank-accounts/${id}`);
    return response.data;
  },

  async list(companyId: string) {
    const response = await api.get(`/api/financial/bank-accounts`, {
      params: { companyId },
    });
    return response.data;
  },
};

// Transações Financeiras
export const transactionService = {
  async create(data: Omit<FinancialTransaction, "id" | "created_at">) {
    const response = await api.post("/api/financial/transactions", data);
    return response.data;
  },

  async update(id: string, data: Partial<FinancialTransaction>) {
    const response = await api.put(`/api/financial/transactions/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/api/financial/transactions/${id}`);
  },

  async getById(id: string) {
    const response = await api.get(`/api/financial/transactions/${id}`);
    return response.data;
  },

  async list(
    companyId: string,
    filters?: {
      type?: TransactionType;
      status?: TransactionStatus;
      startDate?: string;
      endDate?: string;
      bankAccountId?: string;
    }
  ) {
    const response = await api.get("/api/financial/transactions", {
      params: { companyId, ...filters },
    });
    return response.data;
  },

  async getBalance(companyId: string) {
    const response = await api.get("/api/financial/transactions/balance", {
      params: { companyId },
    });
    return response.data;
  },
};

// Orçamentos
export const budgetService = {
  async create(data: Omit<Budget, "id" | "created_at">) {
    const response = await api.post("/api/financial/budgets", data);
    return response.data;
  },

  async update(id: string, data: Partial<Budget>) {
    const response = await api.put(`/api/financial/budgets/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/api/financial/budgets/${id}`);
  },

  async getById(id: string) {
    const response = await api.get(`/api/financial/budgets/${id}`);
    return response.data;
  },

  async list(companyId: string, year?: number, month?: number) {
    const response = await api.get("/api/financial/budgets", {
      params: { companyId, year, month },
    });
    return response.data;
  },
};
