import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import UsersTable from "@/components/admin/UsersTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, ChevronUp, Filter, Search, Users, CheckCircle, XCircle } from "lucide-react";
import { AddUserModal } from "@/components/admin/AddUserModal";
import { ExportButton } from "@/components/admin/ExportButton";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [refresh, setRefresh] = useState(0);


  const handleUserAdded = () => {
    setIsAddUserModalOpen(false);
    // refresh users
    setRefresh(prev => prev + 1);
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
            <h2 className="text-3xl font-bold tracking-tight text-ssa-gold">
              Users Management
            </h2>
            <p className="text-gray-400 mt-2">
              Manage and monitor your user accounts.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <ExportButton data={users} filename="users" />
            <Button 
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-gradient-to-r from-ssa-gold to-ssa-gold/70 hover:from-ssa-gold/90 hover:to-ssa-gold/60 text-gray-900 font-medium transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
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
                <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                <p className="mt-2 text-3xl font-bold text-ssa-gold">150</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-ssa-gold/10">
                <Users className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>12 new this month</span>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
                <p className="mt-2 text-3xl font-bold text-ssa-gold">142</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-ssa-gold/10">
                <CheckCircle className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>95% active rate</span>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Inactive Users</h3>
                <p className="mt-2 text-3xl font-bold text-ssa-gold">8</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-ssa-gold/10">
                <XCircle className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>5% inactive rate</span>
            </div>
          </Card>
        </motion.div>

        {/* Users Table Card */}
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
                    placeholder="Search users..."
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
                      <SelectItem value="all" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">All Users</SelectItem>
                      <SelectItem value="active" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">Active Users</SelectItem>
                      <SelectItem value="inactive" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">Inactive Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>              {/* Users Table */}
              <UsersTable query={searchQuery} setUsers={setUsers} refresh={refresh} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
