import React, { memo } from "react";
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

// Memoized components to prevent unnecessary re-renders
const MemoizedHero = memo(Hero);
const MemoizedAbout = memo(About);
const MemoizedPortfolios = memo(Portfolios);
const MemoizedServices = memo(Services);
const MemoizedTestimonials = memo(Testimonials);
const MemoizedContact = memo(Contact);
const MemoizedFooter = memo(Footer);

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
      className="relative min-h-screen bg-[#131212]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <AnimatedBackgroundWrapper />
      
      {/* Progress Bar */}
      <ProgressBar />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="content-section"
      >
        <motion.div variants={sectionVariants}>
          <MemoizedHero isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <MemoizedAbout isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <MemoizedPortfolios isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <MemoizedServices isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <MemoizedTestimonials isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <MemoizedContact isMobile={isMobile} />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <MemoizedFooter isMobile={isMobile} />
        </motion.div>
      </motion.div>
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
};

export default memo(Index);
