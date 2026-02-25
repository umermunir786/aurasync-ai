import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Shield, HelpCircle, Mail, Bell, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import { SubscriptionService } from '../services/SubscriptionService';

interface SettingItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  action?: () => void;
  toggle?: boolean;
  value?: boolean;
  onToggle?: () => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const offerings = await SubscriptionService.getOfferings();
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        const pkg = offerings.current.availablePackages[0];
        await SubscriptionService.purchasePackage(pkg);
        alert('Successfully upgraded to Premium!');
      } else {
        alert('No subscription offerings available at this time.');
      }
    } catch (err: any) {
      if (!err.userCancelled) {
        alert('Failed to process upgrade. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sections: SettingSection[] = [
    {
      title: 'Subscription',
      items: [
        { 
          icon: <Zap size={20} />, 
          label: isLoading ? 'Processing...' : 'AuraSync Premium', 
          description: 'Unlock AI advanced insights and personalized plans', 
          action: isLoading ? undefined : handleUpgrade 
        },
      ]
    },
    {
      title: 'Support & Help',
      items: [
        { icon: <HelpCircle size={20} />, label: 'FAQ', description: 'Frequently asked questions', action: () => alert('Opening FAQ...') },
        { icon: <Mail size={20} />, label: 'Contact Us', description: 'Get in touch with support', action: () => window.location.href = 'mailto:support@aurasync-ai.com' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: <Bell size={20} />, 
          label: 'Notifications', 
          description: 'Manage app notifications', 
          toggle: true,
          value: notificationsEnabled,
          onToggle: () => setNotificationsEnabled(!notificationsEnabled)
        },
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: <Shield size={20} />, label: 'Privacy Policy', description: 'How we handle your data', action: () => alert('Opening Privacy Policy...') },
        { icon: <ExternalLink size={20} />, label: 'Terms of Service', description: 'Application terms and conditions', action: () => alert('Opening Terms of Service...') },
      ]
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gradient">Settings</h1>
        <p className="text-slate-400">Manage your preferences and get support</p>
      </div>

      <div className="grid gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400/80 ml-1">{section.title}</h2>
            <Card className="overflow-hidden divide-y divide-white/5" glass={true}>
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx} 
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={item.toggle ? undefined : item.action}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100">{item.label}</h3>
                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  
                  {item.toggle ? (
                    <button 
                      onClick={item.onToggle}
                      className={`w-12 h-6 rounded-full transition-colors relative ${item.value ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.value ? 'left-7' : 'left-1'}`} />
                    </button>
                  ) : (
                    <ChevronRight size={18} className="text-slate-500" />
                  )}
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      <div className="pt-8 text-center">
        <p className="text-xs text-slate-500 italic">AuraSync AI Version 1.0.0 (Capacitor 8.1.0)</p>
      </div>
    </div>
  );
};

export default Settings;
