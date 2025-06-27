import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolios from "@/components/Portfolios";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedBackgroundWrapper from "@/components/AnimatedBackgroundWrapper";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  // Animation variants for staggered section reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#131212] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Progress Bar */}
      <ProgressBar />
      
      {/* Animated Background (appears after hero) - only on desktop */}
      {!isMobile && <AnimatedBackgroundWrapper />}
      
      {/* Hero section background elements - only on desktop */}
      {!isMobile && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-ssa-gold/5 blur-3xl rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-ssa-gold/3 blur-3xl rounded-full"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-ssa-gold/4 blur-3xl rounded-full"
            animate={{
              x: [0, 120, 0],
              y: [0, -80, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 10,
            }}
          />
        </div>
      )}

      <Navbar />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="content-section"
      >
        <motion.div variants={sectionVariants}>
          <Hero isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <About isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Portfolios isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Services isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Testimonials isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Contact isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Footer isMobile={isMobile} />
        </motion.div>
      </motion.div>
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
};

export default Index;
