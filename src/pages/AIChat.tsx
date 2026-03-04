import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, RefreshCw, Trash2, X } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import Button from '../components/ui/Button';
import { ActivityService } from '../services/ActivityService';
import { motion, AnimatePresence } from 'framer-motion';

const AIChat: React.FC = () => {
  const { messages, sendMessage, clearHistory, isLoading } = useAIChat();
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isFetchingRecs, setIsFetchingRecs] = useState(false);
  const [historyStats, setHistoryStats] = useState({ calories: 0, steps: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchRecommendations = async () => {
    setIsFetchingRecs(true);
    try {
      const recs = await ActivityService.getRecommendations();
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setIsFetchingRecs(false);
    }
  };

  const fetchStats = async () => {
    try {
      const activities = await ActivityService.getRecentActivities();
      const totalCals = activities.reduce((acc, curr) => acc + curr.calories_burned, 0);
      setHistoryStats({ calories: Math.round(totalCals), steps: 8400 }); // Mock steps for now
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    fetchStats();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage.mutate(input);
      setInput('');
    }
  };

  useEffect(() => {
    // Check for hash-based routing/scrolling if needed
    if (window.location.hash === '#ai') {
      window.history.replaceState(null, '', '/ai-chat');
    }
  }, []);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-6 relative">
      <div className="flex items-center justify-between pb-2">
        <div className="space-y-1">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-black bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent flex items-center"
          >
            <Sparkles className="mr-3 text-indigo-400 animate-pulse" size={32} /> AI Health Coach
          </motion.h1>
          <p className="text-slate-400 text-sm font-medium">Hyper-personalized wellness intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => clearHistory.mutate()}
            className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full"
          >
            <Trash2 size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchRecommendations}
            disabled={isFetchingRecs}
            className="border-white/5 bg-white/5 text-slate-300 hover:text-white rounded-full px-4"
          >
            {isFetchingRecs ? <RefreshCw size={14} className="mr-2 animate-spin" /> : <Sparkles size={14} className="mr-2" />}
            Fresh Insights
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="min-w-[280px] bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl flex items-start gap-3 snap-center relative group"
                >
                  <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                    <Sparkles size={16} />
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed pr-6">{rec}</p>
                  <button 
                    onClick={() => setRecommendations(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setRecommendations([])}
                className="shrink-0 text-slate-500 hover:text-white"
              >
                Dismiss All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-0 bg-slate-900/40 rounded-[32px] border border-white/5 overflow-hidden backdrop-blur-xl relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Messages Layout */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm space-y-6">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-indigo-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-500/10"
              >
                <Bot size={40} />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-white font-semibold text-lg">AuraSync Intelligence</p>
                <p className="text-slate-400 max-w-xs mx-auto">Analyze your metrics, optimize your workouts, and reach your goals faster.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8 max-w-md w-full">
                {['How can I burn more calories?', 'Analyze my sleep patterns', 'Best food for recovery', 'Plan today\'s workout'].map((text) => (
                  <button 
                    key={text}
                    onClick={() => setInput(text)}
                    className="p-3 text-[11px] bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-indigo-500/30 transition-all text-slate-300 text-left"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-4`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white' 
                        : 'bg-slate-800 text-cyan-400 border border-white/10 shadow-indigo-500/5'
                    }`}>
                      {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={`relative px-5 py-4 rounded-[24px] text-sm leading-relaxed shadow-xl ${
                      message.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20' 
                        : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none border-l-cyan-500/30'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {isLoading && sendMessage.isPending && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row items-end gap-3 px-2">
                <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-[20px] rounded-bl-none flex space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area Overlay */}
        <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          <form 
            onSubmit={handleSend} 
            className="max-w-4xl mx-auto flex items-center gap-4 bg-white/5 border border-white/10 rounded-[28px] p-2 pl-4 focus-within:border-indigo-500/40 transition-all backdrop-blur-md shadow-2xl"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your health coach..."
              className="flex-1 bg-transparent border-none py-3 text-white focus:outline-none placeholder:text-slate-500 text-base"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-full text-white disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center space-x-6 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-ping"></span>
              {historyStats.calories} Calories Tracked
            </span>
            <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
            <span>Coach AI v2.0 Online</span>
            <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
            <span>{historyStats.steps.toLocaleString()} Steps Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
