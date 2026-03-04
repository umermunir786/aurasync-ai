import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/ui/LoadingSpinner';
import PrivateRoute from './components/layout/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import PageLoader from './components/ui/PageLoader';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Activities = lazy(() => import('./pages/Activities'));
const Goals = lazy(() => import('./pages/Goals'));
const AIChat = lazy(() => import('./pages/AIChat'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const VisionNutrition = lazy(() => import('./pages/VisionNutrition'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Pricing = lazy(() => import('./pages/Pricing'));
import { useAuth } from './hooks/useAuth';
import { AuthService } from './services/AuthService';

import { Capacitor } from '@capacitor/core';
import { SocialAuthService } from './services/SocialAuthService';
import { SubscriptionService } from './services/SubscriptionService';

import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

const App: React.FC = () => {
  const { isAuthenticated, setUser } = useAuth();

  React.useEffect(() => {
    const initServices = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#020617' });
          await SplashScreen.hide();
          await SocialAuthService.init();
          await SubscriptionService.init();
        }
        
        // Sync profile if authenticated
        if (isAuthenticated) {
          const user = await AuthService.getProfile();
          setUser(user);
        }
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };
    initServices();

    // Hash routing handling
    const handleHash = () => {
      // Removed forced redirects to allow natural hash scrolling on landing page
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAuthenticated, setUser]);

  return (
    <BrowserRouter>
      <PageLoader />
      <Suspense fallback={<LoadingSpinner fullScreen message="Loading AuraSync..." />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pricing" element={<Suspense fallback={<LoadingSpinner />}><Pricing /></Suspense>} />
          
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
              <Route path="/onboarding" element={<Suspense fallback={<LoadingSpinner />}><Onboarding /></Suspense>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
