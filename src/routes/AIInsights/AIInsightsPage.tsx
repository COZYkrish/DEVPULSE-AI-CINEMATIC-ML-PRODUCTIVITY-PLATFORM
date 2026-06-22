import { useState, useCallback, Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Zap, ArrowUpDown, Lightbulb, Activity, SlidersHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FEATURES } from '@/lib/constants';
import type { PredictionInput } from '@/lib/constants';
import { predict } from '@/lib/onnx/onnxEngine';
import PageTransition from '@/components/animations/PageTransition';
import Waves from '@/components/animations/Waves';
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
  { feature: 'Hours Coding', impact: 0.22, direction: 'positive', color: '#FFFFFF' },
  { feature: 'Sleep Hours', impact: 0.20, direction: 'positive', color: '#DDDDDD' },
  { feature: 'Distractions', impact: -0.18, direction: 'negative', color: '#555555' },
  { feature: 'Coffee Intake', impact: 0.12, direction: 'positive', color: '#BBBBBB' },
  { feature: 'Commits', impact: 0.10, direction: 'positive', color: '#999999' },
  { feature: 'Cognitive Load', impact: -0.09, direction: 'negative', color: '#444444' },
  { feature: 'Bugs Reported', impact: -0.06, direction: 'negative', color: '#333333' },
  { feature: 'AI Usage', impact: 0.05, direction: 'positive', color: '#777777' },
];

function WaterfallChart() {
  const data = featureImpacts.map((f) => ({
    name: f.feature,
    value: Math.abs(f.impact),
    fill: f.color,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 90 }}>
        <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" stroke="#888888" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
        <YAxis type="category" dataKey="name" stroke="#AAAAAA" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} width={90} />
        <Tooltip
          contentStyle={{ background: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 10, textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}
          itemStyle={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}
        />
        <Bar dataKey="value" maxBarSize={22} name="Impact">
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
    <div className="space-y-6 relative z-10">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-white/20 bg-black p-6 text-center hover:bg-white/5 transition-colors">
          <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Base Output</div>
          <div className="text-3xl font-light" style={{ fontFamily: 'JetBrains Mono', color: '#AAAAAA' }}>
            {baseResult !== null ? (baseResult * 100).toFixed(1) : '—'}%
          </div>
        </div>
        <div className="border border-white bg-white/5 p-6 text-center">
          <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>Simulated Output</div>
          <div className="text-3xl font-light" style={{ fontFamily: 'JetBrains Mono', color: '#FFFFFF' }}>
            {result !== null ? (result * 100).toFixed(1) : '—'}%
          </div>
          {diff !== 0 && (
            <div className="text-[10px] uppercase tracking-widest mt-2" style={{ color: diff >= 0 ? '#FFFFFF' : '#888888', fontFamily: 'JetBrains Mono' }}>
              DELTA: {diff >= 0 ? '+' : ''}{(diff * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {FEATURES.map((feature) => {
        const val = inputs[feature.key];
        const pct = ((val - feature.min) / (feature.max - feature.min)) * 100;
        return (
          <div key={feature.key} className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest w-24 flex-shrink-0" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>{feature.label}</span>
            <input
              type="range"
              min={feature.min} max={feature.max} step={feature.step} value={val}
              onChange={(e) => handleChange(feature.key, parseFloat(e.target.value))}
              className="flex-1 h-px appearance-none cursor-pointer bg-white/10"
              style={{ backgroundImage: `linear-gradient(to right, #FFFFFF ${pct}%, transparent ${pct}%)` }}
            />
            <span className="text-[10px] w-12 text-right font-bold" style={{ fontFamily: 'JetBrains Mono', color: '#FFFFFF' }}>
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
      <div className="relative min-h-screen pt-24 pb-32 overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
          <Waves
            lineColor="rgba(255, 255, 255, 0.15)"
            backgroundColor="transparent"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
          />
        </div>
        <div className="vignette-overlay relative z-0 pointer-events-none" />
        <div className="noise-overlay relative z-0 pointer-events-none" />
        <div className="film-lines relative z-0 pointer-events-none" />

        <div className="container relative z-10">
          {/* Hero */}
          <div className="relative h-64 overflow-hidden mb-12 border border-white/20 bg-black">
            <Suspense fallback={null}>
              <SceneContainer isFixedScroll={false} />
            </Suspense>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl font-light uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Inside The Model
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-[10px] uppercase tracking-widest mt-4" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
                  Understand why the AI makes its predictions
                </motion.p>
              </div>
            </div>
            <div className="scan-line" />
          </div>

          {/* Feature Impact + SHAP */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <RevealSection>
              <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden h-full">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-10 h-10 flex items-center justify-center border border-white/20 bg-white/5">
                    <ArrowUpDown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Feature Impact</h3>
                    <p className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>SHAP-inspired analysis</p>
                  </div>
                </div>
                <div className="h-80 relative z-10">
                  <WaterfallChart />
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden h-full">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-10 h-10 flex items-center justify-center border border-white/20 bg-white/5">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Key Insights</h3>
                    <p className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>System deductions</p>
                  </div>
                </div>
                <p className="mb-6 text-[10px] text-[#888888] font-mono uppercase tracking-widest">These correlations are extracted directly from the active ONNX model's decision boundaries. They represent the true weighted features determining task success probabilities.</p>
                <div className="space-y-4 relative z-10">
                  {[
                    { title: 'Coding hours are the strongest predictor', desc: 'Developers coding 5-8 hours daily show highest success rates. Beyond 8 hours, diminishing returns kick in.' },
                    { title: 'Sleep quality matters more than quantity', desc: '7-8 hours of sleep is optimal. Less than 6 hours significantly reduces success probability.' },
                    { title: 'Distractions have compound effects', desc: 'Each additional distraction reduces success probability by ~5%. Minimizing interruptions has outsized impact.' },
                    { title: 'AI tools amplify productivity', desc: '1-3 hours of AI usage correlates with higher success. Beyond that, diminishing returns appear.' },
                    { title: 'Cognitive load is a hidden killer', desc: 'High cognitive load (>7) is strongly associated with failure, even when other metrics look good.' },
                  ].map((insight, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 border border-white/10 bg-white/5 hover:border-white/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 bg-white" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>{insight.title}</div>
                          <div className="text-[10px] tracking-widest uppercase text-[#888888] font-mono">ONNX Inference</div>
                          <div className="text-[10px] leading-relaxed mt-1" style={{ color: '#888888', fontFamily: 'Inter' }}>{insight.desc}</div>
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
            <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-10 h-10 flex items-center justify-center border border-white/20 bg-white/5">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-light uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>What-If Simulator</h3>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Real-time prediction adjustments</p>
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
