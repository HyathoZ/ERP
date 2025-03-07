import { Button } from "@/components/ui/button";
import { Save, Trash2, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export function ButtonExample() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Botões com diferentes variantes */}
        <Button>Padrão</Button>
        <Button variant="secondary">Secundário</Button>
        <Button variant="outline">Contorno</Button>
        <Button variant="ghost">Fantasma</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Botões com diferentes tamanhos */}
        <Button size="sm">Pequeno</Button>
        <Button>Médio</Button>
        <Button size="lg">Grande</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Botões com ícones */}
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
        <Button variant="warning">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Atenção
        </Button>
        <Button variant="success">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Concluído
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Botões com estados */}
        <Button disabled>Desabilitado</Button>
        <Button loading>Carregando</Button>
        <Button variant="outline" loading>
          Processando
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Botões de ícone */}
        <Button size="icon" variant="ghost">
          <Save className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline">
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button size="icon">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    </div>
  );
}
