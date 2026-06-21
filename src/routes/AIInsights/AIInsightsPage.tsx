import { useState, useCallback, Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Zap, ArrowUpDown, Lightbulb, Activity, SlidersHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FEATURES } from '@/lib/constants';
import type { PredictionInput } from '@/lib/constants';
import { predict } from '@/lib/onnx/onnxEngine';
import PageTransition from '@/components/animations/PageTransition';
import SceneContainer from '@/components/3d/SceneContainer';

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// Simulated SHAP-like feature impact data
const featureImpacts = [
  { feature: 'Hours Coding', impact: 0.22, direction: 'positive', color: '#00E5FF' },
  { feature: 'Sleep Hours', impact: 0.20, direction: 'positive', color: '#7C3AED' },
  { feature: 'Distractions', impact: -0.18, direction: 'negative', color: '#EF4444' },
  { feature: 'Coffee Intake', impact: 0.12, direction: 'positive', color: '#F59E0B' },
  { feature: 'Commits', impact: 0.10, direction: 'positive', color: '#10B981' },
  { feature: 'Cognitive Load', impact: -0.09, direction: 'negative', color: '#EF4444' },
  { feature: 'Bugs Reported', impact: -0.06, direction: 'negative', color: '#EF4444' },
  { feature: 'AI Usage', impact: 0.05, direction: 'positive', color: '#22D3EE' },
];

function WaterfallChart() {
  const data = featureImpacts.map((f) => ({
    name: f.feature,
    value: Math.abs(f.impact),
    fill: f.impact >= 0 ? '#10B981' : '#EF4444',
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 90 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
        <YAxis type="category" dataKey="name" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'Inter' }} width={90} />
        <Tooltip
          contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#F1F5F9', fontFamily: 'Space Grotesk' }}
          itemStyle={{ color: '#94A3B8', fontFamily: 'JetBrains Mono' }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22} name="Impact">
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* What-If Simulator */
function WhatIfSimulator() {
  const defaults: PredictionInput = {
    hours_coding: 5, coffee_intake_mg: 400, distractions: 3, sleep_hours: 7,
    commits: 5, bugs_reported: 1, ai_usage_hours: 1.5, cognitive_load: 4,
  };

  const [inputs, setInputs] = useState<PredictionInput>(defaults);
  const [result, setResult] = useState<number | null>(null);
  const [baseResult, setBaseResult] = useState<number | null>(null);

  const runPredict = useCallback(async (inp: PredictionInput) => {
    const { probability } = await predict(inp);
    setResult(probability);
  }, []);

  const initBase = useCallback(async () => {
    const { probability } = await predict(defaults);
    setBaseResult(probability);
    setResult(probability);
  }, []);

  // Init on first render
  useState(() => { initBase(); });

  const handleChange = (key: keyof PredictionInput, val: number) => {
    const newInputs = { ...inputs, [key]: val };
    setInputs(newInputs);
    runPredict(newInputs);
  };

  const diff = result !== null && baseResult !== null ? result - baseResult : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs mb-1" style={{ color: '#64748B' }}>Base Prediction</div>
          <div className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono', color: '#94A3B8' }}>
            {baseResult !== null ? (baseResult * 100).toFixed(1) : '—'}%
          </div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs mb-1" style={{ color: '#64748B' }}>Current Prediction</div>
          <div className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono', color: diff >= 0 ? '#10B981' : '#EF4444' }}>
            {result !== null ? (result * 100).toFixed(1) : '—'}%
          </div>
          {diff !== 0 && (
            <div className="text-xs mt-1" style={{ color: diff >= 0 ? '#10B981' : '#EF4444', fontFamily: 'JetBrains Mono' }}>
              {diff >= 0 ? '+' : ''}{(diff * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {FEATURES.map((feature) => {
        const val = inputs[feature.key];
        const pct = ((val - feature.min) / (feature.max - feature.min)) * 100;
        return (
          <div key={feature.key} className="flex items-center gap-3">
            <span className="text-xs w-24 flex-shrink-0" style={{ color: '#94A3B8' }}>{feature.label}</span>
            <input
              type="range"
              min={feature.min} max={feature.max} step={feature.step} value={val}
              onChange={(e) => handleChange(feature.key, parseFloat(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #7C3AED ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }}
            />
            <span className="text-xs w-12 text-right font-bold" style={{ fontFamily: 'JetBrains Mono', color: '#F1F5F9' }}>
              {Number.isInteger(feature.step) ? val : val.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AIInsightsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden">
        <div className="container">
          {/* Hero */}
          <div className="relative h-52 rounded-3xl overflow-hidden mb-12" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <Suspense fallback={null}>
              <SceneContainer variant="core" />
            </Suspense>
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse, rgba(5,8,22,0.5), rgba(5,8,22,0.9))' }}>
              <div className="text-center">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                  Inside The Model
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-sm mt-2" style={{ color: '#94A3B8' }}>
                  Understand why the AI makes its predictions
                </motion.p>
              </div>
            </div>
          </div>

          {/* Feature Impact + SHAP */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <RevealSection>
              <div className="glass rounded-2xl p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>
                    <ArrowUpDown className="w-5 h-5" style={{ color: '#00E5FF' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>Feature Impact</h3>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>SHAP-inspired analysis of feature contributions</p>
                  </div>
                </div>
                <div className="h-80">
                  <WaterfallChart />
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <div className="glass rounded-2xl p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <Lightbulb className="w-5 h-5" style={{ color: '#7C3AED' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>Key Insights</h3>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>What the model has learned</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Coding hours are the strongest predictor', desc: 'Developers coding 5-8 hours daily show highest success rates. Beyond 8 hours, diminishing returns kick in.', color: '#00E5FF' },
                    { title: 'Sleep quality matters more than quantity', desc: '7-8 hours of sleep is optimal. Less than 6 hours significantly reduces success probability.', color: '#7C3AED' },
                    { title: 'Distractions have compound effects', desc: 'Each additional distraction reduces success probability by ~5%. Minimizing interruptions has outsized impact.', color: '#EF4444' },
                    { title: 'AI tools amplify productivity', desc: '1-3 hours of AI usage correlates with higher success. Beyond that, diminishing returns appear.', color: '#22D3EE' },
                    { title: 'Cognitive load is a hidden killer', desc: 'High cognitive load (>7) is strongly associated with failure, even when other metrics look good.', color: '#F59E0B' },
                  ].map((insight, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: insight.color }} />
                        <div>
                          <div className="text-xs font-semibold" style={{ color: '#F1F5F9' }}>{insight.title}</div>
                          <div className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#64748B' }}>{insight.desc}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>

          {/* What-If Simulator */}
          <RevealSection className="mb-12">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  <SlidersHorizontal className="w-5 h-5" style={{ color: '#22D3EE' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>What-If Simulator</h3>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>Adjust features and see how predictions change in real-time</p>
                </div>
              </div>
              <WhatIfSimulator />
            </div>
          </RevealSection>
        </div>
      </div>
    </PageTransition>
  );
}
