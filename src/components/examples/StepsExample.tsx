import { useState } from "react";
import { Steps } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const steps = [
  {
    title: "Informações Pessoais",
    description: "Forneça seus dados básicos",
  },
  {
    title: "Endereço",
    description: "Informe seu endereço de entrega",
  },
  {
    title: "Pagamento",
    description: "Escolha a forma de pagamento",
  },
  {
    title: "Confirmação",
    description: "Revise e confirme seu pedido",
  },
];

export function StepsExample() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-8">
      <Steps steps={steps} currentStep={currentStep} />

      <Card>
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Preencha seus dados pessoais para continuar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" placeholder="Digite seu nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Digite seu email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" placeholder="Digite seu telefone" />
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Informe seu endereço de entrega.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input id="street" placeholder="Digite sua rua" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" placeholder="Nº" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="complement" optional>
                    Complemento
                  </Label>
                  <Input id="complement" placeholder="Apto, Bloco, etc." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" placeholder="Digite sua cidade" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" placeholder="Digite seu estado" />
                </div>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
              <CardDescription>Escolha sua forma de pagamento preferida.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment">Forma de Pagamento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit">Cartão de Débito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="installments">Parcelas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o número de parcelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x sem juros</SelectItem>
                    <SelectItem value="2">2x sem juros</SelectItem>
                    <SelectItem value="3">3x sem juros</SelectItem>
                    <SelectItem value="4">4x com juros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle>Confirmação</CardTitle>
              <CardDescription>Revise seus dados e confirme seu pedido.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Subtotal:</span>
                    <span className="text-sm">R$ 299,90</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Frete:</span>
                    <span className="text-sm">R$ 15,00</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-base font-medium">Total:</span>
                    <span className="text-base font-medium">R$ 314,90</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={previousStep} disabled={currentStep === 1}>
            Voltar
          </Button>
          <Button onClick={nextStep} disabled={currentStep === steps.length}>
            {currentStep === steps.length ? "Finalizar" : "Próximo"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
