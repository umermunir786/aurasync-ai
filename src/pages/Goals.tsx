import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  ChevronRight, 
  BrainCircuit, 
  Clock, 
  Plus,
  Trophy,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { useActivities } from '../hooks/useActivities';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Goals: React.FC = () => {
  const { goals, addGoal, isLoading: goalsLoading } = useGoals();
  const { activities, isLoading: actsLoading } = useActivities();
  const [isAddMode, setIsAddMode] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_type: 'Steps',
    target_value: 10000,
    unit: 'steps',
    period: 'daily'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal.mutate(newGoal);
    setIsAddMode(false);
  };

  const calculateProgress = (goal: any) => {
    if (!activities) return 0;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayActivities = activities.filter(a => a.created_at?.startsWith(todayStr)) || [];

    if (goal.goal_type.toLowerCase() === 'steps') {
      const steps = todayActivities.reduce((acc, curr) => {
        if (curr.activity_type.toLowerCase().includes('running')) return acc + (curr.duration_minutes || 0) * 150;
        if (curr.activity_type.toLowerCase().includes('walking')) return acc + (curr.duration_minutes || 0) * 100;
        return acc;
      }, 0);
      return Math.min(100, (steps / goal.target_value) * 100);
    }

    if (goal.goal_type.toLowerCase() === 'calories') {
      const cals = todayActivities.reduce((acc, curr) => acc + (curr.calories_burned || 0), 0);
      return Math.min(100, (cals / goal.target_value) * 100);
    }

    if (goal.goal_type.toLowerCase() === 'water') {
      const water = todayActivities
        .filter(a => a.activity_type.toLowerCase().includes('water'))
        .reduce((acc, curr) => acc + (curr.quantity || 0), 0) / 1000;
      return Math.min(100, (water / goal.target_value) * 100);
    }

    return 0; // Default or untracked goal type
  };

  if (goalsLoading || actsLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Fetching your goals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fitness Goals</h1>
          <p className="text-slate-400">Set targets and let AuraSync AI guide your progress.</p>
        </div>
        {!isAddMode && (
          <Button onClick={() => setIsAddMode(true)} className="shadow-lg shadow-indigo-500/20">
            <Plus size={18} className="mr-2" /> Set New Goal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Goals List */}
        <div className="xl:col-span-2 space-y-6">
          {goals && goals.length > 0 ? (
            goals.map((goal) => {
              const progress = calculateProgress(goal);

              return (
                <Card key={goal.id} className="group hover:border-indigo-500/40 transition-all duration-500 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Target size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{goal.goal_type}</h3>
                        <div className="flex items-center space-x-3 mt-1 text-sm text-slate-400">
                          <span className="flex items-center bg-white/5 px-2 py-0.5 rounded-md"><Calendar size={12} className="mr-1.5 opacity-50" /> {goal.period}</span>
                          <span className="flex items-center px-2 py-0.5 rounded-md bg-indigo-500/5 text-indigo-300 font-medium"><Trophy size={12} className="mr-1.5 text-yellow-500/70" /> {goal.target_value} {goal.unit}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-3xl font-black text-white mb-0.5">{Math.round(progress)}%</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Current Completion</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-400/30 transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="w-full bg-slate-950/50 h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full relative"
                      >
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                      </motion.div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-500 px-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full animate-ping" />
                        Live Progress Sync
                      </span>
                      <span>Target: {goal.target_value} {goal.unit}</span>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="flex flex-col items-center justify-center py-24 border-dashed border-2 border-white/10 bg-white/[0.02] backdrop-blur-xl">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mb-6 text-slate-500 shadow-2xl">
                <Target size={40} className="opacity-20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No active goals found</h3>
              <p className="text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
                You haven't set any fitness targets yet. Setting goals helps our AI provide more accurate health insights.
              </p>
              <Button onClick={() => setIsAddMode(true)} variant="secondary" size="lg" className="px-10">
                <Plus size={20} className="mr-2" /> Create First Goal
              </Button>
            </Card>
          )}
        </div>

        {/* Right Sidebar - Logic/AI */}
        <div className="space-y-6">
          {isAddMode ? (
            <Card className="border-indigo-500/30 animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-bold text-white mb-4">New Goal Setting</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  label="Goal Type" 
                  value={newGoal.goal_type}
                  onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Target Value" 
                    type="number" 
                    value={newGoal.target_value}
                    onChange={(e) => setNewGoal({...newGoal, target_value: Number(e.target.value)})}
                  />
                  <Input 
                    label="Unit" 
                    placeholder="kg, kcal, etc." 
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Period</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                    value={newGoal.period}
                    onChange={(e) => setNewGoal({...newGoal, period: e.target.value})}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="pt-2 flex flex-col space-y-3">
                  <Button type="submit" className="w-full">Create Goal</Button>
                  <Button variant="ghost" className="w-full" onClick={() => setIsAddMode(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
              <div className="p-2 bg-indigo-500/20 rounded-xl w-fit mb-4">
                <BrainCircuit className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Need a personalized plan?</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Our AI analyzes your metabolism, sleep patterns, and daily habits to create a roadmap tailored just for you.
              </p>
              <Button variant="outline" className="w-full group">
                Consult AI Coach <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          )}

          <Card className="space-y-4">
            <h3 className="font-bold text-white flex items-center">
              <Clock size={18} className="mr-2 text-cyan-400" /> Recent Achievements
            </h3>
            <div className="space-y-4">
              {[
                { title: '7 Day Streak', date: 'Yesterday', icon: '🔥' },
                { title: 'Reached 10k Steps', date: '2 days ago', icon: '🏆' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Goals;
