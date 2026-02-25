import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Image as ImageIcon, Paperclip } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AIChat: React.FC = () => {
  const { messages, sendMessage, isLoading } = useAIChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Sparkles className="mr-2 text-indigo-400" size={28} /> AI Coach
          </h1>
          <p className="text-slate-400">Ask anything about your fitness, nutrition, or health data.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-white/5" glass={true}>
        {/* Messages viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 text-cyan-400 border border-white/10'
                }`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none'
                }`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex max-w-[80%] flex-row items-end gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-400 border border-white/10 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <button type="button" className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
              <Paperclip size={20} />
            </button>
            <div className="relative flex-1">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AuraSync AI..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-lg text-white disabled:opacity-50 disabled:bg-slate-700 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
          <div className="mt-2 flex items-center justify-center space-x-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            <span>Burned 1.2k kcal today</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>Weight-loss plan active</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>8.4k steps reached</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
