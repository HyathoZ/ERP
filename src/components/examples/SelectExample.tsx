import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectExample() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Select simples */}
      <Select>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Selecione um status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="processing">Em processamento</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Select com label e grupos */}
      <Select>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Selecione um departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Comercial</SelectLabel>
            <SelectItem value="sales">Vendas</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="customer-service">Atendimento</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Técnico</SelectLabel>
            <SelectItem value="development">Desenvolvimento</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="qa">Qualidade</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Administrativo</SelectLabel>
            <SelectItem value="finance">Financeiro</SelectItem>
            <SelectItem value="hr">Recursos Humanos</SelectItem>
            <SelectItem value="legal">Jurídico</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Select com erro */}
      <Select>
        <SelectTrigger className="w-[280px]" error>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="option1">Opção 1</SelectItem>
            <SelectItem value="option2">Opção 2</SelectItem>
            <SelectItem value="option3">Opção 3</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Select desabilitado */}
      <Select disabled>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="option1">Opção 1</SelectItem>
            <SelectItem value="option2">Opção 2</SelectItem>
            <SelectItem value="option3">Opção 3</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
