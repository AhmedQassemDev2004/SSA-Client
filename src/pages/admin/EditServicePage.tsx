import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";

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
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const EditServicePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingService, setIsLoadingService] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [] as string[],
    categoryId: undefined as number | undefined,
    active: true,
  });

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [toast]);

  // Load service data
  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Service ID is required",
          variant: "destructive",
        });
        navigate("/admin/services");
        return;
      }

      setIsLoadingService(true);
      try {
        const response = await api.get(`/services/${id}`);
        const serviceData = response.data;
        setService(serviceData);
        
        // Set form data
        setFormData({
          name: serviceData.name,
          description: serviceData.description,
          images: serviceData.images,
          categoryId: serviceData.categoryId || (serviceData.category?.id || undefined),
          active: serviceData.active,
        });
      } catch (error) {
        console.error("Error fetching service:", error);
        toast({
          title: "Error",
          description: "Failed to load service data",
          variant: "destructive",
        });
        navigate("/admin/services");
      } finally {
        setIsLoadingService(false);
      }
    };

    fetchService();
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        categoryId: formData.categoryId || null,
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

      navigate("/admin/services");
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

  if (isLoadingService) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (!service) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">Service Not Found</h2>
            <Button onClick={() => navigate("/admin/services")}>
              Back to Services
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/services")}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
                Edit Service
              </h2>
              <p className="text-gray-400 mt-2">
                Update service information and settings.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-6">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-6">Description</h3>
              
              <div className="space-y-2">
                <Label htmlFor="description">Service Description</Label>
                <RichTextEditor
                  id="description"
                  placeholder="Enter detailed service description..."
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  className="bg-gray-800 text-gray-300"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-6">Service Images</h3>
              
              <div className="space-y-2">
                <Label>Images</Label>
                <ImageUploader
                  images={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                  maxImages={5}
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-6">Status</h3>
              
              <div className="space-y-2">
                <Label htmlFor="active">Service Status</Label>
                <Select
                  value={formData.active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, active: value === "active" })
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem
                      value="active"
                      className="text-gray-300 hover:bg-gray-700 hover:text-green-400"
                    >
                      Active
                    </SelectItem>
                    <SelectItem
                      value="inactive"
                      className="text-gray-300 hover:bg-gray-700 hover:text-red-400"
                    >
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/services")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-ssa-gold to-yellow-400 hover:from-yellow-500 hover:to-ssa-gold text-gray-900 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default EditServicePage; 