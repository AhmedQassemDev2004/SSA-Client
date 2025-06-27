import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "CEO, TechNova",
    content: "SSA transformed our digital presence completely. Their strategic approach and attention to detail helped us increase our conversions by 40% within just three months.",
    rating: 5,
  },
  {
    name: "Michael Chang",
    position: "Marketing Director, Elevate Retail",
    content: "Working with SSA has been a game-changer for our brand. Their team is responsive, creative, and delivers results that exceed expectations every time.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    position: "Founder, GreenLife",
    content: "SSA understood our vision and translated it into a compelling brand strategy. Their work helped us connect with our target audience and grow our customer base significantly.",
    rating: 5,
  },
];

interface TestimonialsProps {
  isMobile?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ isMobile }) => {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-20 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1/2 bg-ssa-gold/5 blur-3xl rounded-full animate-pulse-gold"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Client</span>{" "}
            <span className="text-gradient-gold">Testimonials</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Don't take our word for it. Here's what our clients have to say about working with SSA.
          </p>
        </motion.div>

        {isMobile ? (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-[#1a1a1a] border border-gray-800 hover:border-ssa-gold/30 transition-all duration-300 h-full shadow-lg">
                    <CardContent className="p-8 flex flex-col items-center">
                      <div className="mb-4">
                        {[...Array(testimonials[current].rating)].map((_, i) => (
                          <span key={i} className="text-ssa-gold text-xl">★</span>
                        ))}
                      </div>
                      <p className="text-gray-300 mb-6 text-lg text-center">"{testimonials[current].content}"</p>
                      <div className="text-center">
                        <p className="font-semibold text-white font-heading text-lg">{testimonials[current].name}</p>
                        <p className="text-ssa-gold text-sm">{testimonials[current].position}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <button
                aria-label="Previous testimonial"
                onClick={handlePrev}
                className="p-2 rounded-full bg-ssa-gold/20 hover:bg-ssa-gold/40 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-ssa-gold" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === current ? "bg-ssa-gold" : "bg-gray-700"}`}
                  />
                ))}
              </div>
              <button
                aria-label="Next testimonial"
                onClick={handleNext}
                className="p-2 rounded-full bg-ssa-gold/20 hover:bg-ssa-gold/40 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-ssa-gold" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="bg-[#1a1a1a] border border-gray-800 hover:border-ssa-gold/30 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-ssa-gold text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-white font-heading">{testimonial.name}</p>
                      <p className="text-ssa-gold text-sm">{testimonial.position}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
