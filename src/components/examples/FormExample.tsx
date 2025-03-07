import { Form, FormField, FormDescription, FormMessage, FormActions } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, User, Phone, Building2 } from "lucide-react";

export function FormExample() {
  return (
    <Form className="w-full max-w-lg" onSubmit={(e) => e.preventDefault()}>
      {/* Campo de nome */}
      <FormField>
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" placeholder="Digite seu nome completo" icon={<User className="h-4 w-4" />} />
        <FormDescription>Digite seu nome completo como consta em seus documentos.</FormDescription>
      </FormField>

      {/* Campo de email */}
      <FormField>
        <Label htmlFor="email" variant="error">
          Email
        </Label>
        <Input id="email" type="email" placeholder="Digite seu email" icon={<Mail className="h-4 w-4" />} error />
        <FormMessage>Email inválido</FormMessage>
      </FormField>

      {/* Campo de telefone */}
      <FormField>
        <Label htmlFor="phone" optional>
          Telefone
        </Label>
        <Input id="phone" type="tel" placeholder="Digite seu telefone" icon={<Phone className="h-4 w-4" />} />
      </FormField>

      {/* Campo de departamento */}
      <FormField>
        <Label htmlFor="department">Departamento</Label>
        <Select>
          <SelectTrigger id="department" className="w-full">
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Vendas</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="engineering">Engenharia</SelectItem>
            <SelectItem value="hr">Recursos Humanos</SelectItem>
            <SelectItem value="finance">Financeiro</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>Selecione o departamento em que você trabalha.</FormDescription>
      </FormField>

      {/* Campo de empresa */}
      <FormField>
        <Label htmlFor="company">Empresa</Label>
        <Input id="company" placeholder="Digite o nome da empresa" icon={<Building2 className="h-4 w-4" />} disabled />
        <FormDescription>Este campo está bloqueado para edição.</FormDescription>
      </FormField>

      {/* Botões de ação */}
      <FormActions>
        <Button variant="ghost">Cancelar</Button>
        <Button type="submit">Salvar alterações</Button>
      </FormActions>
    </Form>
  );
}
