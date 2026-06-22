import { useMemo, Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Crown, Target, Shield, Crosshair, BarChart3 } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/90 p-3 text-[10px] shadow-xl backdrop-blur-md uppercase tracking-widest" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
      <p style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{label}</p>
      <div className="w-full h-px bg-white/20 my-2" />
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color || '#AAAAAA', fontFamily: 'JetBrains Mono, monospace' }}>
          {entry.name}: {typeof entry.value === 'number' ? (entry.value * 100).toFixed(1) + '%' : entry.value}
        </p>
      ))}
    </div>
  );
}

const models = [
  {
    name: 'XGBoost',
    accuracy: 0.92,
    precision: 0.91,
    recall: 0.93,
    f1: 0.92,
    rocAuc: 0.96,
    isBest: true,
    color: '#FFFFFF',
    description: 'Gradient boosted trees with regularization. Top performer on this dataset.',
    icon: Crown,
  },
  {
    name: 'Random Forest',
    accuracy: 0.89,
    precision: 0.88,
    recall: 0.91,
    f1: 0.89,
    rocAuc: 0.94,
    isBest: false,
    color: '#CCCCCC',
    description: 'Ensemble of decision trees with bagging. Strong generalization.',
    icon: Shield,
  },
  {
    name: 'Decision Tree',
    accuracy: 0.82,
    precision: 0.81,
    recall: 0.84,
    f1: 0.82,
    rocAuc: 0.82,
    isBest: false,
    color: '#999999',
    description: 'Single tree classifier. Highly interpretable but lower accuracy.',
    icon: Target,
  },
  {
    name: 'Logistic Regression',
    accuracy: 0.78,
    precision: 0.77,
    recall: 0.80,
    f1: 0.78,
    rocAuc: 0.85,
    isBest: false,
    color: '#666666',
    description: 'Linear baseline model. Fast inference, interpretable coefficients.',
    icon: Crosshair,
  },
];

export default function ModelArenaPage() {
  const radarData = useMemo(() => {
    const metrics = ['accuracy', 'precision', 'recall', 'f1', 'rocAuc'] as const;
    return metrics.map((m) => ({
      metric: m === 'rocAuc' ? 'ROC-AUC' : m.charAt(0).toUpperCase() + m.slice(1),
      ...Object.fromEntries(models.map((model) => [model.name, model[m]])),
    }));
  }, []);

  const comparisonData = useMemo(() => {
    return models.map((m) => ({
      name: m.name,
      accuracy: m.accuracy,
      f1: m.f1,
      rocAuc: m.rocAuc,
      color: m.color,
    }));
  }, []);

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
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-14 h-14 border border-white/20 bg-white/5 mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl font-light uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Model Arena
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-[10px] mt-4 uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
                  Four models compete. One emerges as champion.
                </motion.p>
              </div>
            </div>
            <div className="scan-line" />
          </div>

          {/* Model Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {models.map((model, i) => {
              const Icon = model.icon;
              return (
                <RevealSection key={model.name} delay={i * 0.1}>
                  <div className="border border-white/20 bg-black/60 p-6 hover:bg-white/5 transition-colors relative overflow-hidden group">
                    <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                    {model.isBest && (
                      <div className="absolute top-4 right-4">
                        <span className="text-[10px] font-bold px-2 py-1 border border-white bg-white text-black uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>
                          CHAMPION
                        </span>
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="w-10 h-10 flex items-center justify-center border border-white/20 bg-white/5 mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                        <Icon className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                      </div>
                      <h3 className="text-lg font-light uppercase tracking-widest mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{model.name}</h3>
                      <p className="text-[10px] mb-6 leading-relaxed" style={{ color: '#AAAAAA', fontFamily: 'Inter' }}>{model.description}</p>

                      <div className="space-y-3">
                        {(['accuracy', 'precision', 'recall', 'f1', 'rocAuc'] as const).map((metric) => (
                          <div key={metric} className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
                              {metric === 'rocAuc' ? 'ROC-AUC' : metric.charAt(0).toUpperCase() + metric.slice(1)}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-px bg-white/10 relative">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${model[metric] * 100}%` }}
                                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                  className="absolute top-0 left-0 bottom-0 bg-white"
                                />
                              </div>
                              <span className="text-[10px] font-bold w-10 text-right" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#FFFFFF' }}>
                                {(model[metric] * 100).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>

          {/* Radar + Bar Comparison */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <RevealSection>
              <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden h-full">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <h3 className="text-xl font-light uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <BarChart3 className="w-5 h-5 text-white" /> Performance Radar
                </h3>
                <div className="h-80 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.2)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#888888', fontFamily: 'JetBrains Mono' }} />
                      <PolarRadiusAxis tick={{ fontSize: 10, fill: '#555555' }} domain={[0.6, 1]} />
                      {models.map((m) => (
                        <Radar key={m.name} name={m.name} dataKey={m.name} stroke={m.color} fill={m.color} fillOpacity={m.isBest ? 0.3 : 0.1} strokeWidth={m.isBest ? 2 : 1} />
                      ))}
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden h-full">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <h3 className="text-xl font-light uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <Trophy className="w-5 h-5 text-white" /> Leaderboard
                </h3>
                <div className="h-80 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#888888" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <YAxis stroke="#888888" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0.6, 1]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="accuracy" name="Accuracy" maxBarSize={30}>
                        {comparisonData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
