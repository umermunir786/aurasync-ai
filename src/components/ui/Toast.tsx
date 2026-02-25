import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  title: string;
  body: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ title, body, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-6 right-6 z-[100] w-full max-w-sm pointer-events-auto"
    >
      <div className="glass p-4 rounded-2xl border border-white/20 shadow-2xl flex items-start gap-4">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
          <Bell size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-100 truncate">{title}</h4>
          <p className="text-sm text-slate-400 line-clamp-2">{body}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};
