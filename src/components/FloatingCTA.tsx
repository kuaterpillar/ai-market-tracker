'use client';

import { useState, useEffect } from 'react';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <a
        href="#tools"
        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-full shadow-2xl shadow-violet-900/50 hover:shadow-violet-700/70 transform hover:scale-110 transition-all duration-300"
      >
        <span className="hidden sm:inline">Explore Tools</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </div>
  );
}
