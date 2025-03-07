// import { supabase } from "../supabase";
// import type {
//   BankAccount,
//   FinancialTransaction,
//   Budget,
//   TransactionType,
//   TransactionStatus,
// } from "../../types";

// Contas Bancárias
export const bankAccountService = {
  //   async create(data: Omit<BankAccount, "id" | "created_at">) {
  //     const { data: bankAccount, error } = await supabase.from("bank_accounts").insert(data).select().single();
  //     if (error) throw error;
  //     return bankAccount;
  //   },
  //   async update(id: string, data: Partial<BankAccount>) {
  //     const { data: bankAccount, error } = await supabase
  //       .from("bank_accounts")
  //       .update(data)
  //       .eq("id", id)
  //       .select()
  //       .single();
  //     if (error) throw error;
  //     return bankAccount;
  //   },
  //   async delete(id: string) {
  //     const { error } = await supabase.from("bank_accounts").delete().eq("id", id);
  //     if (error) throw error;
  //   },
  //   async getById(id: string) {
  //     const { data: bankAccount, error } = await supabase.from("bank_accounts").select().eq("id", id).single();
  //     if (error) throw error;
  //     return bankAccount;
  //   },
  //   async list(companyId: string) {
  //     const { data: bankAccounts, error } = await supabase
  //       .from("bank_accounts")
  //       .select()
  //       .eq("company_id", companyId)
  //       .order("created_at", { ascending: false });
  //     if (error) throw error;
  //     return bankAccounts;
  //   },
};

// Transações Financeiras
export const transactionService = {
  // async create(data: Omit<FinancialTransaction, "id" | "created_at">) {
  //   const { data: transaction, error } = await supabase.from("financial_transactions").insert(data).select().single();
  //   if (error) throw error;
  //   return transaction;
  // },
  // async update(id: string, data: Partial<FinancialTransaction>) {
  //   const { data: transaction, error } = await supabase
  //     .from("financial_transactions")
  //     .update(data)
  //     .eq("id", id)
  //     .select()
  //     .single();
  //   if (error) throw error;
  //   return transaction;
  // },
  // async delete(id: string) {
  //   const { error } = await supabase.from("financial_transactions").delete().eq("id", id);
  //   if (error) throw error;
  // },
  // async getById(id: string) {
  //   const { data: transaction, error } = await supabase
  //     .from("financial_transactions")
  //     .select(
  //       `
  //       *,
  //       bank_account:bank_accounts(*)
  //     `
  //     )
  //     .eq("id", id)
  //     .single();
  //   if (error) throw error;
  //   return transaction;
  // },
  // async list(
  //   companyId: string,
  //   filters?: {
  //     type?: TransactionType;
  //     status?: TransactionStatus;
  //     startDate?: string;
  //     endDate?: string;
  //     bankAccountId?: string;
  //   }
  // ) {
  //   let query = supabase
  //     .from("financial_transactions")
  //     .select(
  //       `
  //       *,
  //       bank_account:bank_accounts(*)
  //     `
  //     )
  //     .eq("company_id", companyId);
  //   if (filters?.type) {
  //     query = query.eq("type", filters.type);
  //   }
  //   if (filters?.status) {
  //     query = query.eq("status", filters.status);
  //   }
  //   if (filters?.startDate) {
  //     query = query.gte("due_date", filters.startDate);
  //   }
  //   if (filters?.endDate) {
  //     query = query.lte("due_date", filters.endDate);
  //   }
  //   if (filters?.bankAccountId) {
  //     query = query.eq("bank_account_id", filters.bankAccountId);
  //   }
  //   const { data: transactions, error } = await query.order("due_date", { ascending: true });
  //   if (error) throw error;
  //   return transactions;
  // },
  // async getBalance(companyId: string) {
  //   const { data: transactions, error } = await supabase
  //     .from("financial_transactions")
  //     .select()
  //     .eq("company_id", companyId)
  //     .eq("status", "paid");
  //   if (error) throw error;
  //   return transactions.reduce((acc, curr) => {
  //     if (curr.type === "income") {
  //       return acc + curr.amount;
  //     } else {
  //       return acc - curr.amount;
  //     }
  //   }, 0);
  // },
};

// Orçamentos
export const budgetService = {
  // async create(data: Omit<Budget, "id" | "created_at">) {
  //   const { data: budget, error } = await supabase.from("budgets").insert(data).select().single();
  //   if (error) throw error;
  //   return budget;
  // },
  // async update(id: string, data: Partial<Budget>) {
  //   const { data: budget, error } = await supabase.from("budgets").update(data).eq("id", id).select().single();
  //   if (error) throw error;
  //   return budget;
  // },
  // async delete(id: string) {
  //   const { error } = await supabase.from("budgets").delete().eq("id", id);
  //   if (error) throw error;
  // },
  // async getById(id: string) {
  //   const { data: budget, error } = await supabase.from("budgets").select().eq("id", id).single();
  //   if (error) throw error;
  //   return budget;
  // },
  // async list(companyId: string, year?: number, month?: number) {
  //   let query = supabase.from("budgets").select().eq("company_id", companyId);
  //   if (year) {
  //     query = query.eq("year", year);
  //   }
  //   if (month) {
  //     query = query.eq("month", month);
  //   }
  //   const { data: budgets, error } = await query
  //     .order("year", { ascending: false })
  //     .order("month", { ascending: false });
  //   if (error) throw error;
  //   return budgets;
  // },
};
