import { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  User,
  Search,
} from "lucide-react";
import type { UserRole } from "../services/supabase";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ThemeToggle } from "../components/theme-toggle";
import { Input } from "../components/ui/input";
import { Navigation } from "../components/Navigation";
import { cn } from "../lib/utils";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const getMenuItems = (role: UserRole) => {
  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  if (role === "superadmin") {
    items.push(
      {
        title: "Empresas",
        href: "/companies",
        icon: Building2,
      },
      {
        title: "Planos",
        href: "/plans",
        icon: Package,
      }
    );
  }

  if (role === "admin" || role === "superadmin") {
    items.push({
      title: "Usuários",
      href: "/users",
      icon: Users,
    });
  }

  items.push(
    {
      title: "Pedidos",
      href: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Perfil",
      href: "/profile",
      icon: User,
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: Settings,
    }
  );

  return items;
};

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return <Outlet />;
  }

  const menuItems = getMenuItems(user.role);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link className="flex items-center space-x-2" to="/">
              <span className="font-bold text-xl">ERP</span>
            </Link>
          </div>

          <div className="flex-1 mx-4 hidden md:block max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar..." className="pl-8 w-full" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="hidden md:flex">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sair</span>
            </Button>
            <Avatar>
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r bg-background md:sticky md:block",
            mobileMenuOpen ? "block" : "hidden md:block",
            sidebarCollapsed ? "md:w-[60px]" : "md:w-[240px]"
          )}
        >
          <Navigation />
        </aside>

        {/* Main Content */}
        <main className={cn("flex-1 px-4 py-6 md:px-6 lg:px-8", sidebarCollapsed ? "md:ml-[60px]" : "md:ml-[240px]")}>
          <div className="mx-auto max-w-6xl">{children || <Outlet />}</div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
