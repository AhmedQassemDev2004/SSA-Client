import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [messageError, setMessageError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear message error when user starts typing
    if (name === "message") {
      setMessageError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate message length
    if (formData.message.length < 10) {
      setMessageError("Message must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/contacts", formData);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setMessageError("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-ssa-gold/10 rounded-tl-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Get in</span>{" "}
            <span className="text-ssa-gold">Touch</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Ready to take your marketing to the next level? Contact us for a free consultation and discover how SSA can help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Contact Information</h3>
              <p className="text-gray-300">Fill out the form or contact us directly using the information below.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ssa-gold/20 flex items-center justify-center mr-4">
                  <span className="text-ssa-gold">📍</span>
                </div>
                <div>
                  <p className="text-white">123 Marketing Street, Business District</p>
                  <p className="text-gray-400">New York, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ssa-gold/20 flex items-center justify-center mr-4">
                  <span className="text-ssa-gold">📱</span>
                </div>
                <div>
                  <p className="text-white">+1 (555) 123-4567</p>
                  <p className="text-gray-400">Mon-Fri, 9AM-6PM</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ssa-gold/20 flex items-center justify-center mr-4">
                  <span className="text-ssa-gold">✉️</span>
                </div>
                <div>
                  <p className="text-white">contact@ssaagency.com</p>
                  <p className="text-gray-400">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-[#1a1a1a] rounded-xl border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#242424] border-gray-700 text-white" 
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[#242424] border-gray-700 text-white" 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <Input 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="bg-[#242424] border-gray-700 text-white" 
                  placeholder="How can we help you?" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <Textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`bg-[#242424] border-gray-700 text-white h-32 ${messageError ? 'border-red-500' : ''}`}
                  placeholder="Tell us about your project..." 
                  required 
                />
                {messageError && (
                  <p className="mt-1 text-sm text-red-500">{messageError}</p>
                )}
                <p className="mt-1 text-sm text-gray-400">
                  {formData.message.length}/10 characters minimum
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ssa-gold text-[#131212] hover:bg-ssa-gold/80"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
