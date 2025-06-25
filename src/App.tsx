import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/admin/AdminRoute";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminServices";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPortfolios from "./pages/admin/AdminPortfolios";
import AdminContacts from "./pages/admin/AdminContacts";
import PortfoliosPage from "@/pages/PortfoliosPage";
import PortfolioDetailsPage from "@/pages/PortfolioDetailsPage";
import AdminOrders from "@/pages/admin/AdminOrders";
import EditServicePage from "@/pages/admin/EditServicePage";
import EditPortfolioPage from "@/pages/admin/EditPortfolioPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Index /></>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Navbar */}
            <Route
              path="/services"
              element={
                // <ProtectedRoute>
                  <><Navbar /><ServicesPage /></>
                // </ProtectedRoute>
              }
            />
            <Route
              path="/services/:id"
              element={
                // <ProtectedRoute>
                  <><Navbar /><ServiceDetail /></>
                // </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <><Navbar /><Profile /></>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <AdminRoute>
                  <AdminServices />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/portfolios"
              element={
                <AdminRoute>
                  <AdminPortfolios />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/portfolios/edit/:id"
              element={
                <AdminRoute>
                  <EditPortfolioPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <AdminRoute>
                  <AdminContacts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/services/:id/edit"
              element={
                <AdminRoute>
                  <EditServicePage />
                </AdminRoute>
              }
            />

            {/* Portfolios Routes */}
            <Route
              path="/portfolios"
              element={
                <PortfoliosPage />
              }
            />
            <Route
              path="/portfolios/:id"
              element={
                <PortfolioDetailsPage />
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
