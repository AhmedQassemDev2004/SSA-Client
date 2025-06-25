import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import ServicesList from "@/components/ServicesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { api } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

const ServicesPage = () => {
  const titleAnimation = useScrollAnimation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.filter((category: Category) => category.active));
      } catch (e) {
        console.error("Failed to load categories:", e);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#131212] text-white">      
      <section className="pt-32 pb-20 relative">
        {/* Background accents */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>
        
        <div className="container mx-auto px-4">
          <div 
            ref={titleAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`text-center mb-16 ${titleAnimation.isInView ? 'animate-slide-up' : 'opacity-0'}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              <span className="text-white">Our</span>{" "}
              <span className="text-gradient-gold">Services</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Comprehensive marketing solutions designed to elevate your brand, engage your audience, and drive measurable results.
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:border-ssa-gold focus:ring-ssa-gold"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-[#1a1a1a] border-b border-gray-800 p-0 mb-8 w-full flex flex-wrap justify-center gap-2 md:gap-4">
              <TabsTrigger 
                value="all"
                className="py-3 px-5 bg-transparent data-[state=active]:bg-ssa-gold/10 data-[state=active]:text-ssa-gold rounded-lg transition-all duration-200"
              >
                All Services
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id.toString()}
                  className="py-3 px-5 bg-transparent data-[state=active]:bg-ssa-gold/10 data-[state=active]:text-ssa-gold rounded-lg transition-all duration-200"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ssa-gold"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96 text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  <ServicesList category="all" searchQuery={searchQuery} />
                </TabsContent>
                
                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id.toString()}>
                    <ServicesList category={category.id.toString()} searchQuery={searchQuery} />
                  </TabsContent>
                ))}
              </>
            )}
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;
