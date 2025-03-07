import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  DollarSign,
  ShoppingCart,
  ClipboardList,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: DollarSign, label: "Financeiro", path: "/financial" },
    { icon: ShoppingCart, label: "Vendas", path: "/sales" },
    { icon: ClipboardList, label: "Pedidos", path: "/orders" },
    { icon: Users, label: "Clientes", path: "/customers" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={cn("bg-white shadow-lg transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          {!isCollapsed && <span className="text-xl font-bold">ERP System</span>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-lg p-1.5 hover:bg-gray-100">
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-4 space-y-1 px-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.path ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100",
                isCollapsed ? "justify-center" : "space-x-3"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full px-2">
          <button
            onClick={() => navigate("/logout")}
            className={cn(
              "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50",
              isCollapsed ? "justify-center" : "space-x-3"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
