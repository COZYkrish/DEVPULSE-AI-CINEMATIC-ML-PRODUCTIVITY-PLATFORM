import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { History, Trash2, Download, TrendingUp, Clock, BarChart3, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { usePredictionStore } from '@/store/predictionStore';
import { format } from 'date-fns';
import PageTransition from '@/components/animations/PageTransition';

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function PredictionHistoryPage() {
  const { history, clearHistory, removeFromHistory } = usePredictionStore((s) => s);

  const trendData = useMemo(() => {
    return [...history].reverse().map((h, i) => ({
      index: i + 1,
      probability: Math.round(h.successProbability * 100),
      confidence: Math.round(h.confidenceScore * 100),
      productivity: h.productivityScore,
      burnout: h.burnoutRisk,
      time: format(new Date(h.timestamp), 'HH:mm'),
    }));
  }, [history]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'devpulse_predictions.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['timestamp', 'success_probability', 'confidence', 'productivity', 'burnout_risk', 'is_success',
      'hours_coding', 'coffee_intake_mg', 'distractions', 'sleep_hours', 'commits', 'bugs_reported', 'ai_usage_hours', 'cognitive_load'];
    const rows = history.map((h) => [
      new Date(h.timestamp).toISOString(), h.successProbability.toFixed(4), h.confidenceScore.toFixed(4),
      h.productivityScore, h.burnoutRisk, h.isSuccess ? 1 : 0,
      h.inputs.hours_coding, h.inputs.coffee_intake_mg, h.inputs.distractions, h.inputs.sleep_hours,
      h.inputs.commits, h.inputs.bugs_reported, h.inputs.ai_usage_hours, h.inputs.cognitive_load,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'devpulse_predictions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-bold flex items-center gap-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                <History className="w-8 h-8" style={{ color: '#00E5FF' }} />
                Prediction History
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-sm mt-2" style={{ color: '#94A3B8' }}>
                {history.length} predictions saved · stored locally
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="flex items-center gap-2">
              <button onClick={exportJSON} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Download className="w-3.5 h-3.5" /> JSON
              </button>
              <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
              {history.length > 0 && (
                <button onClick={clearHistory} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </motion.div>
          </div>

          {history.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <History className="w-12 h-12 mx-auto mb-4" style={{ color: '#64748B' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#94A3B8', fontFamily: 'Space Grotesk' }}>No predictions yet</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>Run predictions in the Dashboard and save them to see trends here.</p>
            </div>
          ) : (
            <>
              {/* Trend Charts */}
              <div className="grid lg:grid-cols-2 gap-6 mb-10">
                <RevealSection>
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#94A3B8', fontFamily: 'Space Grotesk' }}>
                      <TrendingUp className="w-4 h-4" style={{ color: '#00E5FF' }} /> Success Probability Trend
                    </h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#00E5FF" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="index" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                          <YAxis stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                          <Area type="monotone" dataKey="probability" stroke="#00E5FF" fill="url(#probGrad)" strokeWidth={2} name="Probability %" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </RevealSection>

                <RevealSection delay={0.1}>
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#94A3B8', fontFamily: 'Space Grotesk' }}>
                      <BarChart3 className="w-4 h-4" style={{ color: '#7C3AED' }} /> Confidence Trend
                    </h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="index" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                          <YAxis stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                          <Line type="monotone" dataKey="confidence" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', r: 3 }} name="Confidence %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </RevealSection>
              </div>

              {/* Timeline */}
              <RevealSection>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#94A3B8', fontFamily: 'Space Grotesk' }}>
                  <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} /> Prediction Archive
                </h3>
                <div className="space-y-3">
                  {history.map((h, i) => (
                    <motion.div
                      key={h.timestamp}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.5) }}
                      className="glass rounded-xl p-4 flex items-center gap-4 card-hover group"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                        background: h.isSuccess ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      }}>
                        <span className="text-sm font-bold" style={{ fontFamily: 'JetBrains Mono', color: h.isSuccess ? '#10B981' : '#EF4444' }}>
                          {Math.round(h.successProbability * 100)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold" style={{ color: h.isSuccess ? '#10B981' : '#EF4444' }}>
                            {h.isSuccess ? 'SUCCESS' : 'AT RISK'}
                          </span>
                          <span className="text-[10px]" style={{ color: '#64748B', fontFamily: 'JetBrains Mono' }}>
                            {format(new Date(h.timestamp), 'MMM dd, HH:mm:ss')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]" style={{ color: '#64748B', fontFamily: 'JetBrains Mono' }}>
                          <span>coding:{h.inputs.hours_coding}h</span>
                          <span>sleep:{h.inputs.sleep_hours}h</span>
                          <span>dist:{h.inputs.distractions}</span>
                          <span>load:{h.inputs.cognitive_load}</span>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-3 text-[10px]" style={{ fontFamily: 'JetBrains Mono' }}>
                        <div className="text-center"><div style={{ color: '#22D3EE' }}>{Math.round(h.confidenceScore * 100)}%</div><div style={{ color: '#64748B' }}>conf</div></div>
                        <div className="text-center"><div style={{ color: '#10B981' }}>{h.productivityScore}</div><div style={{ color: '#64748B' }}>prod</div></div>
                        <div className="text-center"><div style={{ color: h.burnoutRisk > 50 ? '#EF4444' : '#F59E0B' }}>{h.burnoutRisk}%</div><div style={{ color: '#64748B' }}>burn</div></div>
                      </div>

                      <button
                        onClick={() => removeFromHistory(h.timestamp)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: '#64748B' }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </RevealSection>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
