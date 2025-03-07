import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

const data = [
  {
    id: 1,
    invoice: "INV001",
    status: "Paid",
    method: "Credit Card",
    amount: "R$ 250,00",
  },
  {
    id: 2,
    invoice: "INV002",
    status: "Pending",
    method: "PayPal",
    amount: "R$ 150,00",
  },
  {
    id: 3,
    invoice: "INV003",
    status: "Unpaid",
    method: "Bank Transfer",
    amount: "R$ 350,00",
  },
  {
    id: 4,
    invoice: "INV004",
    status: "Paid",
    method: "Credit Card",
    amount: "R$ 450,00",
  },
  {
    id: 5,
    invoice: "INV005",
    status: "Paid",
    method: "PayPal",
    amount: "R$ 550,00",
  },
  {
    id: 6,
    invoice: "INV006",
    status: "Pending",
    method: "Bank Transfer",
    amount: "R$ 200,00",
  },
  {
    id: 7,
    invoice: "INV007",
    status: "Unpaid",
    method: "Credit Card",
    amount: "R$ 300,00",
  },
];

export function TableExample() {
  return (
    <Table>
      <TableCaption>Lista de faturas recentes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fatura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  invoice.status === "Paid"
                    ? "bg-green-50 text-green-700"
                    : invoice.status === "Pending"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {invoice.status}
              </span>
            </TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
