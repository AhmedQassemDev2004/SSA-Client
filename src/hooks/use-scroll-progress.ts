import { useState, useEffect, useRef, useCallback } from 'react';

export const useScrollProgress = (throttleMs: number = 16) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastUpdateRef = useRef(0);
  const lastProgressRef = useRef(0);

  const updateScrollProgress = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current < throttleMs) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    const clampedProgress = Math.min(progress, 100);

    // Only update if there's a significant change (more than 1%)
    if (Math.abs(clampedProgress - lastProgressRef.current) > 1) {
      setScrollProgress(clampedProgress);
      lastProgressRef.current = clampedProgress;
      lastUpdateRef.current = now;
    }
  }, [throttleMs]);

  useEffect(() => {
    const throttledUpdate = () => {
      requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    updateScrollProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', throttledUpdate);
  }, [updateScrollProgress]);

  return scrollProgress;
}; 