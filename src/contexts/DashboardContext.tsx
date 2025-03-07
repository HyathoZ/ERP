import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

interface DashboardMetrics {
  totalSales: number;
  activeCustomers: number;
  productsInStock: number;
  averageSales: number;
  pendingOrders: number;
  pendingPayments: number;
  lowStockProducts: number;
}

interface DashboardContextData {
  metrics: DashboardMetrics;
  loading: boolean;
  error: string | null;
  refreshMetrics: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextData>({} as DashboardContextData);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSales: 0,
    activeCustomers: 0,
    productsInStock: 0,
    averageSales: 0,
    pendingOrders: 0,
    pendingPayments: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulando chamada à API
      // TODO: Substituir por chamadas reais quando a API estiver pronta
      const response = await api.get("/dashboard/metrics");
      setMetrics(response.data);
    } catch (err) {
      setError("Erro ao carregar métricas do dashboard");
      console.error("Erro ao carregar métricas:", err);

      // Dados mockados para desenvolvimento
      setMetrics({
        totalSales: 45231.89,
        activeCustomers: 2300,
        productsInStock: 1200,
        averageSales: 1520.0,
        pendingOrders: 5,
        pendingPayments: 3,
        lowStockProducts: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMetrics();
  }, []);

  return (
    <DashboardContext.Provider value={{ metrics, loading, error, refreshMetrics }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard deve ser usado dentro de um DashboardProvider");
  }
  return context;
}
