import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/layout/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Activities = lazy(() => import('./pages/Activities'));
const Goals = lazy(() => import('./pages/Goals'));
const AIChat = lazy(() => import('./pages/AIChat'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const VisionNutrition = lazy(() => import('./pages/VisionNutrition'));

import { Capacitor } from '@capacitor/core';
import { SocialAuthService } from './services/SocialAuthService';
import { SubscriptionService } from './services/SubscriptionService';

import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

const App: React.FC = () => {
  React.useEffect(() => {
    const initServices = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#020617' });
          await SplashScreen.hide();
        }
        await SocialAuthService.init();
        await SubscriptionService.init();
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };
    initServices();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center h-screen bg-slate-900 text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/vision-nutrition" element={<VisionNutrition />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
