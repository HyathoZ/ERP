import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function LabelExample() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Label padrão */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input type="text" id="name" placeholder="Digite seu nome" />
      </div>

      {/* Label com campo opcional */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="bio" optional>
          Biografia
        </Label>
        <Input type="text" id="bio" placeholder="Conte um pouco sobre você" />
      </div>

      {/* Label com erro */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email" variant="error">
          Email
        </Label>
        <Input type="email" id="email" placeholder="Digite seu email" error />
      </div>

      {/* Label com campo desabilitado */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="disabled">Campo Desabilitado</Label>
        <Input type="text" id="disabled" placeholder="Este campo está desabilitado" disabled />
      </div>

      {/* Label com campo obrigatório */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="required">
          Campo Obrigatório <span className="text-red-500">*</span>
        </Label>
        <Input type="text" id="required" placeholder="Este campo é obrigatório" />
      </div>
    </div>
  );
}
