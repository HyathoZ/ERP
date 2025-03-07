import React from "react";
import { DollarSign, Users, Package, TrendingUp, Bell, RefreshCw } from "lucide-react";
import { useDashboard } from "../contexts/DashboardContext";
import { formatCurrency } from "../utils/format";

interface MetricCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    trend: "up" | "down";
  };
  icon: React.ReactNode;
  loading?: boolean;
}

function MetricCard({ title, value, change, icon, loading }: MetricCardProps) {
  const trendColor = change.trend === "up" ? "text-green-500" : "text-red-500";

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
            <div className="h-8 w-32 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-28 animate-pulse rounded bg-muted"></div>
          </div>
          <div className="rounded-full bg-muted p-3">
            <div className="h-6 w-6 animate-pulse rounded bg-muted-foreground/20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
          <p className={`mt-2 text-sm ${trendColor}`}>{change.value} desde o último mês</p>
        </div>
        <div className="rounded-full bg-muted p-3">{icon}</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { metrics, loading, error, refreshMetrics } = useDashboard();

  const handleRefresh = () => {
    refreshMetrics();
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h1>
          <p className="text-muted-foreground">Painel de Controle</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="relative rounded-full bg-muted p-2 hover:bg-accent"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button className="relative rounded-full bg-muted p-2 hover:bg-accent">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {metrics.pendingOrders + metrics.pendingPayments}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* Resumo do Dia */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-medium">Resumo do Dia</h2>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            • {metrics.pendingOrders} novos pedidos precisam de sua atenção
          </p>
          <p className="text-sm text-muted-foreground">• {metrics.pendingPayments} pagamentos estão pendentes</p>
          <p className="text-sm text-muted-foreground">• {metrics.lowStockProducts} produtos estão com estoque baixo</p>
        </div>
      </div>

      {/* Métricas */}
      <div>
        <h2 className="mb-4 text-lg font-medium">Métricas Principais</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Vendas Totais"
            value={formatCurrency(metrics.totalSales)}
            change={{ value: "+12.5%", trend: "up" }}
            icon={<DollarSign className="h-6 w-6" />}
            loading={loading}
          />
          <MetricCard
            title="Clientes Ativos"
            value={metrics.activeCustomers.toString()}
            change={{ value: "+5.2%", trend: "up" }}
            icon={<Users className="h-6 w-6" />}
            loading={loading}
          />
          <MetricCard
            title="Produtos em Estoque"
            value={metrics.productsInStock.toString()}
            change={{ value: "-2.1%", trend: "down" }}
            icon={<Package className="h-6 w-6" />}
            loading={loading}
          />
          <MetricCard
            title="Média de Vendas"
            value={formatCurrency(metrics.averageSales)}
            change={{ value: "+8.1%", trend: "up" }}
            icon={<TrendingUp className="h-6 w-6" />}
            loading={loading}
          />
        </div>
      </div>

      {/* Gráficos e Listas */}
      <div>
        <h2 className="mb-4 text-lg font-medium">Análises</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="text-lg font-medium">Vendas Recentes</h3>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Em breve: Gráfico de vendas recentes...</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="text-lg font-medium">Produtos Mais Vendidos</h3>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Em breve: Lista de produtos mais vendidos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
