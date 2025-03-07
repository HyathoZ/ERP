import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { Layout } from "../components/Layout";
import { lazy, Suspense } from "react";
import { Accounts } from "../pages/financial/Accounts";
import { Transactions } from "../pages/financial/Transactions";
import { PayablesReceivables } from "../pages/financial/PayablesReceivables";
import { CustomerList } from "../components/customers/CustomerList";
import { CustomerForm } from "../components/customers/CustomerForm";
import { CustomerDetails } from "../components/customers/CustomerDetails";
import { Products } from "../pages/Products";
import { Orders } from "../pages/Orders";
import { Companies } from "../pages/Companies";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useAuth } from "../hooks/useAuth";

const Dashboard = lazy(() => import("../pages/Dashboard"));

// Componente de loading
function LoadingFallback() {
  return (
    <div className="flex h-[200px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  );
}

// Proteção de rotas
function RequireAuth({
  children,
  allowedRoles = ["USER", "ADMIN", "SUPERADMIN"],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <RequireAuth>
          <Layout />
        </RequireAuth>
      </ErrorBoundary>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "financial",
        children: [
          {
            path: "accounts",
            element: (
              <RequireAuth allowedRoles={["ADMIN", "SUPERADMIN"]}>
                <Accounts />
              </RequireAuth>
            ),
          },
          {
            path: "transactions",
            element: (
              <RequireAuth allowedRoles={["ADMIN", "SUPERADMIN"]}>
                <Transactions />
              </RequireAuth>
            ),
          },
          {
            path: "payables-receivables",
            element: (
              <RequireAuth allowedRoles={["ADMIN", "SUPERADMIN"]}>
                <PayablesReceivables />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: "customers",
        children: [
          {
            path: "",
            element: <CustomerList />,
          },
          {
            path: "new",
            element: <CustomerForm />,
          },
          {
            path: ":id",
            element: <CustomerDetails />,
          },
          {
            path: ":id/edit",
            element: <CustomerForm />,
          },
        ],
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "companies",
        element: (
          <RequireAuth allowedRoles={["SUPERADMIN"]}>
            <Companies />
          </RequireAuth>
        ),
      },
      {
        path: "settings",
        element: (
          <RequireAuth allowedRoles={["ADMIN", "SUPERADMIN"]}>
            <div>Configurações</div>
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <div>Login</div>,
  },
  {
    path: "register",
    element: <div>Registro</div>,
  },
  {
    path: "unauthorized",
    element: <div>Acesso não autorizado</div>,
  },
  {
    path: "*",
    element: <div>Página não encontrada</div>,
  },
]);
