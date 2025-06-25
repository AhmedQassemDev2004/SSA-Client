import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Shield, Loader2, Key } from "lucide-react";
import { api } from "@/lib/api";
import axios from "axios";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.patch("/user/"+user.id, formData);
      updateUser(response.data);
      setSuccess("Your profile has been updated successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to update profile. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to change password. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#131212] to-[#1a1a1a] pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-ssa-gold/20 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="relative overflow-hidden pb-8">
              <div className="absolute inset-0 bg-ssa-gold/10" />
              <div className="relative z-10">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ssa-gold text-[#131212]">
                    <span className="text-2xl font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-gray-400 mt-1">{user.email}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-ssa-gold/10 text-ssa-gold text-sm">
                        {user.phone}
                      </span>
                      {user.createdAt && (
                        <span className="px-3 py-1 rounded-full bg-ssa-gold/10 text-ssa-gold text-sm">
                          Member since {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Separator className="my-6 bg-ssa-gold/20" />

              {error && (
                <Alert variant="destructive" className="mb-6 border-red-500/20 bg-red-500/5">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Alert className="bg-green-500/5 border-green-500/20">
                    <AlertDescription className="text-green-500">{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-8 p-1 bg-[#2a2a2a]/30 rounded-lg">
                  <TabsTrigger 
                    value="profile" 
                    className="data-[state=active]:bg-ssa-gold data-[state=active]:text-[#131212] rounded-md transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="data-[state=active]:bg-ssa-gold data-[state=active]:text-[#131212] rounded-md transition-all duration-300"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Reset Password
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-200">
                          Full Name
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-ssa-gold transition-colors" />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10 bg-[#2a2a2a]/30 border-gray-600 text-white placeholder-gray-400 focus:border-ssa-gold focus:ring-ssa-gold/20 rounded-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-200">
                          Email Address
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-ssa-gold transition-colors" />
                          <Input
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 bg-[#2a2a2a]/30 border-gray-600 text-white placeholder-gray-400 focus:border-ssa-gold focus:ring-ssa-gold/20 rounded-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone" className="text-gray-200">
                          Phone Number
                        </Label>
                        <div className="relative group">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-ssa-gold transition-colors" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="pl-10 bg-[#2a2a2a]/30 border-gray-600 text-white placeholder-gray-400 focus:border-ssa-gold focus:ring-ssa-gold/20 rounded-lg transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-ssa-gold hover:bg-ssa-gold/90 text-[#131212] font-semibold py-6 rounded-lg transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving Changes...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="security">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-gray-200">
                          Current Password
                        </Label>
                        <div className="relative group">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-ssa-gold transition-colors" />
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="pl-10 bg-[#2a2a2a]/30 border-gray-600 text-white placeholder-gray-400 focus:border-ssa-gold focus:ring-ssa-gold/20 rounded-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-gray-200">
                            New Password
                          </Label>
                          <div className="relative group">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-ssa-gold transition-colors" />
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="pl-10 bg-[#2a2a2a]/30 border-gray-600 text-white placeholder-gray-400 focus:border-ssa-gold focus:ring-ssa-gold/20 rounded-lg transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-gray-200">
                            Confirm New Password
                          </Label>
                          <div className="relative group">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-ssa-gold transition-colors" />
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="pl-10 bg-[#2a2a2a]/30 border-gray-600 text-white placeholder-gray-400 focus:border-ssa-gold focus:ring-ssa-gold/20 rounded-lg transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-ssa-gold hover:bg-ssa-gold/90 text-[#131212] font-semibold py-6 rounded-lg transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Changing Password...
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
