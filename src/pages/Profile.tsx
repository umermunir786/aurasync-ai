import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
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
  ArrowRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/AuthService';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [bmi, setBmi] = useState({ height: 180, weight: 75, result: 23.1 });
  const [showCalorieModal, setShowCalorieModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setUpdateMsg(null);
    try {
      await AuthService.updateProfile(formData);
      setUpdateMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setUpdateMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile' });
    } finally {
      setIsUpdating(false);
    }
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

  const calculateBMI = (h: number, w: number) => {
    const heightInMeters = h / 100;
    const result = w / (heightInMeters * heightInMeters);
    setBmi({ height: h, weight: w, result: parseFloat(result.toFixed(1)) });
  };

  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (val < 25) return { label: 'Healthy', color: 'text-green-400' };
    if (val < 30) return { label: 'Overweight', color: 'text-yellow-400' };
    return { label: 'Obese', color: 'text-red-400' };
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
                    <User size={64} className="text-slate-700" />
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
                icon={<User size={18} />} 
              />
              <Input 
                label="Email Address" 
                value={formData.email} 
                disabled
                icon={<Mail size={18} />} 
              />
              <Input label="Phone Number" defaultValue="+1 (555) 000-0000" icon={<Phone size={18} />} />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Gender</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdateProfile} isLoading={isUpdating}>Save Changes</Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BMI Calculator */}
            <Card className="space-y-6 border-indigo-500/20">
              <h3 className="text-lg font-bold text-white flex items-center">
                <CalcIcon className="mr-2 text-indigo-400" size={20} /> BMI Calculator
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center">
                      <Ruler size={12} className="mr-1" /> Height (cm)
                    </label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      value={bmi.height}
                      onChange={(e) => calculateBMI(Number(e.target.value), bmi.weight)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center">
                      <Scale size={12} className="mr-1" /> Weight (kg)
                    </label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      value={bmi.weight}
                      onChange={(e) => calculateBMI(bmi.height, Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-center space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Your BMI Score</p>
                  <h4 className="text-3xl font-black text-white">{bmi.result}</h4>
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
