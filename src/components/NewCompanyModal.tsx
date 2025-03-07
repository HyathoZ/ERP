import { useState } from "react";
import { X } from "lucide-react";
import { api } from "../lib/api";
import type { PlanType } from "../types";

interface NewCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CompanyData) => void;
}

interface CompanyData {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
}

export function NewCompanyModal({
  isOpen,
  onClose,
  onSuccess,
}: NewCompanyModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<PlanType>("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      companyName: formData.get("companyName"),
      plan: formData.get("plan") as PlanType,
    };

    try {
      const response = await api.post("/api/companies", data);
      onSuccess(response.data);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Erro ao criar empresa");
      } else {
        setError("Erro ao criar empresa");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-card-foreground">
            Nova Empresa
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-accent"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-card-foreground"
            >
              Nome da Empresa
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Nome da empresa"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-card-foreground"
            >
              Email do Administrador
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="admin@empresa.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-card-foreground"
            >
              Senha do Administrador
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="plan"
              className="text-sm font-medium text-card-foreground"
            >
              Plano
            </label>
            <select
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value as PlanType)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="basic">Básico (5 usuários)</option>
              <option value="professional">Profissional (10 usuários)</option>
              <option value="enterprise">Empresarial (20 usuários)</option>
            </select>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-input px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Criando..." : "Criar Empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
