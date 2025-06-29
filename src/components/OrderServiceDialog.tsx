import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from '@/hooks/use-auth';

interface OrderServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: number;
  serviceName: string;
}

export function OrderServiceDialog({ open, onOpenChange, serviceId, serviceName }: OrderServiceDialogProps) {
  const { toast } = useToast();
  const {user, loading, isAuthenticated} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  useEffect(()=>{
    if(isAuthenticated && !loading) {
      setFormData({
        name:user.name,
        email:user.email,
        phone:user.phone,
        company:"",
        message:""
      })
    }
  }, [user,isAuthenticated, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/service-orders", {
        ...formData,
        serviceId,
      });

      if (response.status !== 201) {
        throw new Error("Failed to submit order");
      }

      toast({
        title: "Success",
        description: "Your service request has been submitted successfully. We'll contact you soon!",
        variant: "default",
      });

      onOpenChange(false);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to submit order. Please try again.";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
            Order {serviceName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-800 border-gray-700 text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-gray-800 border-gray-700 text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm sm:text-base">Company Name</Label>
              <Input
                id="company"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-gray-800 border-gray-700 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm sm:text-base">Project Details</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your project requirements"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-gray-800 border-gray-700 min-h-[120px] sm:min-h-[150px] text-sm sm:text-base"
              required
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-ssa-gold to-yellow-400 hover:from-yellow-500 hover:to-ssa-gold text-gray-900 font-medium transition-all w-full sm:w-auto text-sm sm:text-base"
            >
              {isLoading ? "Submitting..." : "Submit Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 