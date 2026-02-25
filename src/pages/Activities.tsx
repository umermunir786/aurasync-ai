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

const Activities: React.FC = () => {
  const { activities, addActivity, deleteActivity } = useActivities();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'Steps',
    value: 0,
    unit: 'steps',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity.mutate(newActivity as any);
    setIsAddModalOpen(false);
  };

  // Mock data if backend is not available for preview
  const mockActivities: Activity[] = [
    { id: '1', type: 'Steps', value: 8432, unit: 'steps', timestamp: new Date().toISOString(), notes: 'Morning walk' },
    { id: '2', type: 'Calories', value: 450, unit: 'kcal', timestamp: new Date().toISOString(), notes: 'Gym session' },
    { id: '3', type: 'Water', value: 500, unit: 'ml', timestamp: new Date().toISOString(), notes: 'After lunch' },
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
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <ActivityIcon size={16} />
                          </div>
                          <span className="font-medium text-white">{activity.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-semibold">{activity.value}</span>
                        <span className="ml-1 text-slate-500 text-sm">{activity.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-[200px]">
                        {activity.notes || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteActivity.mutate(activity.id)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Activity Type" 
                value={newActivity.type} 
                onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Value" 
                  type="number" 
                  value={newActivity.value}
                  onChange={(e) => setNewActivity({...newActivity, value: Number(e.target.value)})}
                />
                <Input 
                  label="Unit" 
                  value={newActivity.unit}
                  onChange={(e) => setNewActivity({...newActivity, unit: e.target.value})}
                />
              </div>
              <Input 
                label="Notes" 
                placeholder="Optional notes..."
                value={newActivity.notes}
                onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
              />
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
