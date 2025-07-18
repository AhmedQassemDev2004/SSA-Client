import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useScroll } from '@/contexts/ScrollContext';

const ScrollToTop: React.FC = () => {
  const { isScrollToTopVisible } = useScroll();

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <AnimatePresence>
      {isScrollToTopVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-ssa-gold to-ssa-goldLight text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 20px rgba(145, 114, 67, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp className="w-6 h-6 group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop; 