import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const performanceData = [
  { subject: 'Endurance', A: 120, B: 110, fullMark: 150 },
  { subject: 'Strength', A: 98, B: 130, fullMark: 150 },
  { subject: 'Flexibility', A: 86, B: 130, fullMark: 150 },
  { subject: 'Sleep', A: 99, B: 100, fullMark: 150 },
  { subject: 'Nutrition', A: 85, B: 90, fullMark: 150 },
  { subject: 'Consistency', A: 65, B: 85, fullMark: 150 },
];

const monthlyTrends = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 59 },
  { name: 'Mar', score: 80 },
  { name: 'Apr', score: 81 },
  { name: 'May', score: 56 },
  { name: 'Jun', score: 95 },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-slate-400">Deep dive into your fitness performance and AI-driven insights.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">Export Data</Button>
          <Button size="sm">Share Progress</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fitness Balance Radar Chart */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Fitness Balance</h3>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Zap size={20} />
            </div>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Current"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Target"
                  dataKey="B"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 text-xs font-semibold uppercase tracking-widest pt-2">
            <div className="flex items-center text-indigo-400">
              <span className="w-3 h-3 bg-indigo-500 rounded-sm mr-2"></span> Current
            </div>
            <div className="flex items-center text-cyan-400">
              <span className="w-3 h-3 bg-cyan-500 rounded-sm mr-2 opacity-30"></span> Target
            </div>
          </div>
        </Card>

        {/* AI Performance Summary */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-indigo-400">
                <ShieldCheck size={28} />
                <h3 className="text-xl font-bold text-white">AI Health Audit</h3>
              </div>
              <p className="text-slate-300 leading-relaxed italic">
                "Your endurance and strength are peaking this month, but we've noticed a decline in sleep consistency. Adjusting your evening wind-down routine could improve recovery by 15%."
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Health Score</p>
                  <p className="text-2xl font-bold text-white">88/100</p>
                </div>
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Recovery Rate</p>
                  <p className="text-2xl font-bold text-green-400">Excellent</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button variant="outline" className="w-full">View Detailed Audit</Button>
            </div>
          </Card>

          <Card className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-500">
              <Award size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Monthly Milestone Achieved!</p>
              <p className="text-xs text-slate-400">You've hit 200k steps in the last 30 days.</p>
            </div>
            <ChevronRight size={20} className="text-slate-500" />
          </Card>
        </div>
      </div>

      {/* Monthly Score Trend */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-cyan-400" size={20} />
            <h3 className="text-lg font-bold text-white">Overall Score Trend</h3>
          </div>
          <p className="text-xs text-slate-500 flex items-center">
            <Info size={14} className="mr-1" /> Data updated hourly
          </p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
