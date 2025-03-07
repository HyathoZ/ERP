import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type PayableReceivable = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  category: string;
  account: {
    id: string;
    name: string;
  };
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  PENDING: "Pendente",
  PAID: "Pago",
  OVERDUE: "Vencido",
  CANCELLED: "Cancelado",
};

export function PayablesReceivables() {
  const [activeTab, setActiveTab] = useState<"payables" | "receivables">("payables");

  const { data: payables, isLoading: isLoadingPayables } = useQuery<PayableReceivable[]>({
    queryKey: ["payables"],
    queryFn: async () => {
      const response = await api.get<PayableReceivable[]>("/financial/payables");
      if (response.error) throw new Error(response.error.message);
      return response.data || [];
    },
  });

  const { data: receivables, isLoading: isLoadingReceivables } = useQuery<PayableReceivable[]>({
    queryKey: ["receivables"],
    queryFn: async () => {
      const response = await api.get<PayableReceivable[]>("/financial/receivables");
      if (response.error) throw new Error(response.error.message);
      return response.data || [];
    },
  });

  const totals = {
    payables: payables?.reduce((total, item) => total + item.amount, 0) || 0,
    receivables: receivables?.reduce((total, item) => total + item.amount, 0) || 0,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Contas a Pagar e Receber</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          Nova Conta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total a Pagar</h3>
          <p className="text-2xl font-semibold text-red-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totals.payables)}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total a Receber</h3>
          <p className="text-2xl font-semibold text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totals.receivables)}
          </p>
        </div>
      </div>

      <div className="flex border-b space-x-1">
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium ${
            activeTab === "payables"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("payables")}
        >
          Contas a Pagar
        </button>
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium ${
            activeTab === "receivables"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("receivables")}
        >
          Contas a Receber
        </button>
      </div>

      {(activeTab === "payables" && isLoadingPayables) || (activeTab === "receivables" && isLoadingReceivables) ? (
        <div>Carregando...</div>
      ) : (
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Vencimento</th>
                <th className="text-left p-4">Descrição</th>
                <th className="text-left p-4">Categoria</th>
                <th className="text-left p-4">Conta</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Valor</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "payables" ? payables : receivables)?.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{format(new Date(item.dueDate), "dd/MM/yyyy", { locale: ptBR })}</td>
                  <td className="p-4">{item.description}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">{item.account.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={activeTab === "payables" ? "text-red-600" : "text-green-600"}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.amount)}
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
