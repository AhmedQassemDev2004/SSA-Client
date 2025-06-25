import React from "react";
import {Separator} from "@/components/ui/separator";

const Footer = () => {
    return (
        <footer className="bg-[#0c0c0c] border-t border-gray-800 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="text-xl font-bold text-ssa-gold mb-4">SSA</h3>
                        <p className="text-gray-400 mb-4">
                            Strategic Success Agency helps businesses grow through innovative marketing solutions and
                            data-driven strategies.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-ssa-gold transition-colors">Digital
                                Marketing</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-ssa-gold transition-colors">Brand
                                Strategy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-ssa-gold transition-colors">Content
                                Creation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-ssa-gold transition-colors">Social
                                Media</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-ssa-gold transition-colors">SEO
                                Optimization</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#about" className="text-gray-400 hover:text-ssa-gold transition-colors">About
                                Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-ssa-gold transition-colors">Our Team</a>
                            </li>
                            <li><a href="#" className="text-gray-400 hover:text-ssa-gold transition-colors">Careers</a>
                            </li>
                            <li><a href="#" className="text-gray-400 hover:text-ssa-gold transition-colors">Blog</a>
                            </li>
                            <li><a href="#contact"
                                   className="text-gray-400 hover:text-ssa-gold transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="#"
                               className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-ssa-gold hover:bg-ssa-gold hover:text-[#131212] transition-colors">
                                <span>f</span>
                            </a>
                            <a href="#"
                               className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-ssa-gold hover:bg-ssa-gold hover:text-[#131212] transition-colors">
                                <span>in</span>
                            </a>
                            <a href="#"
                               className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-ssa-gold hover:bg-ssa-gold hover:text-[#131212] transition-colors">
                                <span>tw</span>
                            </a>
                            <a href="#"
                               className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-ssa-gold hover:bg-ssa-gold hover:text-[#131212] transition-colors">
                                <span>ig</span>
                            </a>
                        </div>
                        <p className="text-gray-400">
                            Subscribe to our newsletter for the latest marketing insights.
                        </p>
                    </div>
                </div>

                <Separator className="bg-gray-800"/>

                <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Strategic Success Agency. All rights reserved.<br/>
                        <span className="text-xs text-gray-500">Developed by <a href="mailto:ahmedqasem043@gmail.com"
                                                                                className="underline hover:text-ssa-gold">ahmedqasem043@gmail.com</a></span>
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-ssa-gold text-sm">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-ssa-gold text-sm">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-ssa-gold text-sm">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
