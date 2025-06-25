import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "@/components/shared/ImageUploader";
import RichTextEditor from "@/components/shared/RichTextEditor";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { api } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

interface Service {
  id: number;
  name: string;
  description: string;
  images: string[];
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: number;
  onSuccess: () => void;
}

export function EditServiceDialog({
  open,
  onOpenChange,
  serviceId,
  onSuccess,
}: EditServiceDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingService, setIsLoadingService] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [] as string[],
    categoryId: undefined as number | undefined,
  });

  // Load categories when dialog opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Load service data when serviceId changes
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId || !open) return;
      
      setIsLoadingService(true);
      try {
        const response = await api.get(`/services/${serviceId}`);
        const serviceData = response.data;
        setService(serviceData);
        
        // Set form data
        setFormData({
          name: serviceData.name,
          description: serviceData.description,
          images: serviceData.images,
          categoryId: serviceData.categoryId || (serviceData.category?.id || undefined),
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setIsLoading(true);

    try {
      // Prepare the data to send, ensuring categoryId is properly handled
      const submitData = {
        ...formData,
        categoryId: formData.categoryId || null, // Send null instead of undefined
      };

      const response = await api.patch(`/services/${service.id}`, submitData);

      if (response.status !== 200) {
        throw new Error("Failed to update service");
      }

      toast({
        title: "Success",
        description: "Service updated successfully",
        variant: "default",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating service:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to update service. Please try again.";
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
      <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
            Edit Service
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the service information below. All fields are required unless marked as optional.
          </DialogDescription>
        </DialogHeader>

        {isLoadingService ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  placeholder="Enter service name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                  id="description"
                  placeholder="Enter service description"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  className="bg-gray-800 text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId?.toString() || "none"}
                  onValueChange={(value) =>
                    setFormData({ 
                      ...formData, 
                      categoryId: value === "none" ? undefined : parseInt(value)
                    })
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem
                      value="none"
                      className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold"
                    >
                      No Category
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                        className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <ImageUploader
                  images={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                  maxImages={5}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-ssa-gold to-yellow-400 hover:from-yellow-500 hover:to-ssa-gold text-gray-900 font-medium transition-all"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
