import { Link } from "react-router-dom";

interface MobileNavLinksProps {
  currentPath: string;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const MobileNavLinks = ({ currentPath, setIsMenuOpen }: MobileNavLinksProps) => {
  // For the homepage
  if (currentPath === '/') {
    return (
      <>
        <a href="#home" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
          Home
        </a>
        <a href="#services" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
          Services
        </a>
        <Link to="/services" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
          All Services
        </Link>
        <a href="#portfolios" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
          Portfolio
        </a>
        <a href="#about" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
          About
        </a>
        <a href="#testimonials" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
          Testimonials
        </a>
        <a href="#contact" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
          Contact
        </a>
      </>
    );
  }

  // For other pages
  return (
    <>
      <Link to="/" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
        Home
      </Link>
      <Link to="/services" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
        Services
      </Link>
      <Link to="/portfolios" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
        Portfolio
      </Link>
      <Link to="/#about" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
        About
      </Link>
      <Link to="/#testimonials" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
        Testimonials
      </Link>
      <Link to="/#contact" className="text-white hover:text-ssa-gold transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
        Contact
      </Link>
    </>
  );
};
