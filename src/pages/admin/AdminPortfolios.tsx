import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, ChevronUp, Filter, Search, Image as ImageIcon } from "lucide-react";
import { AddPortfolioDialog } from "@/components/admin/AddPortfolioDialog";
import PortfoliosTable from "@/components/admin/PortfoliosTable";

const AdminPortfolios = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    withImages: 0,
    withoutImages: 0,
  });
  const [refresh, setRefresh] = useState(0);

  interface Portfolio {
    id: number;
    title: string;
    description: string;
    images: string[];
    links: string[];
    serviceId: number;
    service: {
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  }

  const handlePortfoliosLoaded = (portfolios: Portfolio[]) => {
    const portfoliosWithImages = portfolios.filter(portfolio => portfolio.images.length > 0);
    setStats({
      total: portfolios.length,
      withImages: portfoliosWithImages.length,
      withoutImages: portfolios.length - portfoliosWithImages.length,
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
              Portfolio Management
            </h2>
            <p className="text-gray-400 mt-2">
              Manage and monitor your portfolio items.
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
              onClick={() => setIsAddPortfolioOpen(true)}
              className="bg-gradient-to-r from-ssa-gold to-ssa-gold hover:px-5 text-gray-900 font-medium transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Portfolio
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
                <h3 className="text-sm font-medium text-gray-400">Total Portfolios</h3>
                <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">{stats.total}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
                <ImageIcon className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>{stats.total > 0 ? `${stats.total} total portfolios` : "No portfolios yet"}</span>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">With Images</h3>
                <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">{stats.withImages}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
                <ImageIcon className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>{stats.total > 0 ? `${Math.round((stats.withImages / stats.total) * 100)}% have images` : "No portfolios with images"}</span>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Without Images</h3>
                <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">{stats.withoutImages}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
                <ImageIcon className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>{stats.total > 0 ? `${Math.round((stats.withoutImages / stats.total) * 100)}% need images` : "No portfolios without images"}</span>
            </div>
          </Card>
        </motion.div>

        {/* Portfolios Table Card */}
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
                    placeholder="Search portfolios..."
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
                      <SelectItem value="all" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">All Portfolios</SelectItem>
                      <SelectItem value="withImages" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">With Images</SelectItem>
                      <SelectItem value="withoutImages" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">Without Images</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Portfolios Table */}
              <PortfoliosTable query={searchQuery} refresh={refresh} onPortfoliosLoaded={handlePortfoliosLoaded} />
            </div>
          </Card>
        </motion.div>

        {/* Add Portfolio Dialog */}
        <AddPortfolioDialog
          open={isAddPortfolioOpen}
          onOpenChange={setIsAddPortfolioOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["portfolios"] });
            setRefresh((prev) => prev + 1);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolios; 