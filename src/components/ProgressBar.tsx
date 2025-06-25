import React from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/use-scroll-progress';

interface ProgressBarProps {
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ className = '' }) => {
  const scrollProgress = useScrollProgress();

  return (
    <motion.div 
      className={`progress-bar ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="progress-bar-fill"
        style={{ width: `${scrollProgress}%` }}
        transition={{ 
          duration: 0.1, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
      />
    </motion.div>
  );
};

export default ProgressBar; 