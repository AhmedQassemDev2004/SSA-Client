import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, Award, Users, Target, TrendingUp, Globe, Shield, Zap } from "lucide-react";

interface AboutProps {
  isMobile?: boolean;
}

const About: React.FC<AboutProps> = ({ isMobile }) => {
  const achievements = [
    { number: "10+", label: "Years Experience", icon: Award },
    { number: "250+", label: "Happy Clients", icon: Users },
    { number: "500+", label: "Projects Completed", icon: Target },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
  ];

  const values = [
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for excellence in every project, delivering outstanding results that exceed expectations."
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Building lasting relationships through transparency, reliability, and consistent delivery."
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Embracing cutting-edge technologies and creative solutions to stay ahead of the curve."
    },
    {
      icon: Zap,
      title: "Results",
      description: "Focusing on measurable outcomes and tangible business growth for our clients."
    }
  ];

  return (
    <section id="about" className="min-h-screen py-20 relative flex items-center">
      {/* Elegant background with subtle patterns */}
      <div className="absolute inset-0 "></div>
      
      {/* Subtle geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-ssa-gold/30 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-ssa-gold/20 rotate-12"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-ssa-gold/25 rotate-90"></div>
      </div>

      {/* Floating accent elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-ssa-gold/3 blur-3xl rounded-full"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-ssa-gold/2 blur-3xl rounded-full"
        animate={{
          x: [0, -25, 0],
          y: [0, 30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-ssa-gold/10 border border-ssa-gold/20 text-ssa-gold text-lg font-medium mb-8 backdrop-blur-sm"
            >
              <Star className="w-5 h-5 mr-2" />
              About Our Agency
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold mb-8"
            >
              <span className="text-white">Strategic Stars</span>{" "}
              <span className="text-gradient-gold">Agency</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              We are a premier marketing agency dedicated to transforming businesses through innovative strategies, 
              creative excellence, and data-driven results. Since our founding in 2010, we've been the trusted 
              partner for companies seeking to elevate their brand presence and achieve sustainable growth.
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Column - Story */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold text-white mb-6"
                >
                  Our Story
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-lg text-gray-300 leading-relaxed"
                >
                  Founded with a vision to bridge the gap between traditional marketing and digital innovation, 
                  SSA has evolved into a comprehensive marketing powerhouse. Our journey began with a simple 
                  belief: that every business deserves access to world-class marketing strategies.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-lg text-gray-300 leading-relaxed"
                >
                  Today, we serve clients across diverse industries, from startups to Fortune 500 companies, 
                  helping them navigate the complex digital landscape and achieve remarkable results. Our 
                  team of seasoned professionals brings together expertise in strategy, design, technology, 
                  and analytics to deliver comprehensive solutions.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="text-lg text-gray-300 leading-relaxed"
                >
                  We believe in the power of collaboration, innovation, and continuous learning. Every 
                  project is an opportunity to push boundaries, explore new possibilities, and create 
                  meaningful impact for our clients and their audiences.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="pt-6"
              >
              </motion.div>
            </motion.div>

            {/* Right Column - Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-white mb-8"
              >
                Our Achievements
              </motion.h3>

              <div className="grid grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#222] border border-gray-800 rounded-xl p-6 text-center backdrop-blur-sm"
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ssa-gold/20 to-yellow-400/20 border border-ssa-gold/30 flex items-center justify-center"
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
                          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <achievement.icon className="w-8 h-8 text-ssa-gold" />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="text-3xl font-bold text-white mb-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      {achievement.number}
                    </motion.div>
                    <div className="text-sm text-gray-400">{achievement.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
