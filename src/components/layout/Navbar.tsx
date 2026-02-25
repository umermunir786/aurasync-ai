import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, Search, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationStore } from '../../store/useNotificationStore';
interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
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
    <header className="min-h-20 pt-safe glass border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5 active:scale-95"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search metrics..." 
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 w-64 transition-all"
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

        <button 
          onClick={() => navigate('/notifications')}
          className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5 relative active:scale-95"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full border-2 border-slate-900 flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-white/10 mx-2"></div>

        <div className="flex items-center space-x-3 hover:bg-white/5 p-1.5 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-white/5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-none">
              {user?.name || 'User'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
              Pro Member
            </p>
          </div>
          <ChevronDown size={14} className="text-slate-500 group-hover:rotate-180 transition-transform duration-300" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
