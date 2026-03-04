import React, { useState } from 'react';
import { Camera as CameraIcon, Sparkles, Plus, History, Loader2, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { VisionService } from '../services/VisionService';
import type { FoodAnalysis } from '../services/VisionService';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { format } from 'date-fns';

interface NutritionLog {
  id: number;
  item_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  image_url?: string;
  created_at: string;
}

const VisionNutrition: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodAnalysis[] | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [recentScans, setRecentScans] = useState<NutritionLog[]>([]);
  const [isLoadingScans, setIsLoadingScans] = useState(false);

  const fetchRecentScans = async () => {
    setIsLoadingScans(true);
    try {
      const response = await api.get<NutritionLog[]>('/ai/recent-scans');
      setRecentScans(response.data);
    } catch (err) {
      console.error('Failed to fetch recent scans:', err);
    } finally {
      setIsLoadingScans(false);
    }
  };

  React.useEffect(() => {
    fetchRecentScans();
  }, []);

  const handleCapture = async () => {
    setIsAnalyzing(true);
    setResults(null);
    setCurrentImageUrl(null);
    setIsLogged(false);
    try {
      const { analysis, imageUrl } = await VisionService.captureAndAnalyze();
      setResults(analysis);
      setCurrentImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLog = async () => {
    if (!results || results.length === 0) return;
    
    setIsLogged(true);
    try {
      for (const item of results) {
        await api.post('/ai/log-nutrition', {
          item_name: item.item,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          confidence: item.confidence,
          image_url: currentImageUrl // Pass the image captured
        });
      }
      await fetchRecentScans();
    } catch (err) {
      console.error('Failed to log nutrition:', err);
      setIsLogged(false);
    } finally {
      setTimeout(() => setIsLogged(false), 2000);
    }
  };

  const totalMacros = results?.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Vision Nutrition</h1>
          <p className="text-slate-400">Scan your meal for instant macro breakdown</p>
        </div>
        <Button onClick={handleCapture} disabled={isAnalyzing} className="h-12 px-8 shadow-lg shadow-indigo-500/20">
          {isAnalyzing ? <Loader2 className="mr-2 animate-spin" /> : <CameraIcon className="mr-2" />}
          Capture Meal
        </Button>
      </div>

      {!results && !isAnalyzing && (
        <Card className="flex flex-col items-center justify-center py-24 border-dashed border-2 border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mb-8 text-indigo-400 shadow-2xl">
            <CameraIcon size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Ready to scan?</h3>
          <p className="text-slate-400 text-center max-w-sm leading-relaxed">
            Hold your camera steady over your food and press the button above to analyze your meal.
          </p>
        </Card>
      )}

      {isAnalyzing && currentImageUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-0 overflow-hidden bg-slate-900/50 backdrop-blur-xl border-white/10 relative">
            <div className="aspect-video w-full relative">
              <img src={currentImageUrl} alt="Meal Preview" className="w-full h-full object-cover brightness-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 size={64} className="text-indigo-500 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">AI is Analyzing...</h3>
                <p className="text-slate-200/70">Identifying food items and portion sizes</p>
              </div>
            </div>
          </Card>
          <div className="space-y-6">
            <Card className="animate-pulse h-64 bg-white/5 border-white/10"><></></Card>
            <Card className="animate-pulse h-48 bg-white/5 border-white/10"><></></Card>
          </div>
        </div>
      )}

      {isAnalyzing && !currentImageUrl && (
        <Card className="flex flex-col items-center justify-center py-20 bg-white/[0.02] backdrop-blur-xl">
          <Loader2 size={48} className="text-indigo-500 animate-spin mb-6" />
          <h3 className="text-xl font-bold mb-2 animate-pulse">Initializing Capture...</h3>
        </Card>
      )}

      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Analysis details */}
            <div className="lg:col-span-2 space-y-6">
              {currentImageUrl && (
                <Card className="p-0 overflow-hidden border-white/10 shadow-2xl">
                  <div className="aspect-video w-full relative group">
                    <img src={currentImageUrl} alt="Analyzed Meal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="flex items-center space-x-2 text-white bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        <Sparkles size={12} />
                        <span>AI Verified Meal</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-0 overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.03]">
                  <h3 className="font-bold flex items-center text-white">
                    <Sparkles size={18} className="mr-2 text-indigo-400" />
                    Macro Breakdown
                  </h3>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    High Confidence
                  </span>
                </div>
                <div className="divide-y divide-white/5 text-sm">
                  {results.map((item, idx) => (
                    <div key={idx} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div>
                        <h4 className="font-bold text-white mb-1">{item.item}</h4>
                        <div className="flex space-x-3 text-slate-500 text-xs">
                          <span>P: {item.protein}g</span>
                          <span>C: {item.carbs}g</span>
                          <span>F: {item.fat}g</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-white">{item.calories}</span>
                        <span className="text-[10px] text-slate-500 block">kcal</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Calories', value: totalMacros?.calories, unit: 'kcal', color: 'text-indigo-400' },
                  { label: 'Protein', value: totalMacros?.protein, unit: 'g', color: 'text-purple-400' },
                  { label: 'Carbs', value: totalMacros?.carbs, unit: 'g', color: 'text-cyan-400' },
                  { label: 'Fat', value: totalMacros?.fat, unit: 'g', color: 'text-orange-400' },
                ].map((stat, i) => (
                  <Card key={i} className="text-center p-4">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-tighter mb-1">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-slate-400">{stat.unit}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <Card className="bg-indigo-600 shadow-xl shadow-indigo-500/20 text-white border-0">
                <h3 className="font-bold mb-4">Log to Journal</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Save this meal analysis to your daily nutrition log to keep your streaks alive.
                </p>
                <Button 
                  onClick={handleLog} 
                  variant="secondary" 
                  className="w-full bg-white text-indigo-600 hover:bg-white/90"
                >
                  {isLogged ? <Check className="mr-2" /> : <Plus className="mr-2" />}
                  {isLogged ? 'Logged Successfully' : 'Confirm & Log'}
                </Button>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <h3 className="font-bold mb-4 flex items-center">
                  <History size={18} className="mr-2 text-slate-400" />
                  Recent Scans
                </h3>
                <div className="space-y-4 text-xs">
                  {isLoadingScans ? (
                    <div className="flex justify-center p-4">
                      <Loader2 size={16} className="animate-spin text-slate-500" />
                    </div>
                  ) : recentScans.length > 0 ? (
                    recentScans.map((scan) => (
                      <div key={scan.id} className="flex justify-between items-center text-slate-400 mb-1 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {scan.image_url && (
                            <img src={scan.image_url} alt={scan.item_name} className="w-8 h-8 rounded-md object-cover border border-white/10" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{scan.item_name}</span>
                            <span className="text-[10px]">{format(new Date(scan.created_at), 'MMM d, hh:mm a')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white">{scan.calories} kcal</span>
                          <span className="text-[10px] block opacity-50">{Math.round(scan.confidence * 100)}% conf.</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">No recent scans found.</p>
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisionNutrition;
