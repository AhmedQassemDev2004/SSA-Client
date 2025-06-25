import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen = ({ text }: LoadingScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-[#131212] via-[#1a1a1a] to-[#231f20] flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.18) 1.5px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.18) 1.5px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Decorative orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-ssa-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ssa-gold/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Loading spinner */}
      <LoadingSpinner size="lg" text={text} />
    </motion.div>
  );
};

export default LoadingScreen;
