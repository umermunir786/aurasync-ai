import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (n) => set((state) => {
        const newNotification: Notification = {
          ...n,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          read: false
        };
        const updated = [newNotification, ...state.notifications].slice(0, 50); // Keep last 50
        return {
          notifications: updated,
          unreadCount: updated.filter(x => !x.read).length
        };
      }),
      markAsRead: (id) => set((state) => {
        const updated = state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        );
        return {
          notifications: updated,
          unreadCount: updated.filter(x => !x.read).length
        };
      }),
      markAllAsRead: () => set((state) => {
        const updated = state.notifications.map(n => ({ ...n, read: true }));
        return {
          notifications: updated,
          unreadCount: 0
        };
      }),
      clearAll: () => set({ notifications: [], unreadCount: 0 })
    }),
    {
      name: 'notification-storage',
    }
  )
);
