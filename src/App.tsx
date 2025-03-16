import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatbotList from "./pages/ChatbotList";
import ChatbotWizard from "./pages/ChatbotWizard";
import ChatbotEdit from "./pages/ChatbotEdit";
import Analytics from "./pages/Analytics";
import LeadsPage from "./pages/LeadsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import AdminDashboard from "./pages/AdminDashboard";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return <>{children}</>;
};

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/chatbots",
    element: (
      <ProtectedRoute>
        <ChatbotList />
      </ProtectedRoute>
    )
  },
  {
    path: "/chatbot-wizard",
    element: (
      <ProtectedRoute>
        <ChatbotWizard />
      </ProtectedRoute>
    )
  },
  {
    path: "/chatbot/:id",
    element: (
      <ProtectedRoute>
        <ChatbotEdit />
      </ProtectedRoute>
    )
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    )
  },
  {
    path: "/leads",
    element: (
      <ProtectedRoute>
        <LeadsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/integrations",
    element: (
      <ProtectedRoute>
        <IntegrationsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/subscription",
    element: (
      <ProtectedRoute>
        <SubscriptionsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/checkout/:planId",
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    )
  }
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
