import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Shield, ArrowRight, Sparkles, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const plans = [
  {
    name: 'Weekly',
    price: '$4.99',
    period: '/week',
    description: 'Perfect for a short-term health sprint.',
    features: [
      'Personalized AI Coaching',
      'Advanced Nutrition Scans',
      'Detailed Activity Analytics',
      'Custom Health Goals'
    ],
    color: 'from-blue-500 to-indigo-500',
    popular: false
  },
  {
    name: 'Monthly',
    price: '$14.99',
    period: '/month',
    description: 'Our most popular choice for long-term progress.',
    features: [
      'Everything in Weekly',
      'Priority AI Responses',
      'Early Access to Features',
      'Detailed PDF Health Reports',
      'Family Sharing (up to 2 users)'
    ],
    color: 'from-indigo-600 to-cyan-500',
    popular: true
  },
  {
    name: 'Yearly',
    price: '$99.99',
    period: '/year',
    description: 'The ultimate commitment to your vitality.',
    features: [
      'Everything in Monthly',
      '2 Months Free (Save 45%)',
      'Weekly 1-on-1 AI Deep Dives',
      'Full Data Export & API Access',
      'Exclusive Community Access'
    ],
    color: 'from-purple-600 to-indigo-600',
    popular: false
  }
];

export const PricingSection: React.FC<{ isPublic?: boolean }> = ({ isPublic = false }) => {
  return (
    <div className={`max-w-6xl w-full space-y-12 ${isPublic ? 'mx-auto' : ''}`}>
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold tracking-widest uppercase mb-4"
          >
            <Crown size={14} /> AuraSync Pro
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Invest in Your <span className="text-gradient">Vitality</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Unlock the full potential of AuraSync AI. Get personalized coaching, deeper analytics, and premium health insights tailored just for you.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-indigo-600/20">
                    Most Popular
                  </div>
                </div>
              )}

              <Card 
                className={`h-full flex flex-col p-8 border-white/5 relative overflow-hidden group ${plan.popular ? 'ring-2 ring-indigo-500/30' : ''}`}
                glass={true}
              >
                {/* Visual Flair */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-5 blur-3xl rounded-full group-hover:opacity-10 transition-opacity`} />
                
                <div className="space-y-6 relative z-10 flex-grow">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white tracking-tighter">{plan.price}</span>
                      <span className="text-slate-500 font-medium">{plan.period}</span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-0.5 rounded-full bg-gradient-to-br ${plan.color} text-white`}>
                          <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 space-y-4 relative z-10">
                  <Link to="/register" className="w-full">
                    <Button 
                      className={`w-full py-6 text-lg font-bold !rounded-2xl transition-all ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-xl shadow-indigo-600/20' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Get Started <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                  <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest font-bold">
                    No commitment. Cancel anytime.
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison or FAQ teaser */}
        <div className="text-center space-y-8 pb-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 opacity-60">
            <div className="flex items-center gap-3">
              <Shield className="text-indigo-400" size={24} />
              <span className="text-white font-medium">Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="text-indigo-400" size={24} />
              <span className="text-white font-medium">AI Insights</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="text-indigo-400" size={24} />
              <span className="text-white font-medium">Real-time Updates</span>
            </div>
          </div>
        </div>
      </div>
  );
};

const Pricing: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-start p-6 animate-in fade-in duration-1000">
      <PricingSection />
    </div>
  );
};

export default Pricing;
