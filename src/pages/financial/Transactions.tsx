import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string;
  date: string;
  category: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  account: {
    id: string;
    name: string;
  };
};

const transactionTypeLabels = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
  TRANSFER: "Transferência",
};

const transactionStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function Transactions() {
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date().setDate(1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions", dateRange],
    queryFn: async () => {
      const response = await api.get<Transaction[]>(
        `/financial/transactions?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      if (response.error) throw new Error(response.error.message);
      return response.data || [];
    },
  });

  const totals = transactions?.reduce(
    (acc, transaction) => {
      if (transaction.type === "INCOME") {
        acc.income += transaction.amount;
      } else if (transaction.type === "EXPENSE") {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transações</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          Nova Transação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Receitas</h3>
          <p className="text-2xl font-semibold text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totals?.income || 0)}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Despesas</h3>
          <p className="text-2xl font-semibold text-red-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totals?.expense || 0)}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Saldo</h3>
          <p
            className={`text-2xl font-semibold ${
              (totals?.income || 0) - (totals?.expense || 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format((totals?.income || 0) - (totals?.expense || 0))}
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Data Inicial</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Final</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Data</th>
                <th className="text-left p-4">Descrição</th>
                <th className="text-left p-4">Categoria</th>
                <th className="text-left p-4">Conta</th>
                <th className="text-left p-4">Tipo</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}</td>
                  <td className="p-4">{transaction.description}</td>
                  <td className="p-4">{transaction.category}</td>
                  <td className="p-4">{transaction.account.name}</td>
                  <td className="p-4">{transactionTypeLabels[transaction.type]}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${transactionStatusColors[transaction.status]}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(transaction.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
