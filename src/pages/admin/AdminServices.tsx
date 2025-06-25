import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import ServicesTable from "@/components/admin/ServicesTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, ChevronUp, Filter, Search, Briefcase, CheckCircle, XCircle } from "lucide-react";
import { AddServiceDialog } from "@/components/admin/AddServiceDialog";

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [refresh, setRefresh] = useState(0);

  interface Service {
    id: number;
    name: string;
    description: string;
    images: string[];
    active?: boolean;
    createdAt: string;
    updatedAt: string;
  }

  const handleServicesLoaded = (services: Service[]) => {
    const activeServices = services.filter(service => service.active);
    setStats({
      total: services.length,
      active: activeServices.length,
      inactive: services.length - activeServices.length,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-ssa-gold to-ssa-gold bg-clip-text text-transparent">
              Services Management
            </h2>
            <p className="text-gray-400 mt-2">
              Manage and monitor your service offerings.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button 
              onClick={() => setIsAddServiceOpen(true)}
              className="bg-gradient-to-r from-ssa-gold to-ssa-gold hover:px-5 text-gray-900 font-medium transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </motion.div>
        </div>

        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Total Services</h3>
                <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">{stats.total}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
                <Briefcase className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>{stats.total > 0 ? `${stats.total} total services` : "No services yet"}</span>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Active Services</h3>
                <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">{stats.active}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
                <CheckCircle className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>{stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}% active rate` : "No active services"}</span>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Inactive Services</h3>
                <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">{stats.inactive}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
                <XCircle className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>{stats.total > 0 ? `${Math.round((stats.inactive / stats.total) * 100)}% inactive rate` : "No inactive services"}</span>
            </div>
          </Card>
        </motion.div>

        {/* Services Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="p-6">
              {/* Table Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-800/50 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:border-ssa-gold focus:ring-ssa-gold"
                  />
                </div>
                <div className="flex gap-4">
                  <Select defaultValue={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-gray-300 hover:border-ssa-gold">
                      <Filter className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">All Services</SelectItem>
                      <SelectItem value="active" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">Active Services</SelectItem>
                      <SelectItem value="inactive" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">Inactive Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Services Table */}
              <ServicesTable query={searchQuery} refresh={refresh} onServicesLoaded={handleServicesLoaded} />
            </div>
          </Card>
        </motion.div>        {/* Add Service Dialog */}
        <AddServiceDialog
          open={isAddServiceOpen}
          onOpenChange={setIsAddServiceOpen}
          onSuccess={() => {
            // Refetch services data when a new service is added
            queryClient.invalidateQueries({ queryKey: ["services"] });
            setRefresh((prev) => prev + 1); // Trigger refresh
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
