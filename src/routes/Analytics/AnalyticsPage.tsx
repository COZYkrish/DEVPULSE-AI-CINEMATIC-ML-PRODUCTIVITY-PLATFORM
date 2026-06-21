import { useMemo, Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, TrendingUp, Layers, PieChart, Brain, Moon, Code2, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
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
    <div className="bg-black/90 p-3 text-xs shadow-xl backdrop-blur-md" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
      <p style={{ color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, textTransform: 'uppercase' }}>{label}</p>
      <div className="w-full h-px bg-white/20 my-2" />
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color || '#FFFFFF', fontFamily: 'JetBrains Mono, monospace' }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  );
}

/* ============================================ */
/* Section Header                                */
/* ============================================ */
function SectionHeader({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>; title: string; description: string; }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 border border-white/20 bg-white/5">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-bold uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>{title}</h3>
        <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono, monospace' }}>{description}</p>
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
      { label: 'Success', value: 285, fill: '#FFFFFF' },
      { label: 'Failure', value: 216, fill: '#555555' },
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
    axis: '#888888',
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    accent: '#555555',
    success: '#FFFFFF',
    danger: '#333333',
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden bg-black text-white">
        <div className="vignette-overlay" />
        <div className="noise-overlay" />
        <div className="film-lines" />
        <div className="container relative z-10">
          
          {/* Hero */}
          <div className="relative h-64 overflow-hidden mb-12 border border-white/20 bg-black">
            <Suspense fallback={null}>
              <SceneContainer isFixedScroll={false} />
            </Suspense>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl font-light mb-2 uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                  Data Observatory
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-xs uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono, monospace' }}>
                  Explore the patterns hidden within 501 developer productivity records
                </motion.p>
              </div>
            </div>
            <div className="scan-line" />
          </div>

          {/* Dataset Overview Stats */}
          <RevealSection className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/20 border border-white/20">
              {[
                { label: 'Total Records', value: '501' },
                { label: 'Features', value: '8' },
                { label: 'Success Rate', value: '56.9%' },
                { label: 'Binary Target', value: 'task_success' },
              ].map((s) => (
                <div key={s.label} className="bg-black p-6 text-center hover:bg-white/5 transition-colors">
                  <div className="text-2xl font-light mb-2" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#FFFFFF' }}>{s.value}</div>
                  <div className="text-[10px] tracking-widest uppercase" style={{ color: '#888888', fontFamily: 'JetBrains Mono, monospace' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* Feature Importance */}
          <RevealSection className="mb-12">
            <div className="p-6 border border-white/20 bg-black/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <SectionHeader icon={BarChart3} title="Feature Importance" description="Relative importance of each feature in predicting task success" />
              <div className="h-80 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.featureStats} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="1 4" stroke={chartColors.grid} horizontal={false} />
                    <XAxis type="number" stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0, 0.25]} />
                    <YAxis type="category" dataKey="feature" stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="importance" maxBarSize={20}>
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
              <div className="p-6 h-full border border-white/20 bg-black/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <SectionHeader icon={Layers} title="Feature Correlation" description="How each feature correlates with task success" />
                <div className="h-72 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.correlations} margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="1 4" stroke={chartColors.grid} />
                      <XAxis dataKey="f1" stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} angle={-30} textAnchor="end" height={60} />
                      <YAxis stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[-0.4, 0.6]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" maxBarSize={24}>
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
              <div className="p-6 h-full border border-white/20 bg-black/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <SectionHeader icon={PieChart} title="Success Distribution" description="Overall task success vs failure in the dataset" />
                <div className="flex items-center justify-center h-72 relative z-10">
                  <div className="flex flex-col sm:flex-row items-center gap-12">
                    {data.successDist.map((d) => (
                      <div key={d.label} className="text-center">
                        <div className="w-28 h-28 flex items-center justify-center mb-3" style={{
                          background: `conic-gradient(${d.fill} ${(d.value / 501) * 360}deg, rgba(255,255,255,0.05) 0deg)`,
                        }}>
                          <div className="w-24 h-24 flex items-center justify-center bg-black border border-white/10">
                            <span className="text-xl font-light" style={{ fontFamily: 'JetBrains Mono, monospace', color: d.fill }}>{d.value}</span>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest" style={{ color: d.fill, fontFamily: 'JetBrains Mono, monospace' }}>{d.label}</span>
                        <p className="text-[10px] mt-0.5" style={{ color: '#666666', fontFamily: 'JetBrains Mono, monospace' }}>{((d.value / 501) * 100).toFixed(1)}%</p>
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
              <div className="p-6 h-full border border-white/20 bg-black/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <SectionHeader icon={Moon} title="Sleep Impact Analysis" description="How sleep hours affect task success probability" />
                <div className="h-72 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.sleepImpact}>
                      <defs>
                        <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="1 4" stroke={chartColors.grid} />
                      <XAxis dataKey="sleep" stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <YAxis stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="step" dataKey="success" stroke="#FFFFFF" fill="url(#sleepGrad)" strokeWidth={1} name="Success %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <div className="p-6 h-full border border-white/20 bg-black/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <SectionHeader icon={Code2} title="Coding Hours Analysis" description="Optimal coding hours for maximum productivity" />
                <div className="h-72 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.codingImpact}>
                      <CartesianGrid strokeDasharray="1 4" stroke={chartColors.grid} />
                      <XAxis dataKey="hours" stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <YAxis stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="success" fill="#FFFFFF" maxBarSize={30} name="Success %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </RevealSection>
          </div>

          {/* AI Usage Analysis */}
          <RevealSection className="mb-12">
            <div className="p-6 border border-white/20 bg-black/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <SectionHeader icon={Brain} title="AI Usage Analysis" description="Impact of AI tool usage on developer success rates" />
              <div className="h-72 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.aiUsageImpact}>
                    <defs>
                      <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="1 4" stroke={chartColors.grid} />
                    <XAxis dataKey="hours" stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <YAxis stroke={chartColors.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="linear" dataKey="rate" stroke="#FFFFFF" fill="url(#aiGrad)" strokeWidth={1} name="Success Rate" />
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
