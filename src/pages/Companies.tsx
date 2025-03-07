import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import type { Company, Plan } from "../services/supabase";
import { NewCompanyModal } from "../components/NewCompanyModal";

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: companies, isLoading: isLoadingCompanies } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: plans } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plans").select("*").order("price", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ companyId, plan, active }: { companyId: string; plan: string; active: boolean }) => {
      const { error } = await supabase.from("companies").update({ plan, active }).eq("id", companyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-card-foreground">Gerenciamento de Empresas</h1>
        <button
          onClick={() => setIsNewCompanyModalOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Nova Empresa
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar empresas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-card-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {isLoadingCompanies ? (
        <div>Carregando...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Usuários
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Expira em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filteredCompanies?.map((company) => (
                <tr key={company.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-card-foreground">{company.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <select
                      value={company.plan}
                      onChange={(e) =>
                        updateCompanyMutation.mutate({
                          companyId: company.id,
                          plan: e.target.value,
                          active: company.active,
                        })
                      }
                      className="rounded-md border border-input bg-background px-2 py-1 text-sm text-card-foreground"
                    >
                      {plans?.map((plan) => (
                        <option key={plan.id} value={plan.type}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      onClick={() =>
                        updateCompanyMutation.mutate({
                          companyId: company.id,
                          plan: company.plan,
                          active: !company.active,
                        })
                      }
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        company.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {company.active ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-card-foreground">
                      {company.current_users} / {company.max_users}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(company.expires_at).toLocaleDateString("pt-BR")}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="text-sm font-medium text-primary hover:text-primary/90">Gerenciar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewCompanyModal isOpen={isNewCompanyModalOpen} onClose={() => setIsNewCompanyModalOpen(false)} />
    </div>
  );
}
