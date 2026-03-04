import React, { useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  Flame, 
  Footprints, 
  Droplets, 
  Target, 
  TrendingUp,
  Plus
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useGoals } from '../hooks/useGoals';
import { useActivities } from '../hooks/useActivities';
import { useWeight } from '../hooks/useWeight';
import { NotificationService } from '../services/NotificationService';
import { useAuth } from '../hooks/useAuth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Skeleton from '../components/ui/Skeleton';

const Dashboard: React.FC = () => {
  const { goals, isLoading: goalsLoading } = useGoals();
  const { activities, isLoading: actsLoading } = useActivities();
  const { weightHistory, isLoading: weightLoading } = useWeight();
  const { user } = useAuth();

  const isDataLoading = goalsLoading || actsLoading || weightLoading;

  useEffect(() => {
    const initNotifications = async () => {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        await NotificationService.scheduleDailyReminder(20, 0);
      }
    };
    initNotifications();
  }, []);

  if (isDataLoading) {
    return (
      <div className="p-6 space-y-8 bg-slate-950 min-h-screen">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex space-x-3">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }

  // Calculate Health Metrics
  const calculateBMI = () => {
    if (!user?.weight || !user?.height) return null;
    const heightInMeters = user.height / 100;
    return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateBMR = () => {
    if (!user?.weight || !user?.height || !user?.age || !user?.gender) return null;
    let bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age);
    if (user.gender === 'male') bmr += 5;
    else if (user.gender === 'female') bmr -= 161;
    return Math.round(bmr);
  };

  const bmi = calculateBMI();
  const bmr = calculateBMR();

  const handleDownloadReport = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#020617',
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AuraSync_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Calculate summaries from real data
  const calorieGoal = goals?.find(g => g.goal_type === 'Calories')?.target_value || 2000;
  const stepGoal = goals?.find(g => g.goal_type === 'Steps')?.target_value || 10000;
  const waterGoalValue = goals?.find(g => g.goal_type === 'Water')?.target_value || 2;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivities = activities?.filter(a => a.created_at?.startsWith(todayStr)) || [];
  
  const todayCalories = todayActivities.reduce((acc, curr) => acc + (curr.calories_burned || 0), 0);
  const todaySteps = todayActivities.reduce((acc, curr) => {
    if (curr.activity_type.toLowerCase().includes('running')) return acc + (curr.duration_minutes || 0) * 150;
    if (curr.activity_type.toLowerCase().includes('walking')) return acc + (curr.duration_minutes || 0) * 100;
    return acc;
  }, 0);
  const todayWater = todayActivities
    .filter(a => a.activity_type.toLowerCase().includes('water'))
    .reduce((acc, curr) => acc + (curr.quantity || 0), 0) / 1000; // ml to L

  const goalPcnt = [
    { name: 'Steps', value: Math.min(100, Math.round((todaySteps / stepGoal) * 100)), fill: '#6366f1' },
    { name: 'Calories', value: Math.min(100, Math.round((todayCalories / calorieGoal) * 100)), fill: '#a855f7' },
    { name: 'Water', value: Math.min(100, Math.round((todayWater / waterGoalValue) * 100)), fill: '#06b6d4' },
  ];

  // Weight History Data
  const weightData = weightHistory && weightHistory.length > 0
    ? weightHistory.map(w => ({
        name: new Date(w.recorded_at).toLocaleDateString('en-US', { weekday: 'short' }),
        weight: w.weight
      }))
    : [];

  // Weekly Activity Analysis Data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const activityData = last7Days.map(date => {
    const dayActivities = activities?.filter(a => a.created_at?.startsWith(date)) || [];
    const dayCals = dayActivities.reduce((acc, curr) => acc + (curr.calories_burned || 0), 0);
    return {
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: dayCals
    };
  });

  const hasWeightData = weightData.length > 0;
  const hasActivityData = activityData.some(d => d.calories > 0);
  const goalsSet = goals && goals.length > 0;
  const hasGoalProgress = goalPcnt.some(g => g.value > 0);

  const NoDataFallback = ({ message, showButton }: { message: string, showButton?: boolean }) => (
    <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 space-y-4">
      <div className="p-4 bg-white/5 rounded-[24px] border border-white/10 shadow-inner">
        <Target size={32} className="opacity-20 translate-y-0.5" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm italic font-medium">{message}</p>
        {showButton && (
          <Link to="/goals" className="block mt-2">
            <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
              Set Goals Now
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div id="dashboard-content" className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-950 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome, {user?.full_name}! Your health journey starts here.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm" onClick={handleDownloadReport}>
            Download Report
          </Button>
          <Link to="/activities">
            <Button size="sm">
              <Plus size={18} className="mr-2" /> Log Activity
            </Button>
          </Link>
        </div>
      </div>

      {/* Health Profile Card */}
      {(bmi || bmr) && (
        <Card className="grid grid-cols-2 md:grid-cols-4 gap-6" glass={true}>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Weight</p>
            <p className="text-2xl font-bold text-white">{user?.weight || '-'} kg</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Height</p>
            <p className="text-2xl font-bold text-white">{user?.height || '-'} cm</p>
          </div>
          <div className="space-y-1 border-l border-white/10 pl-6">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">BMI Index</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white">{bmi || '-'}</p>
              {bmi && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  parseFloat(bmi) < 18.5 ? 'bg-indigo-500/20 text-indigo-400' :
                  parseFloat(bmi) < 25 ? 'bg-green-500/20 text-green-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {parseFloat(bmi) < 18.5 ? 'Under' : parseFloat(bmi) < 25 ? 'Normal' : 'Over'}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1 border-l border-white/10 pl-6">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Daily BMR</p>
            <p className="text-2xl font-bold text-white">{bmr || '-'} <span className="text-sm font-normal text-slate-400">kcal</span></p>
          </div>
        </Card>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-500">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Calories Burned</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-white">{Math.round(todayCalories)}</h3>
              <span className="text-xs text-slate-500">kcal</span>
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
              <h3 className="text-2xl font-bold text-white">{Math.round(todaySteps)}</h3>
              <span className="text-xs text-slate-500">/ {stepGoal}</span>
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
              <h3 className="text-2xl font-bold text-white">{todayWater.toFixed(1)}L</h3>
              <span className="text-xs text-slate-400">/ {waterGoalValue}L</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-500">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Active Goals</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-white">{goals?.length || 0}</h3>
              <span className="text-xs text-slate-500">set</span>
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
            </select>
          </div>
          <div className="h-[300px] w-full">
            {hasWeightData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area name="Weight (kg)" type="monotone" dataKey="weight" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <NoDataFallback message="Start logging your weight to see progress." />}
          </div>
        </Card>

        {/* Goal Completion */}
        <Card className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Goal Completion</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {!goalsSet ? (
              <NoDataFallback message="No fitness goals set yet." showButton />
            ) : hasGoalProgress ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={15} data={goalPcnt}>
                  <RadialBar
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background={{ fill: 'rgba(255,255,255,0.05)' }}
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Legend iconSize={10} layout="vertical" verticalAlign="bottom" wrapperStyle={{ paddingBottom: '20px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : <NoDataFallback message="No goal progress tracked today." />}
          </div>
        </Card>

        {/* Calories Burned vs Target */}
        <Card className="lg:col-span-3 space-y-6">
          <h3 className="text-lg font-semibold text-white">Weekly Activity Analysis</h3>
          <div className="h-[300px] w-full">
            {hasActivityData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar name="Calories Burned" dataKey="calories" fill="#22d3ee" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : <NoDataFallback message="No activities recorded this week." />}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
