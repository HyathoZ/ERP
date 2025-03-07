import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { lazy, Suspense } from "react";
import { Accounts } from "../pages/financial/Accounts";
import { Transactions } from "../pages/financial/Transactions";
import { PayablesReceivables } from "../pages/financial/PayablesReceivables";
import { CustomerList } from "../components/customers/CustomerList";
import { CustomerForm } from "../components/customers/CustomerForm";
import { CustomerDetails } from "../components/customers/CustomerDetails";

const Dashboard = lazy(() => import("../pages/Dashboard"));

// Componente de loading
function LoadingFallback() {
  return (
    <div className="flex h-[200px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
            element: <Accounts />,
          },
          {
            path: "transactions",
            element: <Transactions />,
          },
          {
            path: "payables-receivables",
            element: <PayablesReceivables />,
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
        element: <div>Em construção...</div>,
      },
      {
        path: "orders",
        element: <div>Em construção...</div>,
      },
      {
        path: "reports",
        element: <div>Em construção...</div>,
      },
      {
        path: "settings",
        element: <div>Em construção...</div>,
      },
    ],
  },
]);
