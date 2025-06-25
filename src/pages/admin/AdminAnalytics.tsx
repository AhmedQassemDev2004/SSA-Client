import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, LineChart, BarChart2, PieChart } from "lucide-react";

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");

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
              Analytics
            </h2>
            <p className="text-gray-400 mt-2">
              Monitor your business performance and insights.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 border-gray-700 bg-gray-800/50 text-gray-300">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </motion.div>
        </div>

        {/* Analytics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Growth Trend */}
          <Card className="p-6 col-span-2 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Growth Trend</h3>
                <p className="text-sm text-gray-400">Users and services over time</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20 flex items-center justify-center">
                <LineChart className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="h-72 w-full bg-gray-800/30 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Chart will be implemented here</span>
            </div>
          </Card>

          {/* User Distribution */}
          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">User Distribution</h3>
                <p className="text-sm text-gray-400">By role and status</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="h-72 w-full bg-gray-800/30 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Chart will be implemented here</span>
            </div>
          </Card>

          {/* Service Performance */}
          <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Popular Services</h3>
                <p className="text-sm text-gray-400">Most viewed and booked</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-ssa-gold" />
              </div>
            </div>
            <div className="h-72 w-full bg-gray-800/30 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Chart will be implemented here</span>
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="p-6 col-span-2 lg:col-span-3 border-none shadow-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Activity Feed</h3>
                <p className="text-sm text-gray-400">Recent system events</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { action: "User registered", timestamp: "2 hours ago", type: "user" },
                { action: "New service added", timestamp: "5 hours ago", type: "service" },
                { action: "Service updated", timestamp: "1 day ago", type: "service" },
                { action: "User profile updated", timestamp: "2 days ago", type: "user" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === "user" ? "bg-blue-400" : "bg-green-400"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
