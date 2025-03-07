import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "../services/supabase";
// import type { Order } from "../services/supabase";

// const statusColors = {
//   pending: "bg-yellow-100 text-yellow-800",
//   processing: "bg-blue-100 text-blue-800",
//   completed: "bg-green-100 text-green-800",
//   cancelled: "bg-red-100 text-red-800",
// };

// const statusLabels = {
//   pending: "Pendente",
//   processing: "Em Processamento",
//   completed: "Concluído",
//   cancelled: "Cancelado",
// };

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");

  // const { data: orders, isLoading } = useQuery<Order[]>({
  //   queryKey: ["orders"],
  //   queryFn: async () => {
  //     const { data, error } = await supabase
  //       .from("orders")
  //       .select("*, customer:customers(name)")
  //       .order("created_at", { ascending: false });

  //     if (error) throw error;
  //     return data;
  //   },
  // });

  // const filteredOrders = orders?.filter(
  //   (order) =>
  //     order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     order.id.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Pedidos</h1>
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          Novo Pedido
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* {isLoading ? (
        <div>Carregando...</div>
      ) : ( */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID do Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* {filteredOrders?.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{order.customer?.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.total)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Visualizar</button>
                  </td>
                </tr>
              ))} */}
          </tbody>
        </table>
      </div>
      {/* )} */}
    </div>
  );
}
