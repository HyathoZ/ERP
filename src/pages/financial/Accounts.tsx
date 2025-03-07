import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";

type Account = {
  id: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "INVESTMENT" | "CASH";
  balance: number;
  bankName?: string;
  bankBranch?: string;
  bankAccount?: string;
  _count: {
    transactions: number;
    payables: number;
    receivables: number;
  };
};

const accountTypeLabels = {
  CHECKING: "Conta Corrente",
  SAVINGS: "Poupança",
  INVESTMENT: "Investimento",
  CASH: "Dinheiro",
};

export function Accounts() {
  const [isCreating, setIsCreating] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "CHECKING" as const,
    bankName: "",
    bankBranch: "",
    bankAccount: "",
  });

  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await api.get<Account[]>("/financial/accounts");
      if (response.error) throw new Error(response.error.message);
      return response.data || [];
    },
  });

  const handleCreateAccount = async () => {
    try {
      const response = await api.post("/financial/accounts", newAccount);
      if (response.error) throw new Error(response.error.message);
      setIsCreating(false);
      setNewAccount({
        name: "",
        type: "CHECKING",
        bankName: "",
        bankBranch: "",
        bankAccount: "",
      });
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Contas</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Nova Conta
        </button>
      </div>

      {isCreating && (
        <div className="bg-card p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Nova Conta</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={newAccount.type}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    type: e.target.value as "CHECKING" | "SAVINGS" | "INVESTMENT" | "CASH",
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                {Object.entries(accountTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {newAccount.type !== "CASH" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Banco</label>
                  <input
                    type="text"
                    value={newAccount.bankName}
                    onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Agência</label>
                  <input
                    type="text"
                    value={newAccount.bankBranch}
                    onChange={(e) => setNewAccount({ ...newAccount, bankBranch: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Conta</label>
                  <input
                    type="text"
                    value={newAccount.bankAccount}
                    onChange={(e) => setNewAccount({ ...newAccount, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsCreating(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">
              Cancelar
            </button>
            <button
              onClick={handleCreateAccount}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts?.map((account) => (
            <div key={account.id} className="bg-card p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{account.name}</h3>
                <span className="text-sm text-muted-foreground">{accountTypeLabels[account.type]}</span>
              </div>
              <div className="text-2xl font-semibold mb-4">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(account.balance)}
              </div>
              {account.type !== "CASH" && (
                <div className="text-sm text-muted-foreground">
                  <p>{account.bankName}</p>
                  <p>
                    Ag: {account.bankBranch} | CC: {account.bankAccount}
                  </p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="font-medium">{account._count.transactions}</p>
                  <p className="text-muted-foreground">Transações</p>
                </div>
                <div>
                  <p className="font-medium">{account._count.payables}</p>
                  <p className="text-muted-foreground">A Pagar</p>
                </div>
                <div>
                  <p className="font-medium">{account._count.receivables}</p>
                  <p className="text-muted-foreground">A Receber</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
