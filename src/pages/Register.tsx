import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Phone validation
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ValidationErrors, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    clearError();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await api.post("/auth/register", registrationData);
      const { accessToken, user } = response.data;

      // Use auth context to handle login
      login(accessToken, user);

      // Navigate to home page or the page user tried to access
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during registration. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131212] text-white relative overflow-hidden">
      {/* Modern, subtle animated background with blurred color blobs and soft grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blurred color blobs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-ssa-gold/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-100/20 rounded-full blur-2xl"
        />
        {/* Subtle animated grid overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 215, 0, 0.18) 1.5px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.18) 1.5px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="relative">
            {/* Glassy background effect */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-2xl rounded-2xl border border-ssa-gold/20 shadow-2xl"
            />
            
            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 p-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-ssa-gold to-yellow-200 bg-clip-text text-transparent">
                  Create your account
                </h2>
                <p className="text-gray-300">Join us and start your journey</p>
              </motion.div>

              {(error || authError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-4 bg-red-500/20 backdrop-blur-sm border-red-500/30">
                    <AlertDescription>{error || authError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="fullName" className="text-white/90">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-ssa-gold transition-colors duration-200" />
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 bg-[#1a1a1a]/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-ssa-gold/50 focus:ring-ssa-gold/30 transition-all duration-200"
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors.name && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400"
                    >
                      {validationErrors.name}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-white/90">Email address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-ssa-gold transition-colors duration-200" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-[#1a1a1a]/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-ssa-gold/50 focus:ring-ssa-gold/30 transition-all duration-200"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors.email && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400"
                    >
                      {validationErrors.email}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="phoneNumber" className="text-white/90">Phone Number</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-ssa-gold transition-colors duration-200" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 bg-[#1a1a1a]/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-ssa-gold/50 focus:ring-ssa-gold/30 transition-all duration-200"
                      placeholder="Enter your phone number"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors.phone && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400"
                    >
                      {validationErrors.phone}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-white/90">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-ssa-gold transition-colors duration-200" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 bg-[#1a1a1a]/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-ssa-gold/50 focus:ring-ssa-gold/30 transition-all duration-200"
                      placeholder="Create a password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-ssa-gold transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400"
                    >
                      {validationErrors.password}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword" className="text-white/90">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-ssa-gold transition-colors duration-200" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 bg-[#1a1a1a]/60 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-ssa-gold/50 focus:ring-ssa-gold/30 transition-all duration-200"
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-ssa-gold transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400"
                    >
                      {validationErrors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-ssa-gold to-yellow-500 hover:from-yellow-500 hover:to-ssa-gold text-[#131212] font-semibold shadow-lg shadow-ssa-gold/20 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-center text-sm text-gray-300"
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-ssa-gold hover:text-ssa-gold/80 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
