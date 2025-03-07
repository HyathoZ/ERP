import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Customer } from "../types";

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await api.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao carregar clientes";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Clientes</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <div key={customer.id} className="rounded-lg border p-4">
            <h2>{customer.name}</h2>
            <p>Email: {customer.email}</p>
            <p>Telefone: {customer.phone}</p>
            <p>Endereço: {customer.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
