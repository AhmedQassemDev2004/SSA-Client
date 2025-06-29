import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { api } from '@/lib/api';
import { Switch } from "@/components/ui/switch";
import DOMPurify from "dompurify"
import { useToast } from "@/hooks/use-toast";
import { OrderServiceDialog } from '@/components/OrderServiceDialog';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface Portfolio {
  id: number;
  title: string;
  description: string;
  clientName: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  portfolios: Portfolio[];
  active: boolean;
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [clickStartY, setClickStartY] = useState<number | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get<Service>(`/services/${id}`);
        setService(response.data);
      } catch (error) {
        console.error('Failed to fetch service:', error);
        setError('Failed to load service details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleNextImage = useCallback(() => {
    if (!service) return;
    const nextIndex = (currentImageIndex + 1) % service.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(service.images[nextIndex]);
  }, [currentImageIndex, service]);

  const handlePrevImage = useCallback(() => {
    if (!service) return;
    const prevIndex = (currentImageIndex - 1 + service.images.length) % service.images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(service.images[prevIndex]);
  }, [currentImageIndex, service]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && service?.images.length) {
      interval = setInterval(handleNextImage, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, service?.images.length, handleNextImage]);

  // Add scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      // Reset scrolling state after 150ms of no scroll
      const timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
      return () => clearTimeout(timeout);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageClick = (e: React.MouseEvent) => {
    // Only open modal if it's a direct click (not during scroll)
    if (!isScrolling && Math.abs(e.clientY - (clickStartY || 0)) < 5) {
      setSelectedImage(service?.images[currentImageIndex] || null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setClickStartY(e.clientY);
  };


  const descHtml = DOMPurify.sanitize(service?.description);
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131212]">
        <Loader2 className="w-12 h-12 text-ssa-gold animate-spin" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131212]">
        <p className="text-red-500 text-lg">{error || 'Service not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131212] pt-20 sm:pt-24 pb-6 sm:pb-10 px-3 sm:px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#222]/80 backdrop-blur-sm border border-gray-800 shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8"
        >
          {/* Service Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent leading-tight"
              >
                {service.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full sm:w-auto"
              >
                <Button
                  onClick={() => setIsOrderDialogOpen(true)}
                  className="w-full sm:w-auto bg-ssa-gold hover:bg-ssa-gold hover:px-6 sm:hover:px-10 text-gray-900 font-medium transition-all px-4 sm:px-8 py-3 sm:py-6 text-base sm:text-lg"
                >
                  Order This Service
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="prose prose-invert prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-200 [&_p]:text-sm sm:[&_p]:text-base [&_h1]:text-xl sm:[&_h1]:text-2xl [&_h2]:text-lg sm:[&_h2]:text-xl [&_h3]:text-base sm:[&_h3]:text-lg [&_ul]:text-sm sm:[&_ul]:text-base [&_ol]:text-sm sm:[&_ol]:text-base"
              dangerouslySetInnerHTML={{__html:descHtml}}
            ></motion.div>
          </div>

          {/* Service Images Carousel */}
          {service.images.length > 0 ? (
            <div className="relative mb-12 sm:mb-16 overflow-hidden rounded-lg sm:rounded-xl">
              <div 
                className="relative aspect-[16/9] sm:aspect-[21/9] cursor-pointer"
                onClick={handleImageClick}
                onMouseDown={handleMouseDown}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={getImageUrl(service.images[currentImageIndex])}
                    alt={`${service.name} - ${currentImageIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                
                {/* Navigation Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-300 z-10"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-300 z-10"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoPlaying(!isAutoPlaying);
                  }}
                  className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-300 z-10"
                >
                  {isAutoPlaying ? (
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/50 px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm backdrop-blur-sm z-10">
                  {currentImageIndex + 1} / {service.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2">
                {service.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`relative flex-shrink-0 w-16 h-10 sm:w-20 sm:h-12 rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-ssa-gold' : ''
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 sm:h-72 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg sm:rounded-xl border border-gray-800/50 mb-12 sm:mb-16">
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-700 mb-3 sm:mb-4" />
                <span className="text-sm sm:text-lg text-gray-600">No images available</span>
              </div>
            </div>
          )}

          {/* Portfolio Section */}
          {service?.portfolios?.length > 0 && (
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent mb-6 sm:mb-8"
              >
                Our Work  
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {service.portfolios.map((portfolio, index) => (
                  <motion.div
                    key={portfolio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#222] border border-gray-800 hover:border-ssa-gold/50 shadow-lg hover:shadow-ssa-gold/10 transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden group"
                  >
                    {portfolio.images.length > 0 ? (
                      <div className="relative group overflow-hidden">
                        <img
                          src={getImageUrl(portfolio.images[0])}
                          alt={portfolio.title}
                          className="w-full h-40 sm:h-48 md:h-56 object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {portfolio.images.length > 1 && (
                          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/70 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm backdrop-blur-sm">
                            +{portfolio.images.length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 sm:h-48 md:h-56 bg-gradient-to-br from-gray-800/30 to-gray-900/30">
                        <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-700" />
                      </div>
                    )}
                    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-3">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">{portfolio.title}</h3>
                      <Link to={`/portfolios/${portfolio.id}`} className="flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 sm:px-4 py-2 bg-ssa-gold/10 text-ssa-gold rounded-lg hover:bg-ssa-gold/20 transition-colors duration-300 text-sm sm:text-base"
                        >
                          View Details
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Service Dialog */}
      <OrderServiceDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        serviceId={service?.id || 0}
        serviceName={service?.name || ''}
      />
    </div>
  );
};

export default ServiceDetail;
