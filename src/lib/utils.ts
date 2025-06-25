import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Strip HTML tags from text
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Utility function to construct proper image URLs without double slashes
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Get the API base URL and ensure it doesn't end with a slash
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanApiBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  // If the image path starts with a slash, concatenate directly
  if (imagePath.startsWith('/')) {
    return `${cleanApiBaseUrl}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads
  return `${cleanApiBaseUrl}/uploads/${imagePath}`;
}

// Utility to suppress ReactQuill warnings
export function suppressReactQuillWarnings() {
  // Suppress findDOMNode warnings
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string') {
      const message = args[0];
      if (message.includes('findDOMNode') || 
          message.includes('DOMNodeInserted') ||
          message.includes('react-quill')) {
        return; // Suppress these specific warnings
      }
    }
    originalConsoleWarn.apply(console, args);
  };

  // Suppress deprecation warnings
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string') {
      const message = args[0];
      if (message.includes('DOMNodeInserted') ||
          message.includes('react-quill')) {
        return; // Suppress these specific errors
      }
    }
    originalConsoleError.apply(console, args);
  };

  return () => {
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  };
}
