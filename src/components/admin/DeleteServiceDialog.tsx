import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { api } from "@/lib/api";

interface Service {
  id: number;
  name: string;
  description: string;
  images: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DeleteServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: number;
  onSuccess: () => void;
}

export function DeleteServiceDialog({ 
  open, 
  onOpenChange, 
  serviceId,
  onSuccess 
}: DeleteServiceDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingService, setIsLoadingService] = useState(false);
  const [service, setService] = useState<Service | null>(null);

  // Load service data when serviceId changes
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId || !open) return;
      
      setIsLoadingService(true);
      try {
        const response = await api.get(`/services/${serviceId}`);
        const serviceData = response.data;
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast({
          title: "Error",
          description: "Failed to load service data",
          variant: "destructive",
        });
        onOpenChange(false);
      } finally {
        setIsLoadingService(false);
      }
    };

    fetchService();
  }, [serviceId, open, toast, onOpenChange]);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // console.log("Deleting service with ID:", serviceId);

      const response = await api.delete(`/services/${serviceId}`);

      // console.log("Delete API Response:", response);

      // Check for both 200 and 204 status codes (NestJS typically returns 204 for successful deletions)
      if (response.status !== 200 && response.status !== 204) {
        throw new Error("Failed to delete service");
      }

      toast({
        title: "Success",
        description: "Service deleted successfully",
        variant: "default",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting service:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to delete service. Please try again.";
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
      <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-400">
            Delete Service
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isLoadingService ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              `Are you sure you want to delete the service "${service?.name || 'Unknown'}"? This action cannot be undone.`
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading || isLoadingService}
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            {isLoading ? "Deleting..." : "Delete Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
