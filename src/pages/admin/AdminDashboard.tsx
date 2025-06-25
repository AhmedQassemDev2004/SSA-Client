import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Package, DollarSign, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalUsers: number;
  usersChange: string;
  totalServices: number;
  servicesChange: string;
  revenue: string;
  revenueChange: string;
  growth: string;
  growthChange: string;
}

interface UserItem {
  id: number;
  name: string;
  createdAt: string;
}

interface ServiceItem {
  id: number;
  name: string;
  createdAt: string;
}

const StatsCard = ({ stat }) => (
  <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10`} />
    <div className="p-6 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{stat.label}</p>
          <h3 className="text-2xl font-bold mt-2 bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
            {stat.value}
          </h3>
        </div>
        <div className={`rounded-full p-3 bg-gradient-to-r ${stat.color}`}>
          <stat.icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className="text-sm font-medium text-green-400">
          {stat.change}
        </span>
        <span className="ml-2 text-sm text-gray-500">vs last month</span>
      </div>
    </div>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-12 w-full bg-gray-800" />
    <Skeleton className="h-12 w-full bg-gray-800" />
    <Skeleton className="h-12 w-full bg-gray-800" />
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard-stats");
      return res.data;
    },
  });

  const { data: recentUsers = [], isLoading: usersLoading } = useQuery<UserItem[]>({
    queryKey: ["recent-users"],
    queryFn: async () => {
      const res = await api.get("/user?limit=3&sort=desc");
      return res.data;
    },
  });

  const { data: recentServices = [], isLoading: servicesLoading } = useQuery<ServiceItem[]>({
    queryKey: ["recent-services"],
    queryFn: async () => {
      const res = await api.get("/services?limit=3&sort=desc");
      return res.data;
    },
  });

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "-",
      change: stats?.usersChange ?? "",
      icon: Users,
      color: "from-ssa-gold to-yellow-400",
    },
    {
      label: "Total Services",
      value: stats?.totalServices ?? "-",
      change: stats?.servicesChange ?? "",
      icon: Package,
      color: "from-yellow-500 to-ssa-gold",
    },
    {
      label: "Revenue",
      value: stats?.revenue ?? "-",
      change: stats?.revenueChange ?? "",
      icon: DollarSign,
      color: "from-green-600 to-green-400",
    },
    {
      label: "Growth",
      value: stats?.growth ?? "-",
      change: stats?.growthChange ?? "",
      icon: TrendingUp,
      color: "from-orange-600 to-orange-400",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
            Welcome back, Admin!
          </h2>
          <p className="text-gray-400 mt-2">
            Here's an overview of your service management system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatsCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
              Recent Users
            </h3>
            <div className="space-y-4">
              {usersLoading ? (
                <LoadingSkeleton />
              ) : recentUsers.length ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-ssa-gold to-yellow-400 flex items-center justify-center text-white font-bold">
                      {user.name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{user.name}</p>
                      <p className="text-xs text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No recent users.</div>
              )}
            </div>
            <button
              onClick={() => navigate("/admin/users")}
              className="mt-4 text-sm text-ssa-gold hover:text-yellow-400 transition-colors"
            >
              View all users →
            </button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
              Recent Services
            </h3>
            <div className="space-y-4">
              {servicesLoading ? (
                <LoadingSkeleton />
              ) : recentServices.length ? (
                recentServices.map((service) => (
                  <div key={service.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-ssa-gold to-yellow-400 flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{service.name}</p>
                      <p className="text-xs text-gray-500">Added {new Date(service.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No recent services.</div>
              )}
            </div>
            <button
              onClick={() => navigate("/admin/services")}
              className="mt-4 text-sm text-ssa-gold hover:text-yellow-400 transition-colors"
            >
              View all services →
            </button>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
