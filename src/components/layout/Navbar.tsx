import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header className="h-20 glass border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search activities, goals, or AI help..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400">Pro Member</p>
          </div>
          <div className="relative group">
            <button className="flex items-center space-x-2 p-1 rounded-xl hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg">
                {user?.name?.[0] || 'U'}
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
