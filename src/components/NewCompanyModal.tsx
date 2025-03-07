import { useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import type { PlanType } from "../services/supabase";

interface NewCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewCompanyModal({ isOpen, onClose }: NewCompanyModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<PlanType>("basic");
  const queryClient = useQueryClient();

  const createCompanyMutation = useMutation({
    mutationFn: async () => {
      // 1. Criar usuário admin no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      // 2. Criar empresa
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([
          {
            name,
            plan,
            active: true,
            max_users: plan === "basic" ? 5 : plan === "professional" ? 10 : 20,
            current_users: 1,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
          },
        ])
        .select()
        .single();

      if (companyError) throw companyError;

      // 3. Criar usuário admin na tabela users
      const { error: userError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email,
          name: "Administrador",
          role: "admin",
          company_id: companyData.id,
        },
      ]);

      if (userError) throw userError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      onClose();
      setName("");
      setEmail("");
      setPassword("");
      setPlan("basic");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-card-foreground">Nova Empresa</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-accent">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCompanyMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-card-foreground">
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
            <label htmlFor="email" className="text-sm font-medium text-card-foreground">
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
            <label htmlFor="password" className="text-sm font-medium text-card-foreground">
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
            <label htmlFor="plan" className="text-sm font-medium text-card-foreground">
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

          {createCompanyMutation.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              Erro ao criar empresa. Tente novamente.
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
              disabled={createCompanyMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {createCompanyMutation.isPending ? "Criando..." : "Criar Empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
