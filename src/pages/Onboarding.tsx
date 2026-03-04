import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/AuthService';
import { ActivityService } from '../services/ActivityService';
import { 
  User as UserIcon, 
  Scale, 
  Ruler, 
  Calendar as CalendarIcon, 
  Activity,
  ArrowRight,
  ChevronLeft,
  Flame,
  Footprints,
  Droplets,
  Zap,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { 
    id: 'profile', 
    title: 'About You', 
    description: 'Let\'s get to know your basic details to personalize your experience.',
    icon: <UserIcon size={32} />
  },
  { 
    id: 'goals', 
    title: 'Your Goals', 
    description: 'What would you like to achieve? We\'ll help you track these daily.',
    icon: <Star size={32} />
  },
];

const Onboarding: React.FC = () => {
  const { user, setUser } = useAuth(); 
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    weight: user?.weight || 70,
    height: user?.height || 170,
    age: user?.age || 25,
    gender: user?.gender || 'male',
    goals: {
      calories: 2000,
      steps: 10000,
      water: 2.5
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Update Profile
      await AuthService.updateProfile({
        weight: formData.weight,
        height: formData.height,
        age: formData.age,
        gender: formData.gender,
        onboarded: true
      });

      // 2. Set Goals
      await ActivityService.upsertGoal({ goal_type: 'Calories', target_value: formData.goals.calories, unit: 'kcal', period: 'daily' });
      await ActivityService.upsertGoal({ goal_type: 'Steps', target_value: formData.goals.steps, unit: 'steps', period: 'daily' });
      await ActivityService.upsertGoal({ goal_type: 'Water', target_value: formData.goals.water, unit: 'liters', period: 'daily' });

      // Refresh user profile in state
      const updatedUser = await AuthService.getProfile();
      setUser(updatedUser);
      window.location.href = '/dashboard'; 
    } catch (err) {
      console.error('Onboarding error:', err);
      alert('Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/20 text-white mb-2"
          >
            {steps[currentStep].icon}
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl">
              {steps[currentStep].title}
            </h1>
            <p className="text-slate-400 text-lg max-w-sm mx-auto">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center gap-3 mb-4">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-500 shadow-sm ${
                idx === currentStep ? 'w-12 bg-indigo-500' : idx < currentStep ? 'w-4 bg-indigo-500/40' : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <Card className="p-8 border-white/5 relative overflow-hidden" glass={true}>
          {/* Subtle decoration inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          
          <AnimatePresence mode="wait">
            {currentStep === 0 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                      <Scale size={14} className="text-indigo-400" /> Weight (kg)
                    </label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-lg group-hover:border-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                      <Ruler size={14} className="text-indigo-400" /> Height (cm)
                    </label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-lg group-hover:border-white/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                      <CalendarIcon size={14} className="text-indigo-400" /> Age
                    </label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-lg group-hover:border-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                      <Activity size={14} className="text-indigo-400" /> Gender
                    </label>
                    <div className="relative group">
                      <select 
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-lg group-hover:border-white/20 appearance-none cursor-pointer"
                      >
                        <option value="male" className="bg-slate-900">Male</option>
                        <option value="female" className="bg-slate-900">Female</option>
                        <option value="other" className="bg-slate-900">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10 space-y-4">
                    <label className="text-xs font-bold text-orange-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Flame size={18} /> Daily Calories Goal (kcal)
                    </label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={formData.goals.calories}
                        onChange={(e) => setFormData({
                          ...formData, 
                          goals: { ...formData.goals, calories: parseInt(e.target.value) }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-black text-2xl"
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Footprints size={18} /> Daily Steps Goal
                    </label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={formData.goals.steps}
                        onChange={(e) => setFormData({
                          ...formData, 
                          goals: { ...formData.goals, steps: parseInt(e.target.value) }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-black text-2xl"
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 space-y-4">
                    <label className="text-xs font-bold text-cyan-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Droplets size={18} /> Daily Water Goal (Liters)
                    </label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.goals.water}
                        onChange={(e) => setFormData({
                          ...formData, 
                          goals: { ...formData.goals, water: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-black text-2xl"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mt-10">
            {currentStep > 0 && (
              <Button 
                variant="secondary" 
                onClick={handleBack}
                className="flex-1 py-4 !rounded-2xl border-white/5 hover:bg-white/10"
                disabled={isLoading}
              >
                <ChevronLeft size={20} className="mr-2" /> Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="flex-[2] py-4 !rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/20 text-lg font-bold"
              isLoading={isLoading}
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </Card>

        {currentStep === 0 && (
          <p className="text-center text-slate-500 text-sm flex items-center justify-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            Your data is used to calculate personalized health insights.
          </p>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
