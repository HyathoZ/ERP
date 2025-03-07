import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, DollarSign, Package, ShoppingCart, Users } from "lucide-react";

interface Transaction {
  id: number;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  description: string;
  date: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    amount: 350.0,
    status: "completed",
    description: "Pagamento de fatura",
    date: "2024-03-20",
  },
  {
    id: 2,
    amount: 150.0,
    status: "pending",
    description: "Transferência bancária",
    date: "2024-03-20",
  },
  {
    id: 3,
    amount: 450.0,
    status: "processing",
    description: "Pagamento de fornecedor",
    date: "2024-03-19",
  },
  {
    id: 4,
    amount: 550.0,
    status: "failed",
    description: "Tentativa de pagamento",
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
    key: "description" as const,
    header: "Descrição",
  },
  {
    key: "amount" as const,
    header: "Valor",
    cell: (transaction: Transaction) => formatCurrency(transaction.amount),
    className: "text-right",
  },
  {
    key: "status" as const,
    header: "Status",
    cell: (transaction: Transaction) => {
      const statusConfig = {
        pending: {
          label: "Pendente",
          variant: "default" as const,
          icon: AlertTriangle,
        },
        processing: {
          label: "Processando",
          variant: "secondary" as const,
          icon: AlertCircle,
        },
        completed: {
          label: "Concluído",
          variant: "outline" as const,
          icon: CheckCircle2,
        },
        failed: {
          label: "Falhou",
          variant: "destructive" as const,
          icon: AlertCircle,
        },
      };

      const config = statusConfig[transaction.status];
      const Icon = config.icon;

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      );
    },
  },
  {
    key: "date" as const,
    header: "Data",
    cell: (transaction: Transaction) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
];

export function ComplexTabsExample() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="analytics">Análise</TabsTrigger>
        <TabsTrigger value="reports">Relatórios</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>

      {/* Aba de Visão Geral */}
      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(45231.89)}</div>
              <p className="text-xs text-gray-500">+20.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-gray-500">+180.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-gray-500">+19% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-gray-500">+201 em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Aba de Análise */}
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Transações</CardTitle>
            <CardDescription>Lista de transações recentes do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={transactions}
              columns={columns}
              pageSize={5}
              onRowClick={(transaction) => {
                alert(`Transação #${transaction.id} selecionada`);
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Aba de Relatórios */}
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Gerar Relatório</CardTitle>
            <CardDescription>Crie um relatório personalizado com os dados do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome do Relatório</Label>
              <Input id="name" placeholder="Digite o nome do relatório" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="date">Data</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" id="start-date" placeholder="Data inicial" />
                <Input type="date" id="end-date" placeholder="Data final" />
              </div>
            </div>
            <Button>Gerar Relatório</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Aba de Notificações */}
      <TabsContent value="notifications" className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informação</AlertTitle>
          <AlertDescription>Você tem 3 novas notificações não lidas.</AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alerta de Pagamento</AlertTitle>
          <AlertDescription>Uma transação de R$ 550,00 falhou. Verifique os detalhes.</AlertDescription>
        </Alert>

        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Pagamento Recebido</AlertTitle>
          <AlertDescription>Você recebeu um novo pagamento de R$ 350,00.</AlertDescription>
        </Alert>
      </TabsContent>
    </Tabs>
  );
}
