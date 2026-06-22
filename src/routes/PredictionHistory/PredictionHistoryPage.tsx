import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { History, Trash2, Download, TrendingUp, Clock, BarChart3, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { usePredictionStore } from '@/store/predictionStore';
import { format } from 'date-fns';
import PageTransition from '@/components/animations/PageTransition';
import Waves from '@/components/animations/Waves';

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 border-b border-white/20 pb-8 gap-6">
            <div>
              <div className="text-[10px] tracking-widest text-gray-500 mb-2 uppercase" style={{ fontFamily: 'JetBrains Mono' }}>
                // Operation: Archive
              </div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl font-light uppercase tracking-widest flex items-center gap-4"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <div className="w-12 h-12 flex items-center justify-center border border-white/20 bg-white/5">
                  <History className="w-6 h-6 text-white" />
                </div>
                History
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-[10px] uppercase tracking-widest mt-4" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
                {history.length} predictions saved · stored locally
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="flex items-center gap-3">
              <button onClick={exportJSON} className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>
                <Download className="w-3.5 h-3.5" /> JSON
              </button>
              <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
              {history.length > 0 && (
                <button onClick={clearHistory} className="flex items-center gap-2 px-4 py-2 border border-white/50 bg-white text-black text-[10px] uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors"
                  style={{ fontFamily: 'JetBrains Mono' }}>
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </motion.div>
          </div>

          {history.length === 0 ? (
            <div className="border border-white/20 bg-black/60 p-20 text-center relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <History className="w-12 h-12 mx-auto mb-6 opacity-20 relative z-10" />
              <h3 className="text-xl font-light uppercase tracking-widest mb-4 relative z-10" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>No Archive Data</h3>
              <p className="text-[10px] uppercase tracking-widest relative z-10" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Run predictions in the Dashboard to store history.</p>
            </div>
          ) : (
            <>
              {/* Trend Charts */}
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                <RevealSection>
                  <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                    <h3 className="text-sm font-light uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                      <TrendingUp className="w-4 h-4 text-white" /> Success Probability Trend
                    </h3>
                    <div className="h-56 relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
                              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="index" stroke="#888888" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                          <YAxis stroke="#888888" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }} />
                          <Area type="step" dataKey="probability" stroke="#FFFFFF" fill="url(#probGrad)" strokeWidth={1} name="Probability %" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </RevealSection>

                <RevealSection delay={0.1}>
                  <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                    <h3 className="text-sm font-light uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                      <BarChart3 className="w-4 h-4 text-white" /> Confidence Trend
                    </h3>
                    <div className="h-56 relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="index" stroke="#888888" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                          <YAxis stroke="#888888" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }} />
                          <Line type="step" dataKey="confidence" stroke="#FFFFFF" strokeWidth={1} dot={{ fill: '#FFFFFF', r: 2 }} name="Confidence %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </RevealSection>
              </div>

              {/* Timeline */}
              <RevealSection>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 flex items-center justify-center border border-white/20 bg-white/5">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-light uppercase tracking-widest" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                    Prediction Archive
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {history.map((h, i) => (
                    <motion.div
                      key={h.timestamp}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.5) }}
                      className="border border-white/20 bg-black/40 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-white/5 transition-colors group relative"
                    >
                      <div className="w-14 h-14 border border-white/20 flex items-center justify-center flex-shrink-0" style={{
                        background: h.isSuccess ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                      }}>
                        <span className="text-lg font-light" style={{ fontFamily: 'JetBrains Mono', color: h.isSuccess ? '#FFFFFF' : '#888888' }}>
                          {Math.round(h.successProbability * 100)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold px-2 py-1 border" style={{ 
                            color: h.isSuccess ? '#000000' : '#888888', 
                            background: h.isSuccess ? '#FFFFFF' : 'transparent',
                            borderColor: h.isSuccess ? '#FFFFFF' : '#555555',
                            fontFamily: 'JetBrains Mono' 
                          }}>
                            {h.isSuccess ? 'TARGET ACQUIRED' : 'AT RISK'}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest" style={{ color: '#666666', fontFamily: 'JetBrains Mono' }}>
                            {format(new Date(h.timestamp), 'MMM dd, HH:mm:ss')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
                          <span>coding:{h.inputs.hours_coding}h</span>
                          <span>sleep:{h.inputs.sleep_hours}h</span>
                          <span>dist:{h.inputs.distractions}</span>
                          <span>load:{h.inputs.cognitive_load}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest border-l border-white/10 pl-6" style={{ fontFamily: 'JetBrains Mono' }}>
                        <div className="text-center"><div style={{ color: '#FFFFFF' }}>{Math.round(h.confidenceScore * 100)}%</div><div style={{ color: '#666666' }}>conf</div></div>
                        <div className="text-center"><div style={{ color: '#FFFFFF' }}>{h.productivityScore}</div><div style={{ color: '#666666' }}>prod</div></div>
                        <div className="text-center"><div style={{ color: h.burnoutRisk > 50 ? '#FFFFFF' : '#666666' }}>{h.burnoutRisk}%</div><div style={{ color: '#666666' }}>burn</div></div>
                      </div>

                      <button
                        onClick={() => removeFromHistory(h.timestamp)}
                        className="p-2 border border-transparent group-hover:border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:bg-white/10 absolute right-4 top-4 sm:relative sm:top-0 sm:right-0"
                        style={{ color: '#888888' }}
                      >
                        <X className="w-4 h-4" />
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
