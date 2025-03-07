import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export function MessagesExample() {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const showSuccessToast = () => {
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Operação concluída</span>
        </div>
      ),
      description: "Os dados foram salvos com sucesso.",
    });
  };

  const showErrorToast = () => {
    toast({
      variant: "destructive",
      title: (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Erro</span>
        </div>
      ),
      description: "Não foi possível completar a operação. Tente novamente.",
    });
  };

  const showWarningToast = () => {
    toast({
      variant: "warning",
      title: (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Atenção</span>
        </div>
      ),
      description: "Você tem alterações não salvas.",
    });
  };

  const showInfoToast = () => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>Informação</span>
        </div>
      ),
      description: "Uma nova atualização está disponível.",
    });
  };

  const handleDelete = () => {
    // Simula a exclusão
    setTimeout(() => {
      setIsDeleteDialogOpen(false);
      toast({
        variant: "success",
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Item excluído</span>
          </div>
        ),
        description: "O item foi excluído permanentemente.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Exemplos de Toast */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mensagens Toast</h3>
        <div className="flex flex-wrap gap-4">
          <Button onClick={showSuccessToast}>Mostrar Sucesso</Button>
          <Button onClick={showErrorToast} variant="destructive">
            Mostrar Erro
          </Button>
          <Button onClick={showWarningToast} variant="warning">
            Mostrar Aviso
          </Button>
          <Button onClick={showInfoToast} variant="outline">
            Mostrar Info
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Modal de Confirmação</h3>
        <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
          Excluir Item
        </Button>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
  );
}
