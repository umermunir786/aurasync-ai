import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  ChevronRight, 
  BrainCircuit, 
  Clock, 
  Plus,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useGoals, type Goal } from '../hooks/useGoals';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Goals: React.FC = () => {
  const { goals, addGoal } = useGoals();
  const [isAddMode, setIsAddMode] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_type: 'Weight Loss',
    target_value: 75,
    unit: 'kg',
    period: 'daily'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal.mutate(newGoal);
    setIsAddMode(false);
  };

  // Mock data for display
  const mockGoals: Goal[] = [
    { 
      id: 1, 
      goal_type: 'Weight Loss', 
      target_value: 75, 
      unit: 'kg',
      period: 'daily',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const displayGoals = goals || mockGoals;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fitness Goals</h1>
          <p className="text-slate-400">Set targets and let AuraSync AI guide your progress.</p>
        </div>
        {!isAddMode && (
          <Button onClick={() => setIsAddMode(true)}>
            <Plus size={18} className="mr-2" /> Set New Goal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Goals List */}
        <div className="xl:col-span-2 space-y-6">
          {displayGoals.map((goal) => {
            const progress = 50; // Simplified progress for now

            return (
              <Card key={goal.id} className="group hover:border-indigo-500/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                      <Target size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{goal.goal_type}</h3>
                      <div className="flex items-center space-x-3 mt-1 text-sm text-slate-400">
                        <span className="flex items-center"><Calendar size={14} className="mr-1" /> Period: {goal.period}</span>
                        <span className="flex items-center"><Trophy size={14} className="mr-1 text-yellow-500/70" /> {goal.target_value} {goal.unit}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white mb-1">{Math.round(progress)}%</p>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Progress</p>
                    </div>
                    <ChevronRight size={24} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 px-1">
                    <span>Progress tracked by AI</span>
                    <span>Goal: {goal.target_value} {goal.unit}</span>
                  </div>
                </div>
              </Card>
            );
          })}
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
