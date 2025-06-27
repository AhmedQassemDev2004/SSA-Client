import { Link } from "react-router-dom";

interface NavLinksProps {
  currentPath: string;
}

export const NavLinks = ({ currentPath }: NavLinksProps) => {
  // For the homepage, we use hash links
  if (currentPath === '/') {
    return (
      <>
        <a href="#home" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
          Home
        </a>
        <a href="#services" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
          Services
        </a>
        <a href="#portfolios" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
          Portfolio
        </a>
        <a href="#about" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
          About
        </a>
        <a href="#testimonials" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
          Testimonials
        </a>
        <a href="#contact" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
          Contact
        </a>
      </>
    );
  }
  
  // For other pages, we use router links
  return (
    <>
      <Link to="/" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
        Home
      </Link>
      <Link to="/services" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
        Services
      </Link>
      <Link to="/portfolios" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
        Portfolio
      </Link>
      <Link to="/#about" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
        About
      </Link>
      <Link to="/#testimonials" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
        Testimonials
      </Link>
      <Link to="/#contact" className="text-white hover:text-ssa-gold transition-colors font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ssa-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
        Contact
      </Link>
    </>
  );
};
