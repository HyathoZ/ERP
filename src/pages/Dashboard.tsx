import React from "react";
import { DollarSign, Users, Package, TrendingUp, Bell, RefreshCw } from "lucide-react";
import { useDashboard } from "../contexts/DashboardContext";
import { formatCurrency } from "../utils/format";
import { DashboardCard } from "../components/ui/dashboard-card";
import { DataTable } from "../components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

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

// Tipos
interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
}

// Colunas da tabela
const columns = [
  {
    accessorKey: "customer",
    header: "Cliente",
  },
  {
    accessorKey: "product",
    header: "Produto",
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center">
          <span
            className={`h-2 w-2 rounded-full mr-2 ${
              status === "completed"
                ? "bg-green-500"
                : status === "processing"
                ? "bg-yellow-500"
                : status === "pending"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString("pt-BR");
    },
  },
];

function Dashboard() {
  const { metrics, loading, error, refreshMetrics } = useDashboard();

  // Simulando chamadas à API
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get("/stats").then((res) => res.data),
    placeholderData: {
      revenue: 15780.45,
      revenueTrend: { value: 12.5, isPositive: true },
      customers: 142,
      customersTrend: { value: 8.2, isPositive: true },
      orders: 38,
      ordersTrend: { value: 2.3, isPositive: false },
      products: 93,
      productsTrend: { value: 5.1, isPositive: true },
    },
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => api.get("/recent-orders").then((res) => res.data),
    placeholderData: [
      {
        id: "1",
        customer: "João Silva",
        product: "Produto A",
        amount: 1250.0,
        status: "completed",
        date: "2024-03-07",
      },
      {
        id: "2",
        customer: "Maria Santos",
        product: "Produto B",
        amount: 750.5,
        status: "processing",
        date: "2024-03-06",
      },
      // Adicione mais pedidos de exemplo aqui
    ],
  });

  const handleRefresh = () => {
    refreshMetrics();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Receita Total"
          value={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(stats?.revenue || 0)}
          icon={<DollarSign />}
          trend={stats?.revenueTrend}
          loading={statsLoading}
        />
        <DashboardCard
          title="Total de Clientes"
          value={stats?.customers || 0}
          icon={<Users />}
          trend={stats?.customersTrend}
          loading={statsLoading}
        />
        <DashboardCard
          title="Pedidos do Mês"
          value={stats?.orders || 0}
          icon={<ShoppingCart />}
          trend={stats?.ordersTrend}
          loading={statsLoading}
        />
        <DashboardCard
          title="Produtos Ativos"
          value={stats?.products || 0}
          icon={<Package />}
          trend={stats?.productsTrend}
          loading={statsLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <h2 className="text-2xl font-bold mb-4">Pedidos Recentes</h2>
          <DataTable
            columns={columns}
            data={recentOrders || []}
            searchColumn="customer"
            searchPlaceholder="Buscar por cliente..."
          />
        </div>

        <div className="col-span-3">{/* Aqui você pode adicionar mais widgets, como gráficos ou listas */}</div>
      </div>
    </div>
  );
}

export default Dashboard;
