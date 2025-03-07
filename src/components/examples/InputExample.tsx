import { Input } from "@/components/ui/input";
import { Search, Mail, Lock, User, Calendar, CreditCard, Phone } from "lucide-react";

export function InputExample() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Input padrão */}
      <div className="grid gap-4">
        <Input placeholder="Digite algo..." />
        <Input placeholder="Desabilitado" disabled />
        <Input placeholder="Com erro" error />
      </div>

      {/* Inputs com ícones */}
      <div className="grid gap-4">
        <Input placeholder="Pesquisar..." icon={<Search className="h-4 w-4" />} />
        <Input type="email" placeholder="Email" icon={<Mail className="h-4 w-4" />} />
        <Input type="password" placeholder="Senha" icon={<Lock className="h-4 w-4" />} />
      </div>

      {/* Inputs para formulários */}
      <div className="grid gap-4">
        <Input placeholder="Nome completo" icon={<User className="h-4 w-4" />} />
        <Input type="date" placeholder="Data de nascimento" icon={<Calendar className="h-4 w-4" />} />
        <Input type="tel" placeholder="Telefone" icon={<Phone className="h-4 w-4" />} />
        <Input placeholder="Número do cartão" icon={<CreditCard className="h-4 w-4" />} />
      </div>

      {/* Inputs com erro e ícone */}
      <div className="grid gap-4">
        <Input placeholder="Email inválido" icon={<Mail className="h-4 w-4" />} error />
        <Input type="password" placeholder="Senha inválida" icon={<Lock className="h-4 w-4" />} error />
      </div>
    </div>
  );
}
