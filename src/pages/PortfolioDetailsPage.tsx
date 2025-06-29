import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import DOMPurify from "dompurify";
import he from "he";
import { getImageUrl, stripHtml } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

interface Portfolio {
  id: number;
  title: string;
  description: string;
  images: string[];
  links: string[];
  service: {
    id: number;
    name: string;
    description: string;
  };
}

const PortfolioDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const titleAnimation = useScrollAnimation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get<Portfolio>(`/portfolios/${id}`);
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setError("Unable to load portfolio details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  const nextImage = () => {
    if (!portfolio?.images.length) return;
    setCurrentImageIndex((prev) =>
      prev === portfolio.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!portfolio?.images.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? portfolio.images.length - 1 : prev - 1
    );
  };

  const cleaned = (portfolio?.description || "").replace(
    /<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi,
    ""
  );
  const decoded = he.decode(cleaned);
  const htmlDesc = DOMPurify.sanitize(decoded);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131212] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-ssa-gold animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#131212] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error || "Portfolio not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131212] text-white">
      <Navbar />

      <section className="pt-20 sm:pt-28 pb-12 sm:pb-20 relative overflow-hidden">
        {/* Floating Accent Lights */}
        <div className="absolute top-1/3 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-ssa-gold/10 blur-3xl rounded-full animate-pulse-gold" />
        <div className="absolute bottom-1/4 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-ssa-gold/10 blur-3xl rounded-full animate-pulse-gold" />

        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          {/* Back Link */}
          <Button asChild variant="ghost" className="mb-4 sm:mb-6 text-gray-400 hover:text-ssa-gold">
            <Link to="/portfolios" className="flex items-center text-sm sm:text-base">
              <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Back to Portfolios
            </Link>
          </Button>

          {/* Title + Description */}
          <motion.div
            ref={titleAnimation.ref as React.RefObject<HTMLDivElement>}
            className="mb-12 sm:mb-16"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading bg-gradient-to-r from-ssa-gold via-white to-ssa-gold bg-clip-text text-transparent animate-gradient-x leading-tight">
                {portfolio.title}
              </h1>
              <span className="inline-block max-h-fit text-xs sm:text-sm font-medium text-ssa-gold border border-ssa-gold/30 rounded-full px-3 sm:px-4 py-1 bg-ssa-gold/10 backdrop-blur-sm">
                {portfolio.service.name}
              </span>
            </div>
            <div
              className="prose prose-invert max-w-3xl [&_p]:my-2 [&_ul]:my-2 [&_p]:text-sm sm:[&_p]:text-base [&_h1]:text-lg sm:[&_h1]:text-xl [&_h2]:text-base sm:[&_h2]:text-lg [&_h3]:text-sm sm:[&_h3]:text-base [&_ul]:text-sm sm:[&_ul]:text-base [&_ol]:text-sm sm:[&_ol]:text-base"
              dangerouslySetInnerHTML={{ __html: htmlDesc }}
            />
          </motion.div>

          {/* Image Gallery */}
          <div className="relative mb-8 sm:mb-12">
            <div className="aspect-video w-full overflow-hidden rounded-lg sm:rounded-xl bg-gray-800/50 shadow-md">
              {portfolio.images.length > 0 ? (
                <img
                  src={getImageUrl(portfolio.images[currentImageIndex])}
                  alt={`Portfolio Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm sm:text-base">
                  No images available
                </div>
              )}
            </div>

            {/* Carousel Controls */}
            {portfolio.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={previousImage}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </Button>
              </>
            )}

            {/* Thumbnails */}
            {portfolio.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5 overflow-x-auto pb-2">
                {portfolio.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      currentImageIndex === idx
                        ? "ring-2 ring-ssa-gold"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio Links */}
          {portfolio.links && portfolio.links.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
                Project Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {portfolio.links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 sm:p-4 bg-[#1a1a1a]/50 border border-gray-800 rounded-lg hover:border-ssa-gold/50 transition-all duration-300 group"
                  >
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-ssa-gold rounded-full group-hover:scale-125 transition-transform flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-300 group-hover:text-ssa-gold transition-colors truncate">
                      {link}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Service Info */}
          <div className="bg-[#1a1a1a]/50 border border-ssa-gold/30 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-md backdrop-blur">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">About the Service</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">{stripHtml(portfolio.service.description)}</p>
            <Button asChild className="bg-ssa-gold hover:bg-ssa-gold/90 text-[#131212] font-medium text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
              <Link to={`/services/${portfolio.service.id}`}>
                Learn More About {portfolio.service.name}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PortfolioDetailsPage;
