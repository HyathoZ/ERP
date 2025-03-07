import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export function AlertExample() {
  return (
    <div className="space-y-4">
      {/* Alerta padrão */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Informação</AlertTitle>
        <AlertDescription>
          Este é um alerta informativo padrão. Use-o para mensagens gerais do sistema.
        </AlertDescription>
      </Alert>

      {/* Alerta de sucesso */}
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Sucesso</AlertTitle>
        <AlertDescription>Operação realizada com sucesso! Os dados foram salvos corretamente.</AlertDescription>
      </Alert>

      {/* Alerta de aviso */}
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>Você tem alterações não salvas. Certifique-se de salvar antes de sair.</AlertDescription>
      </Alert>

      {/* Alerta de erro */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.</AlertDescription>
      </Alert>

      {/* Alerta com conteúdo personalizado */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Atualização do Sistema</AlertTitle>
        <AlertDescription>
          <p>Uma nova versão do sistema está disponível. As principais atualizações incluem:</p>
          <ul className="mt-2 list-inside list-disc">
            <li>Melhorias de desempenho</li>
            <li>Correções de bugs</li>
            <li>Novos recursos de relatórios</li>
          </ul>
          <p className="mt-2 text-sm text-gray-500">Atualize seu sistema para aproveitar as últimas melhorias.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
