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
} from "lucide-react";
import type { UserRole } from "../services/supabase";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ThemeToggle } from "../components/theme-toggle";

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
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" to="/">
              <span className="font-bold">ERP</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 ${
                    location.pathname === item.href ? "text-foreground" : "text-foreground/60"
                  } transition-colors hover:text-foreground`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Adicione aqui a barra de pesquisa se necessário */}
            </div>
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sair</span>
              </Button>
              <Avatar>
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 grid h-[calc(100vh-3.5rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
          <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 rounded-md p-2 ${
                    location.pathname === item.href ? "bg-accent" : "hover:bg-accent"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
      <main className="flex-1">{children || <Outlet />}</main>
    </div>
  );
}
