import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

const AnimatedBackgroundWrapper: React.FC = () => {
  const [isAfterHero, setIsAfterHero] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero is not intersecting (scrolled past it), show animated background
        setIsAfterHero(!entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of hero is out of view
        rootMargin: '-50px 0px 0px 0px' // Add some margin for smoother transition
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Invisible marker for hero section */}
      <div ref={heroRef} className="absolute top-0 left-0 w-full h-screen pointer-events-none" />
      
      {/* Animated Background */}
      <AnimatePresence>
        {isAfterHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <AnimatedBackground />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedBackgroundWrapper; 