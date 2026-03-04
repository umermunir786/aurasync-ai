import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageLoader: React.FC = () => {
  const location = useLocation();
  const controls = useAnimation();

  useEffect(() => {
    const startLoading = async () => {
      // Reset and show
      await controls.set({ width: '0%', opacity: 1 });
      // Fast start to 30%
      await controls.start({ 
        width: '30%', 
        transition: { duration: 0.3, ease: "easeOut" } 
      });
      // Slow crawl to 90%
      await controls.start({ 
        width: '90%', 
        transition: { duration: 2, ease: "linear" } 
      });
    };

    const stopLoading = async () => {
      // Speed to 100% and fade out
      await controls.start({ 
        width: '100%', 
        transition: { duration: 0.2, ease: "easeIn" } 
      });
      await controls.start({ 
        opacity: 0, 
        transition: { duration: 0.3 } 
      });
    };

    startLoading();
    
    // Simulate end of "page load" when location changes
    // In a real app with data fetching, you might want more fine-grained control
    const timer = setTimeout(stopLoading, 500); 

    return () => clearTimeout(timer);
  }, [location, controls]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none">
      <motion.div
        animate={controls}
        initial={{ width: '0%', opacity: 0 }}
        className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
      />
    </div>
  );
};

export default PageLoader;
