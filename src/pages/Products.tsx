import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "../services/supabase";
// import type { Product } from "../services/supabase";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  // const { data: products, isLoading } = useQuery<Product[]>({
  //   queryKey: ["products"],
  //   queryFn: async () => {
  //     const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  //     if (error) throw error;
  //     return data;
  //   },
  // });

  // const filteredProducts = products?.filter(
  //   (product) =>
  //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.description.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          Novo Produto
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar produtos..."
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
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* {filteredProducts?.map((product) => (
                <tr key={product.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{product.stock}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Editar</button>
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
