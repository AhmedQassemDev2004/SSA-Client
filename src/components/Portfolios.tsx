import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getImageUrl } from "@/lib/utils";

interface PortfoliosProps {
  isMobile?: boolean;
}

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

const Portfolios: React.FC<PortfoliosProps> = ({ isMobile }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
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

  const visiblePortfolios = portfolios.slice(0, 6);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? visiblePortfolios.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrent((prev) => (prev === visiblePortfolios.length - 1 ? 0 : prev + 1));
  };

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
    <section id="portfolios" className="py-20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          ref={titleAnimation.ref as React.RefObject<HTMLDivElement>}
          className="text-center mb-16 animate-slide-up"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            <span className="text-white">Our</span>{" "}
            <span className="text-gradient-gold">Projects</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Explore our latest projects and see how we've helped businesses achieve their goals through innovative marketing solutions.
          </p>
        </motion.div>

        {isMobile ? (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                {visiblePortfolios.length > 0 && (
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#222] border border-gray-800 hover:border-ssa-gold/50 shadow-lg hover:shadow-ssa-gold/10 transition-all duration-300 h-full group overflow-hidden">
                      <CardHeader className="p-0 relative">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={visiblePortfolios[current].images && visiblePortfolios[current].images.length > 0 
                              ? getImageUrl(visiblePortfolios[current].images[0])
                              : "/placeholder.svg"}
                            alt={visiblePortfolios[current].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              asChild 
                              className="bg-ssa-gold hover:bg-ssa-gold/90 text-[#131212] px-6 py-2 text-base font-medium shadow-lg hover:shadow-ssa-gold/20 transition-all duration-300 hover:scale-105"
                            >
                              <Link to={`/portfolios/${visiblePortfolios[current].id}`} className="flex items-center">
                                View Details <ArrowRight className="ml-2 h-5 w-5" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm text-ssa-gold border border-ssa-gold/30 rounded-full px-3 py-1 bg-ssa-gold/10 backdrop-blur-sm">
                            {visiblePortfolios[current].service.name}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-ssa-gold transition-all duration-300">
                          {visiblePortfolios[current].title}
                        </h3>
                        <Button 
                          asChild 
                          variant="ghost" 
                          className="w-full mt-4 text-gray-400 hover:text-ssa-gold border border-gray-700 hover:border-ssa-gold/30 transition-all duration-300"
                        >
                          <Link to={`/services/${visiblePortfolios[current].service.id}`} className="flex items-center justify-center">
                            View Service <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <button
                aria-label="Previous portfolio"
                onClick={handlePrev}
                className="p-2 rounded-full bg-ssa-gold/20 hover:bg-ssa-gold/40 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-ssa-gold" />
              </button>
              <div className="flex gap-2">
                {visiblePortfolios.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === current ? "bg-ssa-gold" : "bg-gray-700"}`}
                  />
                ))}
              </div>
              <button
                aria-label="Next portfolio"
                onClick={handleNext}
                className="p-2 rounded-full bg-ssa-gold/20 hover:bg-ssa-gold/40 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-ssa-gold" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePortfolios.map((portfolio, index) => (
              <motion.div
                key={portfolio.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#222] border border-gray-800 hover:border-ssa-gold/50 shadow-lg hover:shadow-ssa-gold/10 transition-all duration-300 h-full group overflow-hidden">
                  <CardHeader className="p-0 relative">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={portfolio.images && portfolio.images.length > 0 
                          ? getImageUrl(portfolio.images[0])
                          : "/placeholder.svg"}
                        alt={portfolio.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          asChild 
                          className="bg-ssa-gold hover:bg-ssa-gold/90 text-[#131212] px-6 py-2 text-base font-medium shadow-lg hover:shadow-ssa-gold/20 transition-all duration-300 hover:scale-105"
                        >
                          <Link to={`/portfolios/${portfolio.id}`} className="flex items-center">
                            View Details <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-ssa-gold border border-ssa-gold/30 rounded-full px-3 py-1 bg-ssa-gold/10 backdrop-blur-sm">
                        {portfolio.service.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-ssa-gold transition-all duration-300">
                      {portfolio.title}
                    </h3>
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="w-full mt-4 text-gray-400 hover:text-ssa-gold border border-gray-700 hover:border-ssa-gold/30 transition-all duration-300"
                    >
                      <Link to={`/services/${portfolio.service.id}`} className="flex items-center justify-center">
                        View Service <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View More Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Button 
            asChild 
            className="bg-ssa-gold hover:bg-ssa-gold/90 text-gray-900 font-medium transition-all duration-300 px-8 py-6 hover:scale-105 hover:shadow-lg hover:shadow-ssa-gold/20 group"
            size="lg"
          >
            <Link to="/portfolios">
              View All Portfolios <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolios;
