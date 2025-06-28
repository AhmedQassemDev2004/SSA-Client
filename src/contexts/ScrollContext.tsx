import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from 'react';

interface ScrollContextType {
  scrollY: number;
  scrollProgress: number;
  isScrolled: boolean;
  isScrollToTopVisible: boolean;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollProviderProps {
  children: ReactNode;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);
  
  const ticking = useRef(false);
  const lastProgressRef = useRef(0);

  const updateScrollState = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (currentScrollY / docHeight) * 100;
        const clampedProgress = Math.min(progress, 100);
        
        // Update scroll Y
        setScrollY(currentScrollY);
        
        // Update scroll progress (only if significant change)
        if (Math.abs(clampedProgress - lastProgressRef.current) > 1) {
          setScrollProgress(clampedProgress);
          lastProgressRef.current = clampedProgress;
        }
        
        // Update scrolled state
        const shouldBeScrolled = currentScrollY > 20;
        setIsScrolled(shouldBeScrolled);
        
        // Update scroll to top visibility
        const shouldShowScrollToTop = currentScrollY > 300;
        setIsScrollToTopVisible(shouldShowScrollToTop);
        
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState(); // Initial calculation
    
    return () => window.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const value = useMemo<ScrollContextType>(() => ({
    scrollY,
    scrollProgress,
    isScrolled,
    isScrollToTopVisible,
  }), [scrollY, scrollProgress, isScrolled, isScrollToTopVisible]);

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}; 