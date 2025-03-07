import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Paper } from "@mui/material";
import { AttachMoney, ShoppingCart, Build, Warning } from "@mui/icons-material";
import { api } from "../../services/api";
import { formatCurrency } from "../../utils/format";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  totalServiceOrders: number;
  lowStockProducts: number;
  recentSales: {
    labels: string[];
    data: number[];
  };
  serviceOrdersByStatus: {
    labels: string[];
    data: number[];
  };
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    totalSales: 0,
    totalOrders: 0,
    totalServiceOrders: 0,
    lowStockProducts: 0,
    recentSales: {
      labels: [],
      data: [],
    },
    serviceOrdersByStatus: {
      labels: [],
      data: [],
    },
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get("/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const InfoCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const salesChartData = {
    labels: data.recentSales.labels,
    datasets: [
      {
        label: "Vendas",
        data: data.recentSales.data,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const serviceOrdersChartData = {
    labels: data.serviceOrdersByStatus.labels,
    datasets: [
      {
        label: "Ordens de Serviço por Status",
        data: data.serviceOrdersByStatus.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Total de Vendas"
            value={formatCurrency(data.totalSales)}
            icon={<AttachMoney color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard title="Pedidos" value={data.totalOrders} icon={<ShoppingCart color="info" />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Ordens de Serviço"
            value={data.totalServiceOrders}
            icon={<Build color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Produtos com Estoque Baixo"
            value={data.lowStockProducts}
            icon={<Warning color="warning" />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Vendas Recentes
            </Typography>
            <Line
              data={salesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
              }}
              height={300}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ordens de Serviço por Status
            </Typography>
            <Bar
              data={serviceOrdersChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
              }}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
