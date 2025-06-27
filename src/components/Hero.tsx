import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  isMobile?: boolean;
}

const Hero: React.FC<HeroProps> = ({ isMobile }) => {
  const stats = [
    { number: "150+", label: "Clients Served", icon: Users },
    { number: "300%", label: "Avg Growth", icon: TrendingUp },
    { number: "95%", label: "Success Rate", icon: Target },
    { number: "24/7", label: "Support", icon: Zap },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "backOut" },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen relative flex items-center pt-16 overflow-hidden"
    >
      {/* Modern, subtle animated background with blurred color blobs and soft grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blurred color blobs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-ssa-gold/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-100/20 rounded-full blur-2xl"
        />
        {/* Subtle animated grid overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }} // Increased opacity for more obvious grid
          transition={{ duration: 2, delay: 1 }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 215, 0, 0.18) 1.5px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.18) 1.5px, transparent 1px)', // Brighter gold, thicker lines
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                whileHover={{ scale: 1.08 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-ssa-gold/20 border border-ssa-gold/30 text-ssa-gold text-base font-semibold shadow-md shadow-ssa-gold/10 mb-4 cursor-pointer backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                </motion.div>
                Your growth partner
              </motion.div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-lg">
                <motion.span
                  variants={itemVariants}
                  className="block"
                  whileHover={{ scale: 1.03, color: '#fffbe6' }}
                >
                  Elevate Your
                </motion.span>
                <motion.span
                  variants={itemVariants}
                  className="block bg-gradient-to-r from-ssa-gold via-yellow-100 to-ssa-gold bg-clip-text text-transparent animate-gradient-x"
                  whileHover={{ scale: 1.07 }}
                >
                  Brand Experience
                </motion.span>
                <motion.span
                  variants={itemVariants}
                  className="block"
                  whileHover={{ scale: 1.03, color: '#fffbe6' }}
                >
                  With SSA
                </motion.span>
              </h1>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-gray-200 text-xl md:text-2xl max-w-xl leading-relaxed drop-shadow"
              whileHover={{ color: "#fffbe6" }}
            >
              We craft immersive digital journeys and marketing strategies that captivate, convert, and grow your business. Let's make your brand unforgettable.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="transition-all duration-200"
              >
                <Button className="bg-ssa-gold text-[#131212] hover:bg-ssa-gold/80 text-lg px-8 py-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 group relative overflow-hidden border-0">
                  <a href="#services" className="relative z-10 flex items-center font-semibold">
                    Our Services
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="transition-all duration-200"
              >
                <Button
                  variant="outline"
                  className="border-ssa-gold text-ssa-gold hover:bg-ssa-gold/10 text-lg px-8 py-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 group"
                  asChild
                >
                  <a href="#contact" className="relative z-10 flex items-center font-semibold scroll-smooth">
                    Get Quote
                    <span className="ml-2">
                      {/* Mail icon (Lucide or similar) */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.091 7.091a2.25 2.25 0 01-3.182 0L3.909 8.584A2.25 2.25 0 013.25 6.993V6.75" />
                      </svg>
                    </span>
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {!isMobile && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center min-h-[400px]"
            >
              {/* Modern floating glass card with layered depth and subtle floating animation */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-full max-w-md mx-auto"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-ssa-gold/20">
                  {/* Glass effect */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border border-ssa-gold/20 rounded-3xl z-0" />
                  {/* Animated gold gradient ring */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-2 rounded-[2rem] border-4 border-transparent bg-gradient-to-tr from-ssa-gold/60 via-yellow-100/40 to-ssa-gold/60 bg-[length:200%_200%] animate-gradient-x pointer-events-none z-10"
                    style={{ maskImage: 'linear-gradient(white, white), linear-gradient(white, white)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
                  />
                  {/* Content */}
                  <div className="relative z-20 flex flex-col items-center justify-center py-16 px-8">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 0.5, type: 'spring' }}
                      className="text-7xl md:text-8xl font-extrabold text-ssa-gold drop-shadow-lg mb-4 font-heading"
                    >
                      Strategy Stars Ads
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 1 }}
                      className="text-2xl md:text-3xl text-white font-bold mb-2 text-center"
                    >
                      Strategy Stars Ads
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="text-base text-gray-200 text-center"
                    >
                      Your Growth Partner
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center group"
            >
              <motion.div
                className="relative mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-ssa-gold/20 to-yellow-400/20 border border-ssa-gold/30 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <stat.icon className="w-8 h-8 text-ssa-gold" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-ssa-gold/10 to-transparent"
                  animate={{ 
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                />
              </motion.div>
              <motion.div
                className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-ssa-gold transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                {stat.number}
              </motion.div>
              <motion.div
                className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
