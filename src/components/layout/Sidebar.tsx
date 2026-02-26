import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Target, 
  MessageSquare, 
  BarChart3, 
  User,
  Camera,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Activities', icon: <Activity size={20} />, path: '/activities' },
    { name: 'AI Nutrition', icon: <Camera size={20} />, path: '/vision-nutrition' },
    { name: 'Goals', icon: <Target size={20} />, path: '/goals' },
    { name: 'AI Chat', icon: <MessageSquare size={20} />, path: '/ai-chat' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  return (
    <aside className={`w-64 h-screen glass border-r border-white/10 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gradient">AuraSync AI</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <NavLink 
          to="/settings"
          className={({ isActive }) => `
            flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
            ${isActive 
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
              : 'text-slate-400 hover:bg-white/5 hover:text-white'}
          `}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
