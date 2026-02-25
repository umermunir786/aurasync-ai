import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  Flame, 
  Footprints, 
  Droplets, 
  Target, 
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const weightData = [
  { name: 'Mon', weight: 80.5 },
  { name: 'Tue', weight: 80.2 },
  { name: 'Wed', weight: 81.0 },
  { name: 'Thu', weight: 80.7 },
  { name: 'Fri', weight: 79.9 },
  { name: 'Sat', weight: 79.5 },
  { name: 'Sun', weight: 79.8 },
];

const activityData = [
  { name: 'Mon', calories: 2400, steps: 8000 },
  { name: 'Tue', calories: 2100, steps: 6500 },
  { name: 'Wed', calories: 2800, steps: 11000 },
  { name: 'Thu', calories: 2300, steps: 9000 },
  { name: 'Fri', calories: 2600, steps: 10500 },
  { name: 'Sat', calories: 1900, steps: 12000 },
  { name: 'Sun', calories: 2200, steps: 8500 },
];

const goalPcnt = [
  { name: 'Steps', value: 85, fill: '#6366f1' },
  { name: 'Calories', value: 70, fill: '#a855f7' },
  { name: 'Water', value: 90, fill: '#06b6d4' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back! Here's your health summary for today.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            Download Report
          </Button>
          <Button size="sm">
            <Plus size={18} className="mr-2" /> Log Activity
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-500">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Calories Burned</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-white">1,284</h3>
              <span className="text-xs text-green-400 flex items-center">
                <ArrowUpRight size={14} className="mr-0.5" /> 12%
              </span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-500">
            <Footprints size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Steps Taken</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-white">8,432</h3>
              <span className="text-xs text-green-400 flex items-center">
                <ArrowUpRight size={14} className="mr-0.5" /> 5%
              </span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-500">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Water Intake</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-white">2.4L</h3>
              <span className="text-xs text-slate-400">/ 3.0L</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-500">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Sleep Duration</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-white">7h 20m</h3>
              <span className="text-xs text-red-400 flex items-center">
                <ArrowDownRight size={14} className="mr-0.5" /> 2%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Progress */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <TrendingUp size={20} className="mr-2 text-indigo-500" /> Weight Progress
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-400 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Goal Completion */}
        <Card className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Goal Completion</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={15} data={goalPcnt}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background={{ fill: '#1e293b' }}
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="bottom" wrapperStyle={{ paddingBottom: '20px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Calories Burned vs Target */}
        <Card className="lg:col-span-3 space-y-6">
          <h3 className="text-lg font-semibold text-white">Weekly Activity Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Bar dataKey="calories" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
