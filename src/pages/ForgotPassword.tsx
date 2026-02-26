import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const resetSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm<OTPFormValues>({ resolver: zodResolver(otpSchema) });
  const resetForm = useForm<ResetFormValues>({ resolver: zodResolver(resetSchema) });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.forgotPassword(data.email);
      setEmail(data.email);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSubmit = async (data: OTPFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.verifyOTP(email, data.otp);
      setOtp(data.otp);
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.resetPassword({
        email,
        otp,
        new_password: data.newPassword
      });
      setStep('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
        <Card className="w-full max-w-md text-center space-y-6" glass={true}>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 text-green-400">
              <CheckCircle2 size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Password Reset!</h1>
          <p className="text-slate-400 text-lg">Your password has been updated successfully. Redirecting to login...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full"></div>

      <Card className="w-full max-w-md space-y-8 relative z-10" glass={true}>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gradient">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'reset' && 'New Password'}
          </h1>
          <p className="text-slate-400">
            {step === 'email' && "Enter your email to receive a recovery code"}
            {step === 'otp' && `We've sent a 6-digit code to ${email}`}
            {step === 'reset' && "Set a strong password for your account"}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              placeholder="name@example.com"
              icon={<Mail size={20} />}
              {...emailForm.register('email')}
              error={emailForm.formState.errors.email?.message}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send OTP <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-6">
            <Input
              label="Recovery Code"
              placeholder="123456"
              icon={<ShieldCheck size={20} />}
              {...otpForm.register('otp')}
              error={otpForm.formState.errors.otp?.message}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Verify OTP <ArrowRight size={18} className="ml-2" />
            </Button>
            <button 
              type="button" 
              onClick={() => setStep('email')}
              className="w-full text-slate-400 hover:text-white text-sm transition-colors"
            >
              Back to Email
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              {...resetForm.register('newPassword')}
              error={resetForm.formState.errors.newPassword?.message}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              icon={<KeyRound size={20} />}
              {...resetForm.register('confirmPassword')}
              error={resetForm.formState.errors.confirmPassword?.message}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Reset Password <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
        )}

        <p className="text-center text-slate-400 text-sm">
          Remember your password?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPassword;
