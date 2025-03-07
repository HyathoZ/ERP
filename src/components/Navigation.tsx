import { Link } from "react-router-dom";
import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 hidden md:flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      <nav className={cn("space-y-4 transition-all duration-300", isCollapsed ? "w-[60px]" : "w-[240px]")}>
        <TooltipProvider delayDuration={0}>
          {menuItems.map((section) => (
            <div key={section.title} className="px-3 py-2">
              {!isCollapsed && <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{section.title}</h2>}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        {item.icon}
                        {!isCollapsed && item.label}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </nav>
    </div>
  );
}
