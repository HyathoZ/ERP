import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CustomerType, CustomerStatus } from "../../types/prisma";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: CustomerType;
  status: CustomerStatus;
  _count: {
    orders: number;
    opportunities: number;
    interactions: number;
  };
}

export function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<CustomerType | "">("");
  const [status, setStatus] = useState<CustomerStatus | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, [search, type, status]);

  async function loadCustomers() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (type) params.append("type", type);
      if (status) params.append("status", status);

      const { data } = await api.get<{ data: Customer[] }>("/sales/customers", { params });
      setCustomers(data.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <Button onClick={() => navigate("/customers/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome, email ou documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select value={type} onValueChange={(value) => setType(value as CustomerType | "")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value={CustomerType.INDIVIDUAL}>Pessoa Física</SelectItem>
            <SelectItem value={CustomerType.COMPANY}>Pessoa Jurídica</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value as CustomerStatus | "")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value={CustomerStatus.ACTIVE}>Ativo</SelectItem>
            <SelectItem value={CustomerStatus.INACTIVE}>Inativo</SelectItem>
            <SelectItem value={CustomerStatus.BLOCKED}>Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Oportunidades</TableHead>
              <TableHead>Interações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.type === CustomerType.INDIVIDUAL ? "Pessoa Física" : "Pessoa Jurídica"}
                  </TableCell>
                  <TableCell>{customer.document}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === CustomerStatus.ACTIVE
                          ? "bg-green-100 text-green-800"
                          : customer.status === CustomerStatus.INACTIVE
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.status === CustomerStatus.ACTIVE
                        ? "Ativo"
                        : customer.status === CustomerStatus.INACTIVE
                        ? "Inativo"
                        : "Bloqueado"}
                    </div>
                  </TableCell>
                  <TableCell>{customer._count.orders}</TableCell>
                  <TableCell>{customer._count.opportunities}</TableCell>
                  <TableCell>{customer._count.interactions}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
