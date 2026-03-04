import { Link, useLocation } from 'react-router-dom'

import RemyButton from './RemyButton'

import { useState } from 'react'
import { Globe, Home, Menu, X, Sparkles, Crown } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className="h-10"
            />
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/ai-chat"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-white/5 hover:border-indigo-500/30 transition-all group mb-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-lg text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Sparkles size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">AI Health Coach</span>
              <span className="text-[10px] text-slate-400">Personalized Insights</span>
            </div>
          </Link>

          <Link
            to="/pricing"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-600/10 to-yellow-600/10 border border-amber-500/20 hover:border-amber-500/40 transition-all group mb-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-2 bg-gradient-to-tr from-amber-600 to-yellow-500 rounded-lg text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <Crown size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">Go Pro</span>
              <span className="text-[10px] text-slate-400">Unlock All Features</span>
            </div>
          </Link>

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${
              location.pathname === '/' ? 'bg-cyan-600 hover:bg-cyan-700' : 'hover:bg-gray-800'
            }`}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Demo Links Start */}

          <Link
            to="/schedule"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${
              location.pathname === '/schedule' ? 'bg-cyan-600 hover:bg-cyan-700' : 'hover:bg-gray-800'
            }`}
          >
            <Globe size={20} />
            <span className="font-medium">Schedule</span>
          </Link>

          <Link
            to="/speakers"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${
              location.pathname === '/speakers' ? 'bg-cyan-600 hover:bg-cyan-700' : 'hover:bg-gray-800'
            }`}
          >
            <Globe size={20} />
            <span className="font-medium">Speakers</span>
          </Link>

          <Link
            to="/talks"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${
              location.pathname === '/talks' ? 'bg-cyan-600 hover:bg-cyan-700' : 'hover:bg-gray-800'
            }`}
          >
            <Globe size={20} />
            <span className="font-medium">Sessions</span>
          </Link>

          {/* Demo Links End */}
        </nav>

        <div className="p-4 border-t border-gray-700 bg-gray-800 flex flex-col gap-2">
          <RemyButton />
        </div>
      </aside>
    </>
  )
}
