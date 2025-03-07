import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Sale {
  id: number;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
}

const data: Sale[] = [
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
  {
    id: 4,
    customer: "Ana Costa",
    product: "MacBook Pro M3",
    amount: 14999.99,
    status: "completed",
    date: "2024-03-19",
  },
  {
    id: 5,
    customer: "Lucas Ferreira",
    product: "iPad Air",
    amount: 5499.99,
    status: "cancelled",
    date: "2024-03-18",
  },
  {
    id: 6,
    customer: "Carla Souza",
    product: "AirPods Pro",
    amount: 1999.99,
    status: "completed",
    date: "2024-03-18",
  },
  {
    id: 7,
    customer: "Roberto Lima",
    product: "Samsung Galaxy S24",
    amount: 7999.99,
    status: "processing",
    date: "2024-03-17",
  },
  {
    id: 8,
    customer: "Fernanda Santos",
    product: "Apple Watch Series 9",
    amount: 4499.99,
    status: "pending",
    date: "2024-03-17",
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
    cell: (sale: Sale) => formatCurrency(sale.amount),
    className: "text-right",
  },
  {
    key: "status" as const,
    header: "Status",
    cell: (sale: Sale) => {
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

      const config = statusConfig[sale.status];

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    key: "date" as const,
    header: "Data",
    cell: (sale: Sale) =>
      new Date(sale.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
];

export function DataTableExample() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vendas Recentes</h2>
      </div>

      <DataTable
        data={data}
        columns={columns}
        pageSize={5}
        onRowClick={(sale) => {
          alert(`Venda #${sale.id} selecionada`);
        }}
      />
    </div>
  );
}
