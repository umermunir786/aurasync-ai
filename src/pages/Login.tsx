import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SocialAuthService } from '../services/SocialAuthService';
import { NotificationService } from '../services/NotificationService';
import { Capacitor } from '@capacitor/core';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, setError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    const setupNotifications = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const granted = await NotificationService.requestPermissions();
          if (granted) {
            await NotificationService.registerPush();
          }
        }
      } catch (err) {
        console.error('Failed to setup notifications on login mount:', err);
      }
    };
    setupNotifications();
    // Clear error on mount
    setError(null);
  }, []);

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      let result;
      if (provider === 'google') {
        result = await SocialAuthService.loginWithGoogle();
      } else {
        result = await SocialAuthService.loginWithApple();
      }
      
      console.log(`${provider} login successful`, result);
      // Here you would typically send result.idToken or result.accessToken to your backend
      // and then call login from useAuth
      
      navigate('/dashboard');
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 p-safe bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/30 blur-[120px] rounded-full"></div>

      <Card className="w-full max-w-md space-y-8 relative z-10" glass={true}>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gradient">Welcome Back</h1>
          <p className="text-slate-400">Enter your credentials to access your fitness insights</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            placeholder="name@example.com"
            icon={<Mail size={20} />}
            {...register('email')}
            error={errors.email?.message}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock size={20} />}
              {...register('password')}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500/30" />
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" title="sm" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0f172a] px-2 text-slate-500 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" className="w-full" onClick={() => handleSocialLogin('google')}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.48-1.52 1.52-3.8 2.72-7.72 2.72-6.8 0-12.48-5.48-12.48-12.2s5.68-12.2 12.48-12.2c3.72 0 6.44 1.48 8.4 3.32l2.32-2.32C21.2.92 17.52-1 12.48-1 5.48-1 0 4.52 0 11.32s5.48 12.32 12.48 12.32c3.84 0 6.64-1.28 8.84-3.52 2.32-2.32 3.12-5.56 3.12-8.32 0-.84-.08-1.52-.16-2.12L12.48 10.92z"/>
            </svg>
            Google
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => handleSocialLogin('apple')}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.96.95-2.05 1.78-3.3 1.78-1.4 0-1.85-.85-3.4-.85-1.5 0-2.1.85-3.4.85-1.3 0-2.45-.88-3.45-1.95-2.05-2.2-3.6-6.2-3.6-9.8 0-5.85 4.35-8.95 8.5-8.95 1.35 0 2.5.58 3.35.58.85 0 2.15-.65 3.75-.65 2.15 0 4.15 1.25 5.25 2.85-4.45 1.95-3.7 7.75.95 9.7-.9 2.05-2.4 4.5-4.65 6.45zm-4.35-18.15C12.7 3.5 13.9 4.3 14.8 5.4c.15.18.25.38.3.5.05.12.1.25.1.4 0 .35-.15.7-.4 1.05-.85.9-2.1 1.45-3.35 1.45-.15 0-.3-.02-.45-.05-.15-.02-.2-.05-.3-.12-.05-.05-.1-.1-.1-.2 0-.3.15-.7.4-1.05.95-1.15 2.3-1.85 3.35-1.8 0-.85-.45-1.9-1.2-2.6-.75-.7-1.75-1.2-2.85-1.2-.05 0-.1-.02-.15-.02-.05 0-.1 0-.15-.02.3-1.4 1.45-2.6 2.85-2.6z"/>
            </svg>
            Apple
          </Button>
        </div>

        <p className="text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
