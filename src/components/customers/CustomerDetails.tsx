import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CustomerType, CustomerStatus } from "../../types/prisma";
import { Edit, Trash, UserCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: CustomerType;
  status: CustomerStatus;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  _count: {
    orders: number;
    opportunities: number;
    interactions: number;
  };
}

export function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  async function loadCustomer() {
    try {
      setLoading(true);
      const { data } = await api.get<{ data: Customer }>(`/sales/customers/${id}`);
      setCustomer(data.data);
    } catch (error) {
      console.error("Erro ao carregar cliente:", error);
      toast.error("Erro ao carregar cliente. Tente novamente.");
      navigate("/customers");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/sales/customers/${id}`);
      toast.success("Cliente excluído com sucesso!");
      navigate("/customers");
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente. Tente novamente.");
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserCircle className="w-12 h-12 text-muted-foreground" />
          <div>
            <h2 className="text-2xl font-bold">{customer.name}</h2>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/customers/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Cliente</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-sm font-medium">Tipo</div>
              <div>{customer.type === CustomerType.INDIVIDUAL ? "Pessoa Física" : "Pessoa Jurídica"}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Documento</div>
              <div>{customer.document}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Telefone</div>
              <div>{customer.phone}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Status</div>
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-sm font-medium">Logradouro</div>
              <div>{customer.address}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Cidade</div>
              <div>{customer.city}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Estado</div>
              <div>{customer.state}</div>
            </div>
            <div>
              <div className="text-sm font-medium">CEP</div>
              <div>{customer.zipCode}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-sm font-medium">Pedidos</div>
              <div>{customer._count.orders}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Oportunidades</div>
              <div>{customer._count.opportunities}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Interações</div>
              <div>{customer._count.interactions}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="interactions">Interações</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">{/* TODO: Implementar listagem de pedidos */}</TabsContent>
        <TabsContent value="opportunities">{/* TODO: Implementar listagem de oportunidades */}</TabsContent>
        <TabsContent value="interactions">{/* TODO: Implementar listagem de interações */}</TabsContent>
      </Tabs>
    </div>
  );
}
