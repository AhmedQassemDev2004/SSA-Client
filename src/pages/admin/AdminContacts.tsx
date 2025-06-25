import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, Search, Mail, Clock, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ViewContactDialog } from "@/components/admin/ViewContactDialog";
import { Contact } from "@/types/contact";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminContacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await api.get("/contacts");
      return res.data;
    },
  });

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "today") {
      const today = new Date();
      const contactDate = new Date(contact.createdAt);
      return matchesSearch && 
        contactDate.getDate() === today.getDate() &&
        contactDate.getMonth() === today.getMonth() &&
        contactDate.getFullYear() === today.getFullYear();
    }
    if (filter === "week") {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const contactDate = new Date(contact.createdAt);
      return matchesSearch && contactDate >= weekAgo;
    }
    return matchesSearch;
  });

  const stats = {
    total: contacts.length,
    today: contacts.filter(contact => {
      const today = new Date();
      const contactDate = new Date(contact.createdAt);
      return contactDate.getDate() === today.getDate() &&
        contactDate.getMonth() === today.getMonth() &&
        contactDate.getFullYear() === today.getFullYear();
    }).length,
    thisWeek: contacts.filter(contact => {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const contactDate = new Date(contact.createdAt);
      return contactDate >= weekAgo;
    }).length,
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
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
              Contact Messages
            </h2>
            <p className="text-gray-400 mt-2">
              Manage and respond to customer inquiries.
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
              Export Contacts
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
                <h3 className="text-sm font-medium text-gray-400">Total Messages</h3>
                <p className="mt-2 text-3xl font-bold text-ssa-gold">{stats.total}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
                <Mail className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Today's Messages</h3>
                <p className="mt-2 text-3xl font-bold text-ssa-gold">{stats.today}</p>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
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
              <div className="rounded-full p-3 bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20">
                <MessageSquare className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Contacts Table Card */}
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
                    placeholder="Search contacts..."
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
                      <SelectItem value="all" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">All Messages</SelectItem>
                      <SelectItem value="today" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">Today's Messages</SelectItem>
                      <SelectItem value="week" className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold">This Week's Messages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contacts Table */}
              <div className="rounded-md border border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800/50">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Subject</TableHead>
                      <TableHead className="text-gray-400">Message</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ssa-gold"></div>
                            <span className="ml-3">Loading contacts...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredContacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Mail className="h-12 w-12 text-gray-600 mb-2" />
                            <p>No contacts found</p>
                            {searchQuery && (
                              <p className="text-sm text-gray-500 mt-1">
                                Try adjusting your search or filter criteria
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContacts.map((contact) => (
                        <TableRow
                          key={contact.id}
                          className="border-gray-700 hover:bg-gray-800/50 transition-colors"
                        >
                          <TableCell className="text-gray-200">{contact.name}</TableCell>
                          <TableCell className="text-gray-200">{contact.email}</TableCell>
                          <TableCell className="text-gray-200">{contact.subject}</TableCell>
                          <TableCell className="text-gray-200 max-w-xs truncate">
                            {contact.message}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              className="text-ssa-gold hover:text-yellow-400 hover:bg-gray-800"
                              onClick={() => {
                                setSelectedContact(contact);
                                setIsViewDialogOpen(true);
                              }}
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

        <ViewContactDialog
          contact={selectedContact}
          isOpen={isViewDialogOpen}
          onClose={() => {
            setIsViewDialogOpen(false);
            setSelectedContact(null);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminContacts; 