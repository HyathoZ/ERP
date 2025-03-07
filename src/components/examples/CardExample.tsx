import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function CardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Card de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Hoje</CardTitle>
          <CardDescription>Resumo das vendas do dia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 12.450,00</div>
          <p className="text-xs text-gray-500">+20.1% em relação a ontem</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">Atualizado há 30 minutos</p>
        </CardFooter>
      </Card>

      {/* Card de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Pendentes</CardTitle>
          <CardDescription>Pedidos aguardando processamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-gray-500">5 pedidos urgentes</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">Atualizado há 5 minutos</p>
        </CardFooter>
      </Card>

      {/* Card de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Novos Clientes</CardTitle>
          <CardDescription>Clientes registrados hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-gray-500">+3 em relação a ontem</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">Atualizado há 15 minutos</p>
        </CardFooter>
      </Card>
    </div>
  );
}
