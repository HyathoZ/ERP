import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Company, Plan } from "../types";
import { NewCompanyModal } from "../components/NewCompanyModal";

export function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [companiesResponse, plansResponse] = await Promise.all([
          api.get("/api/companies"),
          api.get("/api/plans"),
        ]);
        setCompanies(companiesResponse.data);
        setPlans(plansResponse.data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao carregar dados";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const updateCompanyStatus = async (
    companyId: string,
    active: boolean,
    plan: string
  ) => {
    try {
      await api.put(`/api/companies/${companyId}`, { active, plan });
      setCompanies(
        companies.map((company) =>
          company.id === companyId ? { ...company, active, plan } : company
        )
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar empresa";
      setError(message);
    }
  };

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-card-foreground">
          Gerenciamento de Empresas
        </h1>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies?.map((company) => (
          <div key={company.id} className="rounded-lg border p-4">
            <h2>{company.name}</h2>
            <p>Plano: {company.plan}</p>
            <p>Status: {company.active ? "Ativo" : "Inativo"}</p>
            <p>
              Usuários: {company.current_users}/{company.max_users}
            </p>
            <div className="mt-4">
              <select
                value={company.plan}
                onChange={(e) =>
                  updateCompanyStatus(
                    company.id,
                    company.active,
                    e.target.value
                  )
                }
                className="mr-2 rounded border p-1"
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.type}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  updateCompanyStatus(company.id, !company.active, company.plan)
                }
                className={`rounded px-2 py-1 ${
                  company.active
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {company.active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <NewCompanyModal
        isOpen={isNewCompanyModalOpen}
        onClose={() => setIsNewCompanyModalOpen(false)}
      />
    </div>
  );
}
