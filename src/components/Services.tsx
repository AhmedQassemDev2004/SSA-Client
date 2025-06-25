import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import {stripHtml, getImageUrl} from "@/lib/utils"

interface Service {
  id: number;
  name: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get<Service[]>("/services/");
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ssa-gold animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section id="services" className="py-20 relative">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Our</span>{" "}
            <span className="text-gradient-gold">Services</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Comprehensive marketing solutions designed to elevate your brand,
            engage your audience, and drive measurable results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.slice(0, 6).map((service, index) =>
            service.active ? (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/services/${service.id}`} className="block">
                  <Card className="bg-gradient-to-br from-[#1b1b1b] to-[#232323] border border-gray-800 hover:border-ssa-gold/60 shadow-xl rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-ssa-gold/10 cursor-pointer">
                    <CardHeader className="relative p-0">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={
                            service.images?.length > 0
                              ? getImageUrl(service.images[0])
                              : "/placeholder.svg"
                          }
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                          <div className="bg-ssa-gold/90 backdrop-blur-sm text-[#131212] px-6 py-3 text-sm font-semibold rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center gap-2">
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ssa-gold/30 to-yellow-400/20 flex items-center justify-center">
                          <span className="text-lg">✨</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-ssa-gold transition-all duration-300">
                        {service.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {stripHtml(service.description)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ) : null
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-14"
        >
          <Button
            asChild
            className="bg-ssa-gold hover:bg-ssa-gold/90 text-gray-900 font-semibold transition-all duration-300 px-8 py-4 rounded-lg hover:scale-105 hover:shadow-lg shadow-ssa-gold/10 group"
            size="lg"
          >
            <Link
              to="/services"
              className="flex items-center text-base gap-2"
            >
              View All Services
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
