import React, { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Toast } from './Toast';
import { useNotificationStore } from '../../store/useNotificationStore';

export const NotificationManager: React.FC = () => {
  const [activeToast, setActiveToast] = useState<{ title: string; body: string } | null>(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    let listenerHandle: any;
    const setupListener = async () => {
      listenerHandle = await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        const title = notification.title || 'Notification';
        const body = notification.body || '';
        
        // Save to store
        addNotification({ title, body });
        
        // Show toast
        setActiveToast({ title, body });
      });
    };

    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [addNotification]);

  if (!activeToast) return null;

  return (
    <Toast 
      title={activeToast.title} 
      body={activeToast.body} 
      onClose={() => setActiveToast(null)} 
    />
  );
};
