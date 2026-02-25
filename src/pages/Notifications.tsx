import React from 'react';
import { useNotificationStore, type Notification } from '../store/useNotificationStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Bell, Trash2, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gradient">Notifications</h1>
          <p className="text-slate-400">Stay updated with your latest alerts and insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          {notifications.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs h-9"
              >
                <CheckCircle size={14} className="mr-1.5" />
                Mark all read
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll}
                className="text-xs h-9 text-red-400 hover:text-red-300 border-red-500/20 hover:bg-red-500/10"
              >
                <Trash2 size={14} className="mr-1.5" />
                Clear all
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center" glass={true}>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-slate-900 shadow-xl border border-white/5">
                <Bell size={40} className="text-slate-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-100">No notifications yet</h3>
                <p className="text-slate-500 max-w-xs">When you receive alerts, tips, or insights, they will appear here.</p>
              </div>
            </div>
          </Card>
        ) : (
          notifications.map((n: Notification) => (
            <Card 
              key={n.id} 
              className={`p-5 transition-all relative overflow-hidden group ${n.read ? 'bg-white/5 opacity-70' : 'bg-white/10 border-indigo-500/30'}`}
              glass={true}
              onClick={() => !n.read && markAsRead(n.id)}
            >
              {!n.read && (
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl border ${n.read ? 'bg-slate-800/50 border-white/5 text-slate-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                  <Bell size={20} />
                </div>
                
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className={`font-bold truncate ${n.read ? 'text-slate-400' : 'text-slate-100'}`}>
                      {n.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 whitespace-nowrap font-medium uppercase tracking-wider">
                      <Clock size={12} />
                      {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed ${n.read ? 'text-slate-500' : 'text-slate-400'}`}>
                    {n.body}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <p className="text-center text-xs text-slate-600 pt-4 italic">
          Viewing last {notifications.length} notifications
        </p>
      )}
    </div>
  );
};

export default Notifications;
