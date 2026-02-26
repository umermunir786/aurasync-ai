import React, { useState } from 'react';
import { Camera as CameraIcon, Sparkles, Plus, History, Loader2, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { VisionService, FoodAnalysis } from '../services/VisionService';
import { motion, AnimatePresence } from 'framer-motion';

const VisionNutrition: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodAnalysis[] | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  const handleCapture = async () => {
    setIsAnalyzing(true);
    setResults(null);
    setIsLogged(false);
    try {
      const analysis = await VisionService.captureAndAnalyze();
      setResults(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLog = () => {
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 2000);
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
          <h1 className="text-3xl font-bold text-white">AI Vision Nutrition</h1>
          <p className="text-slate-400">Scan your meal for instant macro breakdown</p>
        </div>
        <Button onClick={handleCapture} disabled={isAnalyzing} className="h-12 px-8">
          {isAnalyzing ? <Loader2 className="mr-2 animate-spin" /> : <CameraIcon className="mr-2" />}
          Capture Meal
        </Button>
      </div>

      {!results && !isAnalyzing && (
        <Card className="flex flex-col items-center justify-center py-20 border-dashed border-2 border-white/5 bg-white/[0.02]">
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400">
            <CameraIcon size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">Ready to scan?</h3>
          <p className="text-slate-400 text-center max-w-sm">
            Hold your camera steady over your food and press the button above to analyze your meal.
          </p>
        </Card>
      )}

      {isAnalyzing && (
        <Card className="flex flex-col items-center justify-center py-20 bg-white/[0.02]">
          <Loader2 size={48} className="text-indigo-500 animate-spin mb-6" />
          <h3 className="text-xl font-bold mb-2 animate-pulse">AI is Analyzing...</h3>
          <p className="text-slate-400">Identifying food items and estimating portion sizes.</p>
        </Card>
      )}

      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Analysis details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-indigo-500/5">
                  <h3 className="font-bold flex items-center">
                    <Sparkles size={18} className="mr-2 text-indigo-400" />
                    Analysis Results
                  </h3>
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">
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
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span>Yesterday, 08:30 PM</span>
                    <span className="font-bold text-white">420 kcal</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Yesterday, 12:15 PM</span>
                    <span className="font-bold text-white">680 kcal</span>
                  </div>
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
