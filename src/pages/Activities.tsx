import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Filter,
  Activity as ActivityIcon,
  Search
} from 'lucide-react';
import { useActivities, type Activity } from '../hooks/useActivities';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Switch from '../components/ui/Switch';

const PREDEFINED_ACTIVITIES = [
  'Sleep',
  'Water Intake',
  'Cardio',
  'Running',
  'Meal',
  'Walking',
  'Cycling',
  'Gym',
  'Yoga'
];

const Activities: React.FC = () => {
  const { activities, addActivity, deleteActivity } = useActivities();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [newActivity, setNewActivity] = useState<{
    activity_type: string;
    duration_minutes?: number;
    intensity?: string;
    calories_burned?: number;
    quantity?: number;
    unit?: string;
  }>({
    activity_type: PREDEFINED_ACTIVITIES[0],
    duration_minutes: 30,
    intensity: 'Medium',
    calories_burned: 300
  });

  const isWaterIntake = newActivity.activity_type.toLowerCase().includes('water');
  const isMeal = newActivity.activity_type.toLowerCase().includes('meal');

  const handleToggleCustom = (checked: boolean) => {
    setIsCustom(checked);
    if (!checked) {
      setNewActivity({ 
        activity_type: PREDEFINED_ACTIVITIES[0],
        duration_minutes: 30,
        intensity: 'Medium',
        calories_burned: 300
      });
    } else {
      setNewActivity({ activity_type: '' });
    }
  };

  const handleTypeChange = (value: string) => {
    const type = value;
    if (type.toLowerCase().includes('water')) {
      setNewActivity({
        activity_type: type,
        quantity: 250,
        unit: 'ml'
      });
    } else if (type.toLowerCase().includes('meal')) {
      setNewActivity({
        activity_type: type,
        quantity: 1,
        unit: 'serving',
        calories_burned: 500
      });
    } else {
      setNewActivity({
        activity_type: type,
        duration_minutes: 30,
        intensity: 'Medium',
        calories_burned: 300
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.activity_type.trim()) return;
    addActivity.mutate(newActivity);
    setIsAddModalOpen(false);
    setIsCustom(false);
    setNewActivity({
      activity_type: PREDEFINED_ACTIVITIES[0],
      duration_minutes: 30,
      intensity: 'Medium',
      calories_burned: 300
    });
  };

  // Mock data if backend is not available for preview
  const mockActivities: Activity[] = [
    { id: 1, activity_type: 'Running', duration_minutes: 30, intensity: 'High', calories_burned: 450, created_at: new Date().toISOString() },
    { id: 2, activity_type: 'Walking', duration_minutes: 60, intensity: 'Low', calories_burned: 200, created_at: new Date().toISOString() },
    { id: 3, activity_type: 'Water Intake', quantity: 500, unit: 'ml', created_at: new Date().toISOString() },
  ];

  const displayActivities = activities || mockActivities;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Activity Tracker</h1>
          <p className="text-slate-400">Manage and track your daily fitness logs.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} className="mr-2" /> Log Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters and Stats */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="font-semibold text-white flex items-center">
              <Filter size={18} className="mr-2 text-indigo-500" /> Filters
            </h3>
            <div className="space-y-4">
              <Input placeholder="Search activities..." icon={<Search size={18} />} />
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date Range</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" className="w-full text-xs">Today</Button>
                  <Button variant="ghost" size="sm" className="w-full text-xs">Last 7D</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
            <h3 className="font-semibold text-white mb-2">Weekly Summary</h3>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Steps</span>
                <span className="text-white font-medium">54,320</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Avg. Calories</span>
                <span className="text-white font-medium">2,450 kcal</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[75%]"></div>
              </div>
              <p className="text-[10px] text-slate-500 text-center">75% of your weekly goal achieved</p>
            </div>
          </Card>
        </div>

        {/* History List */}
        <div className="lg:col-span-3">
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration / Qty</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Intensity / Unit</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Calories</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 overflow-hidden shrink-0 w-10 h-10 flex items-center justify-center">
                            {activity.image_url ? (
                              <img src={activity.image_url} alt={activity.activity_type} className="w-full h-full object-cover" />
                            ) : (
                              <ActivityIcon size={16} />
                            )}
                          </div>
                          <span className="font-medium text-white">{activity.activity_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {activity.duration_minutes ? (
                          <>
                            <span className="text-slate-300 font-semibold">{activity.duration_minutes}</span>
                            <span className="ml-1 text-slate-500 text-sm">min</span>
                          </>
                        ) : activity.quantity ? (
                          <>
                            <span className="text-slate-300 font-semibold">{activity.quantity}</span>
                            <span className="ml-1 text-slate-500 text-sm">{activity.unit}</span>
                          </>
                        ) : <span className="text-slate-500">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        {activity.intensity ? (
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            activity.intensity === 'High' ? 'bg-red-500/10 text-red-400' :
                            activity.intensity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-green-500/10 text-green-400'
                          }`}>
                            {activity.intensity}
                          </span>
                        ) : activity.unit && !activity.duration_minutes ? (
                          <span className="text-slate-400 text-sm uppercase font-semibold">{activity.unit}</span>
                        ) : <span className="text-slate-500">-</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {activity.calories_burned ? `${activity.calories_burned} kcal` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteActivity.mutate(activity.id)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Activity Modal (Simplified) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-md space-y-6" glass={false}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Log Activity</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">×</button>
            </div>
            
            <Switch 
              label="Activity Mode"
              leftLabel="Built-in"
              rightLabel="Custom"
              checked={isCustom}
              onChange={handleToggleCustom}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              {isCustom ? (
                <Input 
                  label="Custom Activity Name" 
                  placeholder="e.g. Swimming, Basketball"
                  value={newActivity.activity_type} 
                  onChange={(e) => handleTypeChange(e.target.value)}
                  required
                />
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Activity Type</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                    value={newActivity.activity_type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    {PREDEFINED_ACTIVITIES.map(type => (
                      <option key={type} value={type} className="bg-slate-900">{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {(isWaterIntake || isMeal) ? (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input 
                    label={isWaterIntake ? "Amount" : "Quantity"}
                    type="number" 
                    value={newActivity.quantity || ''}
                    onChange={(e) => setNewActivity({...newActivity, quantity: Number(e.target.value)})}
                    required
                  />
                  <Input 
                    label="Unit"
                    placeholder={isWaterIntake ? "ml, oz" : "serving, bowl"}
                    value={newActivity.unit || ''}
                    onChange={(e) => setNewActivity({...newActivity, unit: e.target.value})}
                    required
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input 
                    label="Duration (min)" 
                    type="number" 
                    value={newActivity.duration_minutes || ''}
                    onChange={(e) => setNewActivity({...newActivity, duration_minutes: Number(e.target.value)})}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Intensity</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                      value={newActivity.intensity || ''}
                      onChange={(e) => setNewActivity({...newActivity, intensity: e.target.value})}
                    >
                      <option value="Low" className="bg-slate-900">Low</option>
                      <option value="Medium" className="bg-slate-900">Medium</option>
                      <option value="High" className="bg-slate-900">High</option>
                    </select>
                  </div>
                </div>
              )}

              {!isWaterIntake && (
                <Input 
                  label="Calories Burned" 
                  type="number"
                  value={newActivity.calories_burned || ''}
                  onChange={(e) => setNewActivity({...newActivity, calories_burned: Number(e.target.value)})}
                />
              )}

              <div className="flex space-x-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Activity</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Activities;
