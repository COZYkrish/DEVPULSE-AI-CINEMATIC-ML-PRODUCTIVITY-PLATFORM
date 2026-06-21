import { useMemo, Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Crown, Target, Shield, Crosshair, BarChart3 } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LineChart, Line } from 'recharts';
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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 text-xs shadow-xl" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <p style={{ color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color || '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
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
    color: '#00E5FF',
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
    color: '#10B981',
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
    color: '#F59E0B',
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
    color: '#7C3AED',
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
      <div className="min-h-screen pt-24 pb-32 overflow-hidden">
        <div className="container">
          {/* Hero */}
          <div className="relative h-52 rounded-3xl overflow-hidden mb-12" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <Suspense fallback={null}>
              <SceneContainer variant="minimal" />
            </Suspense>
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse, rgba(5,8,22,0.5), rgba(5,8,22,0.9))' }}>
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(0,229,255,0.2)' }}>
                  <Trophy className="w-7 h-7" style={{ color: '#00E5FF' }} />
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                  Model Arena
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-sm mt-2" style={{ color: '#94A3B8' }}>
                  Four models compete. One emerges as champion.
                </motion.p>
              </div>
            </div>
          </div>

          {/* Model Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {models.map((model, i) => {
              const Icon = model.icon;
              return (
                <RevealSection key={model.name} delay={i * 0.1}>
                  <div className={`glass rounded-2xl p-5 card-hover relative overflow-hidden ${model.isBest ? 'glow-primary' : ''}`}>
                    {model.isBest && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,229,255,0.15)', color: '#00E5FF', fontFamily: 'JetBrains Mono' }}>
                          CHAMPION
                        </span>
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${model.color}15`, border: `1px solid ${model.color}25` }}>
                      <Icon className="w-5 h-5" style={{ color: model.color }} />
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>{model.name}</h3>
                    <p className="text-[11px] mb-4 leading-relaxed" style={{ color: '#64748B' }}>{model.description}</p>

                    <div className="space-y-2">
                      {(['accuracy', 'precision', 'recall', 'f1', 'rocAuc'] as const).map((metric) => (
                        <div key={metric} className="flex items-center justify-between">
                          <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                            {metric === 'rocAuc' ? 'ROC-AUC' : metric.charAt(0).toUpperCase() + metric.slice(1)}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${model[metric] * 100}%` }}
                                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                className="h-full rounded-full"
                                style={{ background: model.color }}
                              />
                            </div>
                            <span className="text-[10px] font-bold w-10 text-right" style={{ fontFamily: 'JetBrains Mono, monospace', color: model.color }}>
                              {(model[metric] * 100).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>

          {/* Radar + Bar Comparison */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <RevealSection>
              <div className="glass rounded-2xl p-6 h-full">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                  <BarChart3 className="w-5 h-5" style={{ color: '#00E5FF' }} /> Performance Radar
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Inter' }} />
                      <PolarRadiusAxis tick={{ fontSize: 10, fill: '#64748B' }} domain={[0.6, 1]} />
                      {models.map((m) => (
                        <Radar key={m.name} name={m.name} dataKey={m.name} stroke={m.color} fill={m.color} fillOpacity={m.isBest ? 0.15 : 0.05} strokeWidth={m.isBest ? 2 : 1} />
                      ))}
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <div className="glass rounded-2xl p-6 h-full">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                  <Trophy className="w-5 h-5" style={{ color: '#F59E0B' }} /> Leaderboard
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'Inter' }} />
                      <YAxis stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[0.6, 1]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="accuracy" name="Accuracy" radius={[4, 4, 0, 0]} maxBarSize={30}>
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
