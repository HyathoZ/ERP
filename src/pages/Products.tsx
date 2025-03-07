import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Product } from "../types";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        setError("Erro ao carregar produtos" + err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Produtos</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border p-4">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>
              Preço: R$ 0,00
              {/* {product?.price}  */}
            </p>
            <p>
              Estoque: 0,00
              {/* {product?.stock} */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
