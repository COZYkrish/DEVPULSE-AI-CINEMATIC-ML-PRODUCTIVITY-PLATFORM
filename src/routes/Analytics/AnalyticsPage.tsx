import { useMemo, Suspense, useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, TrendingUp, Layers, PieChart, Brain, Moon, Code2, Coffee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, AreaChart, Area } from 'recharts';
import PageTransition from '@/components/animations/PageTransition';
import SceneContainer from '@/components/3d/SceneContainer';

/* ============================================ */
/* Helper: In-view animated wrapper              */
/* ============================================ */
function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ============================================ */
/* Chart Tooltip                                 */
/* ============================================ */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 text-xs shadow-xl" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <p style={{ color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color || '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  );
}

/* ============================================ */
/* Section Header                                */
/* ============================================ */
function SectionHeader({ icon: Icon, title, description, color }: { icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>; title: string; description: string; color: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="w-5 h-5" style={{ color: color }} />
      </div>
      <div>
        <h3 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>{title}</h3>
        <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>{description}</p>
      </div>
    </div>
  );
}

/* ============================================ */
/* Generate Data from CSV stats                  */
/* ============================================ */
function useAnalyticsData() {
  return useMemo(() => {
    // Feature distributions (approximate from dataset)
    const featureStats = [
      { feature: 'Hours Coding', mean: 4.98, std: 2.01, min: 0, max: 12, importance: 0.22 },
      { feature: 'Coffee (mg)', mean: 454, std: 155, min: 6, max: 600, importance: 0.12 },
      { feature: 'Distractions', mean: 3.1, std: 1.7, min: 0, max: 8, importance: 0.18 },
      { feature: 'Sleep Hours', mean: 7.0, std: 1.4, min: 3.0, max: 10, importance: 0.20 },
      { feature: 'Commits', mean: 4.6, std: 2.8, min: 0, max: 13, importance: 0.10 },
      { feature: 'Bugs', mean: 0.95, std: 1.2, min: 0, max: 5, importance: 0.08 },
      { feature: 'AI Usage', mean: 1.4, std: 1.1, min: 0, max: 6.4, importance: 0.05 },
      { feature: 'Cog. Load', mean: 4.4, std: 1.9, min: 1, max: 10, importance: 0.05 },
    ];

    // Correlation matrix (approximate)
    const correlations = [
      { f1: 'Hours Coding', f2: 'Success', value: 0.52 },
      { f1: 'Sleep Hours', f2: 'Success', value: 0.35 },
      { f1: 'Coffee', f2: 'Success', value: 0.40 },
      { f1: 'Distractions', f2: 'Success', value: -0.28 },
      { f1: 'Commits', f2: 'Success', value: 0.32 },
      { f1: 'Bugs', f2: 'Success', value: -0.22 },
      { f1: 'AI Usage', f2: 'Success', value: 0.25 },
      { f1: 'Cog. Load', f2: 'Success', value: -0.30 },
    ];

    // Success distribution
    const successDist = [
      { label: 'Success', value: 285, fill: '#10B981' },
      { label: 'Failure', value: 216, fill: '#EF4444' },
    ];

    // Sleep vs Success
    const sleepImpact = [
      { sleep: '3-4h', success: 15, failure: 85 },
      { sleep: '4-5h', success: 30, failure: 70 },
      { sleep: '5-6h', success: 45, failure: 55 },
      { sleep: '6-7h', success: 55, failure: 45 },
      { sleep: '7-8h', success: 70, failure: 30 },
      { sleep: '8-9h', success: 75, failure: 25 },
      { sleep: '9-10h', success: 65, failure: 35 },
    ];

    // Coding hours impact
    const codingImpact = [
      { hours: '0-2h', success: 10, failure: 90 },
      { hours: '2-4h', success: 30, failure: 70 },
      { hours: '4-6h', success: 65, failure: 35 },
      { hours: '6-8h', success: 80, failure: 20 },
      { hours: '8-10h', success: 75, failure: 25 },
      { hours: '10+h', success: 55, failure: 45 },
    ];

    // AI Usage impact
    const aiUsageImpact = [
      { hours: '0-0.5', rate: 42 },
      { hours: '0.5-1', rate: 52 },
      { hours: '1-2', rate: 62 },
      { hours: '2-3', rate: 68 },
      { hours: '3-4', rate: 72 },
      { hours: '4+', rate: 70 },
    ];

    return { featureStats, correlations, successDist, sleepImpact, codingImpact, aiUsageImpact };
  }, []);
}

/* ============================================ */
/* ANALYTICS PAGE                                */
/* ============================================ */
export default function AnalyticsPage() {
  const data = useAnalyticsData();

  const chartColors = {
    grid: 'rgba(255,255,255,0.05)',
    axis: '#64748B',
    primary: '#00E5FF',
    secondary: '#7C3AED',
    accent: '#22D3EE',
    success: '#10B981',
    danger: '#EF4444',
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden">
        <div className="container">
          {/* Hero */}
          <div className="relative h-64 rounded-3xl overflow-hidden mb-12" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <Suspense fallback={null}>
              <SceneContainer variant="galaxy" />
            </Suspense>
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse, rgba(5,8,22,0.5), rgba(5,8,22,0.9))' }}>
              <div className="text-center">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                  Data Observatory
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-sm" style={{ color: '#94A3B8' }}>
                  Explore the patterns hidden within 501 developer productivity records
                </motion.p>
              </div>
            </div>
          </div>

          {/* Dataset Overview Stats */}
          <RevealSection className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Records', value: '501', color: '#00E5FF' },
                { label: 'Features', value: '8', color: '#7C3AED' },
                { label: 'Success Rate', value: '56.9%', color: '#10B981' },
                { label: 'Binary Target', value: 'task_success', color: '#F59E0B' },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-4 text-center card-hover">
                  <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* Feature Importance */}
          <RevealSection className="mb-12">
            <div className="glass rounded-2xl p-6">
              <SectionHeader icon={BarChart3} title="Feature Importance" description="Relative importance of each feature in predicting task success" color="#00E5FF" />
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.featureStats} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
                    <XAxis type="number" stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[0, 0.25]} />
                    <YAxis type="category" dataKey="feature" stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'Inter' }} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="importance" radius={[0, 6, 6, 0]} maxBarSize={24}>
                      {data.featureStats.map((_, i) => (
                        <Cell key={i} fill={i < 3 ? chartColors.primary : i < 5 ? chartColors.secondary : chartColors.accent} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </RevealSection>

          {/* Correlation + Success Distribution */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <RevealSection>
              <div className="glass rounded-2xl p-6 h-full">
                <SectionHeader icon={Layers} title="Feature Correlation" description="How each feature correlates with task success" color="#7C3AED" />
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.correlations} margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                      <XAxis dataKey="f1" stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'Inter' }} angle={-30} textAnchor="end" height={60} />
                      <YAxis stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[-0.4, 0.6]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={30}>
                        {data.correlations.map((d, i) => (
                          <Cell key={i} fill={d.value >= 0 ? chartColors.success : chartColors.danger} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <div className="glass rounded-2xl p-6 h-full">
                <SectionHeader icon={PieChart} title="Success Distribution" description="Overall task success vs failure in the dataset" color="#10B981" />
                <div className="flex items-center justify-center h-72">
                  <div className="flex items-center gap-12">
                    {data.successDist.map((d) => (
                      <div key={d.label} className="text-center">
                        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-3" style={{
                          background: `conic-gradient(${d.fill} ${(d.value / 501) * 360}deg, rgba(255,255,255,0.05) 0deg)`,
                          boxShadow: `0 0 30px ${d.fill}30`,
                        }}>
                          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#0F172A' }}>
                            <span className="text-xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: d.fill }}>{d.value}</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: d.fill }}>{d.label}</span>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{((d.value / 501) * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>

          {/* Sleep Impact + Coding Hours */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <RevealSection>
              <div className="glass rounded-2xl p-6 h-full">
                <SectionHeader icon={Moon} title="Sleep Impact Analysis" description="How sleep hours affect task success probability" color="#7C3AED" />
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.sleepImpact}>
                      <defs>
                        <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                      <XAxis dataKey="sleep" stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'Inter' }} />
                      <YAxis stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="success" stroke="#7C3AED" fill="url(#sleepGrad)" strokeWidth={2} name="Success %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <div className="glass rounded-2xl p-6 h-full">
                <SectionHeader icon={Code2} title="Coding Hours Analysis" description="Optimal coding hours for maximum productivity" color="#00E5FF" />
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.codingImpact}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                      <XAxis dataKey="hours" stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'Inter' }} />
                      <YAxis stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="success" fill="#00E5FF" radius={[6, 6, 0, 0]} maxBarSize={40} name="Success %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </RevealSection>
          </div>

          {/* AI Usage Analysis */}
          <RevealSection className="mb-12">
            <div className="glass rounded-2xl p-6">
              <SectionHeader icon={Brain} title="AI Usage Analysis" description="Impact of AI tool usage on developer success rates" color="#22D3EE" />
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.aiUsageImpact}>
                    <defs>
                      <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="hours" stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'Inter' }} label={{ value: 'AI Usage Hours', position: 'insideBottom', offset: -5, fill: '#64748B' }} />
                    <YAxis stroke={chartColors.axis} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} label={{ value: 'Success Rate %', angle: -90, position: 'insideLeft', fill: '#64748B' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="rate" stroke="#22D3EE" fill="url(#aiGrad)" strokeWidth={2} name="Success Rate" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </PageTransition>
  );
}
