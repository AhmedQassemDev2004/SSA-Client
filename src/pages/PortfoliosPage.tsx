import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getImageUrl } from "@/lib/utils";

interface Portfolio {
  id: number;
  title: string;
  description: string;
  images: string[];
  links: string[];
  service: {
    id: number;
    name: string;
  };
}

const PortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const titleAnimation = useScrollAnimation();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await api.get<Portfolio[]>("/portfolios");
        setPortfolios(response.data);
      } catch (error) {
        console.error("Failed to fetch portfolios:", error);
        setError("Failed to load portfolios. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const filteredPortfolios = portfolios.filter(portfolio =>
    portfolio.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131212] text-white">
        <Navbar />
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-ssa-gold animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#131212] text-white">
        <Navbar />
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131212] text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>

        <div className="container mx-auto px-4 relative">
          <motion.div 
            ref={titleAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`text-center mb-16 animate-slide-up`}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              <span className="text-white">Our</span>{" "}
              <span className="text-gradient-gold">Portfolio</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Explore our complete collection of projects and see how we've helped businesses achieve their goals through innovative marketing solutions.
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search portfolios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-800/50 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:border-ssa-gold focus:ring-ssa-gold"
              />
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((portfolio, index) => (
              <motion.div
                key={portfolio.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-[#1a1a1a]/40 border-ssa-gold/20 backdrop-blur-sm hover:border-ssa-gold/40 transition-all duration-300 h-full group">
                  <CardHeader className="p-0 relative overflow-hidden">
                    <div className="relative">
                      <img
                        src={portfolio.images && portfolio.images.length > 0 
                          ? getImageUrl(portfolio.images[0])
                          : "/placeholder.svg"}
                        alt={portfolio.title}
                        className="w-full h-64 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-ssa-gold border border-ssa-gold/30 rounded-full px-3 py-1">
                        {portfolio.service.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-6 group-hover:text-ssa-gold transition-colors">
                      {portfolio.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <Button asChild className="bg-ssa-gold hover:bg-ssa-gold/90 text-[#131212]">
                        <Link to={`/services/${portfolio.service.id}`} className="flex items-center">
                          View Service <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="text-gray-400 hover:text-ssa-gold">
                        <Link to={`/portfolios/${portfolio.id}`} className="flex items-center">
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPortfolios.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No portfolios found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PortfoliosPage; 