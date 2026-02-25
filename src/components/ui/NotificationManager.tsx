import React, { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Toast } from './Toast';

export const NotificationManager: React.FC = () => {
  const [activeToast, setActiveToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    let listenerHandle: any;
    const setupListener = async () => {
      listenerHandle = await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        setActiveToast({
          title: notification.title || 'Notification',
          body: notification.body || ''
        });
      });
    };

    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, []);

  if (!activeToast) return null;

  return (
    <Toast 
      title={activeToast.title} 
      body={activeToast.body} 
      onClose={() => setActiveToast(null)} 
    />
  );
};
