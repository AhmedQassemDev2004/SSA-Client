import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Service {
  id: number;
  name: string;
  description: string;
  images: string[];
  active: boolean;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface ServicesListProps {
  category: string;
  searchQuery?: string;
}

const ServicesList = ({ category, searchQuery = "" }: ServicesListProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (error) {
        console.error("Failed to load services:", error);
        setError("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  // Filter services by category and search query
  const filteredServices = services.filter((service) => {
    // First filter by active status
    if (!service.active) return false;
    
    // Filter by search query
    if (searchQuery && !service.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Then filter by category
    if (category === "all") {
      return true; // Show all active services that match search
    } else {
      // Show services that belong to the selected category and match search
      return service.categoryId?.toString() === category;
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-ssa-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">No services found</p>
        <p className="text-sm">
          {searchQuery 
            ? `No services found matching "${searchQuery}"${category !== "all" ? " in this category" : ""}.`
            : category === "all" 
              ? "No active services available at the moment." 
              : "No services found in this category."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {filteredServices.map((service) => (
        <motion.div
          key={service.id}
          variants={item}
          whileHover={{ y: -10, transition: { duration: 0.2 } }}
        >
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#222] border border-gray-800 hover:border-ssa-gold/50 shadow-lg hover:shadow-ssa-gold/10 transition-all duration-300 h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ssa-gold/20 to-yellow-400/20 flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <CardTitle className="text-xl bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent font-heading">
                {service.name}
              </CardTitle>
              {service.category && (
                <div className="mt-2">
                  <span className="inline-block text-xs font-medium text-ssa-gold border border-ssa-gold/30 rounded-full px-2 py-1 bg-ssa-gold/10">
                    {service.category.name}
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex flex-col flex-grow pt-2">
              {service.images && service.images.length > 0 ? (
                <div className="mt-4 mb-6 relative group overflow-hidden rounded-md">
                  <img
                    src={getImageUrl(service.images[0])}
                    alt={service.name}
                    className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {service.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                      +{service.images.length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 mb-6 flex items-center justify-center h-48 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-md border border-gray-800/50">
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-gray-700 mb-2" />
                    <span className="text-xs text-gray-600">
                      No image available
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-ssa-gold to-yellow-400 hover:from-yellow-500 hover:to-ssa-gold text-gray-900 font-medium transition-all"
                >
                  <Link to={`/services/${service.id}`}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ServicesList;
