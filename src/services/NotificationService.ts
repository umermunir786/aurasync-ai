import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const NotificationService = {
  async requestPermissions() {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const { receive } = await PushNotifications.requestPermissions();
      const { display: localDisplay } = await LocalNotifications.requestPermissions();
      return receive === 'granted' && localDisplay === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  async registerPush() {
    // Register with Apple / Google for a token
    await PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // Example: localStorage.setItem('push_token', token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push action performed: ' + JSON.stringify(action));
    });
  },

  async scheduleLocal(title: string, body: string, scheduleAt: Date) {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 10000),
            schedule: { at: scheduleAt },
            sound: 'default',
          },
        ],
      });
    }
  },

  async scheduleDailyReminder(hour: number, minute: number) {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Daily Health Reminder',
            body: "Don't forget to log your meals and activities today!",
            id: 101, // Fixed ID for daily reminder to avoid duplicates
            schedule: {
              on: {
                hour,
                minute,
              },
              repeats: true,
              allowWhileIdle: true,
            },
            sound: 'default',
          },
        ],
      });
      console.log(`Daily reminder scheduled for ${hour}:${minute}`);
    } else {
      console.log('Daily reminders: Only available on native platforms.');
    }
  },
};
