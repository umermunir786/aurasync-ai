import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Scale, 
  Ruler, 
  Calculator as CalcIcon,
  Shield,
  Bell,
  CreditCard,
  ChevronRight,
  Info,
  Zap,
  ArrowRight,
  Calendar as CalendarIcon,
  Crown
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/AuthService';

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [showCalorieModal, setShowCalorieModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    weight: user?.weight || 0,
    height: user?.height || 0,
    age: user?.age || 0,
    gender: user?.gender || 'Male',
  });

  const [bmi, setBmi] = useState({ 
    result: user?.weight && user?.height ? parseFloat((user.weight / ((user.height / 100) ** 2)).toFixed(1)) : 0 
  });

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setUpdateMsg(null);
    try {
      await AuthService.updateProfile(formData);
      // Refresh local user state
      const updatedUser = await AuthService.getProfile();
      setUser(updatedUser);
      setUpdateMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setUpdateMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile' });
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateBMI = (h: number, w: number) => {
    if (!h || !w) return;
    const heightInMeters = h / 100;
    const result = w / (heightInMeters * heightInMeters);
    setBmi({ result: parseFloat(result.toFixed(1)) });
  };

  // Update BMI when weight or height changes
  React.useEffect(() => {
    calculateBMI(formData.height, formData.weight);
  }, [formData.height, formData.weight]);

  const getBMICategory = (val: number) => {
    if (val === 0) return { label: 'Enter Data', color: 'text-slate-500' };
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (val < 25) return { label: 'Healthy', color: 'text-green-400' };
    if (val < 30) return { label: 'Overweight', color: 'text-yellow-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };

  const handleAvatarClick = async () => {
    const result = await ActionSheet.showActions({
      title: 'Profile Picture',
      message: 'Choose a source',
      options: [
        {
          title: 'Take Photo',
        },
        {
          title: 'Choose from Gallery',
        },
        {
          title: 'Cancel',
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    if (result.index === 0) {
      takePhoto(CameraSource.Camera);
    } else if (result.index === 1) {
      takePhoto(CameraSource.Photos);
    }
  };

  const takePhoto = async (source: CameraSource) => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: source,
      });
      setAvatarUrl(image.webPath || null);
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>
          <p className="text-slate-400">Manage your personal information and health preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-6">
          <Card className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-1">
                <div className="w-full h-full rounded-[20px] bg-slate-900 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={64} className="text-slate-700" />
                  )}
                </div>
              </div>
              <button 
                onClick={handleAvatarClick}
                className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl text-white border-2 border-slate-900 hover:bg-indigo-500 transition-colors active:scale-90"
              >
                <Camera size={18} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.full_name || 'User'}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xl font-bold text-white">12</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Goals Met</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">1.2k</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Points</p>
              </div>
            </div>
            <div className="pt-4 flex flex-col items-center">
              <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border shadow-lg transition-all ${
                user?.subscription_tier === 'pro' 
                  ? 'bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border-amber-500/30 text-amber-400 font-bold' 
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}>
                <Crown size={14} className={user?.subscription_tier === 'pro' ? 'text-amber-400' : 'text-slate-500'} />
                <span className="text-[10px] uppercase tracking-[0.15em]">
                  {user?.subscription_tier || 'Free'} Plan
                </span>
              </div>
            </div>
          </Card>

          <Card className="space-y-1 p-2">
            {[
              { label: 'Security', icon: <Shield size={18} />, color: 'text-green-400' },
              { label: 'Notifications', icon: <Bell size={18} />, color: 'text-indigo-400' },
              { label: 'Subscriptions', icon: <CreditCard size={18} />, color: 'text-purple-400' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-all group text-left">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-white/5 rounded-lg ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </Card>
        </div>

        {/* Form & Calculators */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <h3 className="text-lg font-bold text-white">Personal Information</h3>
            
            {updateMsg && (
              <div className={`p-3 rounded-xl border ${updateMsg.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} text-sm`}>
                {updateMsg.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Full Name" 
                value={formData.full_name} 
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                icon={<UserIcon size={18} />} 
              />
              <Input 
                label="Email Address" 
                value={formData.email} 
                disabled
                icon={<Mail size={18} />} 
              />
              <Input 
                label="Age" 
                type="number"
                value={formData.age} 
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                icon={<CalendarIcon size={18} className="text-slate-400" />} 
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="Male" className="bg-slate-900">Male</option>
                  <option value="Female" className="bg-slate-900">Female</option>
                  <option value="Other" className="bg-slate-900">Other</option>
                </select>
              </div>
              <Input 
                label="Weight (kg)" 
                type="number"
                value={formData.weight} 
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                icon={<Scale size={18} className="text-slate-400" />} 
              />
              <Input 
                label="Height (cm)" 
                type="number"
                value={formData.height} 
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                icon={<Ruler size={18} className="text-slate-400" />} 
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdateProfile} isLoading={isUpdating}>Save Changes</Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BMI Calculator */}
            <Card className="space-y-6 border-indigo-500/20">
              <h3 className="text-lg font-bold text-white flex items-center">
                <CalcIcon className="mr-2 text-indigo-400" size={20} /> Body Mass Index (BMI)
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Your BMI is calculated automatically based on the weight and height in your profile.
                </p>

                <div className="p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-center space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Calculated Score</p>
                  <h4 className="text-4xl font-black text-white">{bmi.result || '--'}</h4>
                  <p className={`text-sm font-bold ${getBMICategory(bmi.result).color}`}>
                    {getBMICategory(bmi.result).label}
                  </p>
                </div>
              </div>
            </Card>

            {/* Calorie Tool Card */}
            <Card className="flex flex-col justify-between bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-indigo-500/30">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Daily Calorie Calculator</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on your activity level.
                </p>
              </div>
              <Button onClick={() => setShowCalorieModal(true)} variant="outline" className="mt-8 group">
                Open Calculator <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Simple Calorie Modal */}
      {showCalorieModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg space-y-6" glass={false}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Calorie Needs Calculator</h3>
              <button onClick={() => setShowCalorieModal(false)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input label="Age" type="number" defaultValue="25" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Activity Level</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-300">
                    <option>Sedentary</option>
                    <option>Lightly Active</option>
                    <option>Moderately Active</option>
                    <option>Very Active</option>
                  </select>
                </div>
              </div>

              <div className="p-6 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-indigo-500/20">
                  <span className="text-slate-300">Maintenance Calories</span>
                  <span className="text-2xl font-bold text-white">2,450 kcal</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-xl bg-black/20">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Weight Loss</p>
                    <p className="text-lg font-bold text-cyan-400">1,950 kcal</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-black/20">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Muscle Gain</p>
                    <p className="text-lg font-bold text-purple-400">2,950 kcal</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1" onClick={() => setShowCalorieModal(false)}>Save to Goals</Button>
                <Button variant="ghost" className="flex-1" onClick={() => setShowCalorieModal(false)}>Close</Button>
              </div>

              <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center">
                <Info size={10} className="mr-1" /> Results are estimates based on the Harris-Benedict formula.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
