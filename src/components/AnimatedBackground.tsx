import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-ssa-gold/5 via-transparent to-ssa-gold/3" />
      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 left-1/6 w-32 h-32 border border-ssa-gold/20 rounded-full"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/3 right-1/4 w-24 h-24 border border-ssa-gold/15 rounded-lg"
        animate={{
          x: [0, -25, 0],
          y: [0, 15, 0],
          rotate: [0, -90, -180],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-20 h-20 border border-ssa-gold/10 rounded-full"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
      
      <motion.div
        className="absolute top-2/3 right-1/6 w-28 h-28 border border-ssa-gold/12 rounded-lg"
        animate={{
          x: [0, -15, 0],
          y: [0, 25, 0],
          rotate: [0, 45, 90],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
      />
      
      {/* Subtle particle effects */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-2 h-2 bg-ssa-gold/30 rounded-full"
        animate={{
          y: [0, -100, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-ssa-gold/25 rounded-full"
        animate={{
          y: [0, -80, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-ssa-gold/20 rounded-full"
        animate={{
          y: [0, -60, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(145, 114, 67, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(145, 114, 67, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground; 