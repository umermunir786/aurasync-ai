import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/AuthService';
import { ActivityService } from '../services/ActivityService';
import { 
  User, 
  Scale, 
  Ruler, 
  Calendar as CalendarIcon, 
  Activity,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'profile', title: 'About You', description: 'Let\'s get to know your basic details.' },
  { id: 'goals', title: 'Your Goals', description: 'What would you like to achieve?' },
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
      water: 2
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
      window.location.href = '/dashboard'; // Hard reload to ensure state freshness
    } catch (err) {
      alert('Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to JuraSync</h1>
          <p className="text-slate-400">{steps[currentStep].description}</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'}`}
            />
          ))}
        </div>

        <Card className="p-8 border-white/10" glass={true}>
          <AnimatePresence mode="wait">
            {currentStep === 0 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Scale size={14} /> Weight (kg)
                      </label>
                      <input 
                        type="number" 
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Ruler size={14} /> Height (cm)
                      </label>
                      <input 
                        type="number" 
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <CalendarIcon size={14} /> Age
                      </label>
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} /> Gender
                      </label>
                      <select 
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium appearance-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
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
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Flame size={14} className="text-orange-400" /> Daily Calories Goal
                    </label>
                    <input 
                      type="number" 
                      value={formData.goals.calories}
                      onChange={(e) => setFormData({
                        ...formData, 
                        goals: { ...formData.goals, calories: parseInt(e.target.value) }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Footprints size={14} className="text-indigo-400" /> Daily Steps Goal
                    </label>
                    <input 
                      type="number" 
                      value={formData.goals.steps}
                      onChange={(e) => setFormData({
                        ...formData, 
                        goals: { ...formData.goals, steps: parseInt(e.target.value) }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Droplets size={14} className="text-cyan-400" /> Daily Water (Liters)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formData.goals.water}
                      onChange={(e) => setFormData({
                        ...formData, 
                        goals: { ...formData.goals, water: parseFloat(e.target.value) }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mt-8">
            {currentStep > 0 && (
              <Button 
                variant="secondary" 
                onClick={handleBack}
                className="flex-1"
                disabled={isLoading}
              >
                <ChevronLeft size={18} className="mr-2" /> Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="flex-1"
              isLoading={isLoading}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Placeholder icons missing from lucide-react if any
const Flame = ({ size, className }: any) => <Activity size={size} className={className} />;
const Footprints = ({ size, className }: any) => <Activity size={size} className={className} />;
const Droplets = ({ size, className }: any) => <Activity size={size} className={className} />;

export default Onboarding;
