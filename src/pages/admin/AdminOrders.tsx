import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, Search, ShoppingCart, Clock, MessageSquare, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ViewOrderDialog from "@/components/admin/ViewOrderDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ServiceOrder {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  serviceId: number;
  service: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery<ServiceOrder[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/service-orders");
      return res.data;
    },
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "today") {
      const today = new Date();
      const orderDate = new Date(order.createdAt);
      return matchesSearch && orderDate.toDateString() === today.toDateString();
    }

    if (filter === "week") {
      const today = new Date();
      const orderDate = new Date(order.createdAt);
      const diffTime = Math.abs(today.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return matchesSearch && diffDays <= 7;
    }

    return matchesSearch;
  });

  const stats = {
    total: orders.length,
    today: orders.filter(order => {
      const today = new Date();
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: orders.filter(order => {
      const today = new Date();
      const orderDate = new Date(order.createdAt);
      const diffTime = Math.abs(today.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/service-orders/export", {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Success",
        description: "Orders exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export orders.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-ssa-gold" />
        </div>
      </AdminLayout>
    );
  }

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
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
              Service Orders
            </h2>
            <p className="text-gray-400 mt-2">
              Manage and track service orders from your clients.
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
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Orders
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Total Orders</h3>
                <p className="mt-2 text-3xl font-bold text-ssa-gold">{stats.total}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-ssa-gold/10">
                <ShoppingCart className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Today's Orders</h3>
                <p className="mt-2 text-3xl font-bold text-ssa-gold">{stats.today}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-ssa-gold/10">
                <Clock className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">This Week</h3>
                <p className="mt-2 text-3xl font-bold text-ssa-gold">{stats.thisWeek}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-ssa-gold/10">
                <MessageSquare className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Orders Table Card */}
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
                    placeholder="Search orders..."
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
                      <SelectItem value="all" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">All Orders</SelectItem>
                      <SelectItem value="today" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">Today's Orders</SelectItem>
                      <SelectItem value="week" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">This Week's Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-md border border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800/50">
                      <TableHead className="text-gray-400">Client</TableHead>
                      <TableHead className="text-gray-400">Service</TableHead>
                      <TableHead className="text-gray-400">Contact</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                          <div className="flex flex-col items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-gray-600 mb-2" />
                            <p>No orders found</p>
                            {searchQuery && (
                              <p className="text-sm text-gray-500 mt-1">
                                Try adjusting your search or filter criteria
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="border-gray-700 hover:bg-gray-800/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20 flex items-center justify-center text-ssa-gold font-medium">
                                {order.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-200">{order.name}</div>
                                <div className="text-sm text-gray-500">{order.company}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-ssa-gold border-2 rounded-full border-ssa-gold px-2 py-1 text-sm">
                              {order.service.name}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-gray-200">{order.email}</div>
                              <div className="text-sm text-gray-500">{order.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-gray-200">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              className="text-ssa-gold hover:text-yellow-400 hover:bg-gray-800"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </motion.div>

        <ViewOrderDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminOrders; 