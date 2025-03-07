import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Order {
  id: number;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
}

const orders: Order[] = [
  {
    id: 1,
    customer: "João Silva",
    product: "Notebook Dell XPS",
    amount: 8999.99,
    status: "completed",
    date: "2024-03-20",
  },
  {
    id: 2,
    customer: "Maria Santos",
    product: "iPhone 15 Pro",
    amount: 9899.99,
    status: "pending",
    date: "2024-03-20",
  },
  {
    id: 3,
    customer: "Pedro Oliveira",
    product: 'Monitor LG 27"',
    amount: 1599.99,
    status: "processing",
    date: "2024-03-19",
  },
];

const columns = [
  {
    key: "id" as const,
    header: "ID",
    className: "w-[80px]",
  },
  {
    key: "customer" as const,
    header: "Cliente",
  },
  {
    key: "product" as const,
    header: "Produto",
  },
  {
    key: "amount" as const,
    header: "Valor",
    cell: (order: Order) => formatCurrency(order.amount),
    className: "text-right",
  },
  {
    key: "status" as const,
    header: "Status",
    cell: (order: Order) => {
      const statusConfig = {
        pending: {
          label: "Pendente",
          variant: "default" as const,
        },
        processing: {
          label: "Em processamento",
          variant: "secondary" as const,
        },
        completed: {
          label: "Concluído",
          variant: "outline" as const,
        },
        cancelled: {
          label: "Cancelado",
          variant: "destructive" as const,
        },
      };

      const config = statusConfig[order.status];

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    key: "date" as const,
    header: "Data",
    cell: (order: Order) =>
      new Date(order.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
];

export function TabsExample() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="orders">Pedidos</TabsTrigger>
        <TabsTrigger value="settings">Configurações</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(20499.97)}</div>
              <p className="text-xs text-gray-500">+20.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+3</div>
              <p className="text-xs text-gray-500">+10.5% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12</div>
              <p className="text-xs text-gray-500">+19.5% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+145</div>
              <p className="text-xs text-gray-500">+6.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="orders" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>Lista dos pedidos mais recentes realizados na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={orders}
              columns={columns}
              pageSize={5}
              onRowClick={(order) => {
                alert(`Pedido #${order.id} selecionado`);
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Gerencie suas preferências e configurações do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">Conteúdo das configurações em desenvolvimento...</div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
