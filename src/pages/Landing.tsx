import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Sparkles, 
  Activity, 
  Target, 
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Github
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 pt-safe max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-gradient">AURASYNC AI</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#ai" className="hover:text-white transition-colors">AI Coach</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="hidden sm:inline-flex">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Next-Gen Fitness Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight">
              Sync Your <span className="text-gradient">Aura</span>,<br /> 
              Master Your <span className="text-indigo-400 underline decoration-cyan-400/30">Health</span>.
            </h1>
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
              The only health platform that combines real-time activity tracking with advanced AI coaching to optimize your lifestyle, one sync at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg shadow-2xl shadow-indigo-500/20">
                  Start Your Journey <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="group">
                Watch Demo <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
            <Card className="relative z-10 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-700">
              <div className="bg-slate-900/80 backdrop-blur-xl p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-black">Daily Performance</p>
                    <p className="text-2xl font-bold">88/100</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20">
                    <Zap size={24} />
                  </div>
                </div>
                <div className="h-40 w-full flex items-end space-x-2">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-400 opacity-80"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/5 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 border border-white/10">
                    <MessageSquare size={18} />
                  </div>
                  <p className="text-sm text-slate-400 italic">"Your recovery is optimal. Ready for a high-intensity session?"</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold">Everything You Need to Scale Your Fitness</h2>
            <p className="text-slate-400 text-lg">Powerful features built for performance, designed for style.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Activity Tracking', 
                desc: 'Log steps, calories, and more with our beautiful, intuitive interface.',
                icon: <Activity className="text-indigo-400" size={24} /> 
              },
              { 
                title: 'AI Coaching', 
                desc: 'Get personalized advice and plans from your own dedicated AI health expert.',
                icon: <Sparkles className="text-purple-400" size={24} /> 
              },
              { 
                title: 'Goal Management', 
                desc: 'Set smart targets and track your progress with dynamic visualizations.',
                icon: <Target className="text-cyan-400" size={24} /> 
              },
              { 
                title: 'Deep Analytics', 
                desc: 'Analyze your performance with advanced charts and health audits.',
                icon: <Zap className="text-orange-400" size={24} /> 
              },
              { 
                title: 'Global Community', 
                desc: 'Connect with others and share your achievements with the world.',
                icon: <Shield className="text-green-400" size={24} /> 
              },
              { 
                title: 'Cross-Platform', 
                desc: 'Access your health data anywhere with our fully responsive web app.',
                icon: <ArrowRight className="text-pink-400" size={24} /> 
              },
            ].map((f, i) => (
              <Card key={i} className="hover:bg-white/[0.03] hover:border-white/20 transition-all group p-8">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/30 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-slate-500 text-sm">
          <div className="flex items-center space-x-2">
            <Activity size={20} className="text-indigo-500" />
            <span className="font-bold text-white tracking-tighter">AURASYNC AI</span>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="p-2 hover:bg-white/5 rounded-lg transition-all"><Github size={20} /></a>
          </div>
        </div>
        <div className="text-center mt-12 text-slate-700 text-[10px] uppercase font-bold tracking-[0.2em]">
          © 2026 AuraSync AI. Created for the elite.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
