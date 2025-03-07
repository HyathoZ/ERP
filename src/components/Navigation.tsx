import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowUpDown,
  Receipt,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  BarChart,
} from "lucide-react";

const menuItems = [
  {
    title: "Geral",
    items: [
      {
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        href: "/",
      },
    ],
  },
  {
    title: "Financeiro",
    items: [
      {
        label: "Contas",
        icon: <Wallet className="h-4 w-4" />,
        href: "/financial/accounts",
      },
      {
        label: "Transações",
        icon: <ArrowUpDown className="h-4 w-4" />,
        href: "/financial/transactions",
      },
      {
        label: "Contas a Pagar/Receber",
        icon: <Receipt className="h-4 w-4" />,
        href: "/financial/payables-receivables",
      },
    ],
  },
  {
    title: "Vendas",
    items: [
      {
        label: "Clientes",
        icon: <Users className="h-4 w-4" />,
        href: "/customers",
      },
      {
        label: "Produtos",
        icon: <ShoppingCart className="h-4 w-4" />,
        href: "/products",
      },
      {
        label: "Pedidos",
        icon: <FileText className="h-4 w-4" />,
        href: "/orders",
      },
    ],
  },
  {
    title: "Outros",
    items: [
      {
        label: "Relatórios",
        icon: <BarChart className="h-4 w-4" />,
        href: "/reports",
      },
      {
        label: "Configurações",
        icon: <Settings className="h-4 w-4" />,
        href: "/settings",
      },
    ],
  },
];

export function Navigation() {
  return (
    <nav className="space-y-6">
      {menuItems.map((section) => (
        <div key={section.title} className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{section.title}</h2>
          <div className="space-y-1">
            {section.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
