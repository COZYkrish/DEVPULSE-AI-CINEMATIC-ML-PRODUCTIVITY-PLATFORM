import { useState, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FlaskConical, Focus, AlertTriangle, Moon, Code2, Brain, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { predict } from '@/lib/onnx/onnxEngine';
import { computeBurnoutRisk } from '@/lib/ml/predictionUtils';
import type { PredictionInput } from '@/lib/constants';
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

function ScoreGauge({ value, max = 100, label, color, size = 120 }: {
  value: number; max?: number; label: string; color: string; size?: number;
}) {
  const pct = Math.min(value / max, 1);
  const radius = (size - 8) / 2;
  const circ = radius * 2 * Math.PI;
  
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={6} fill="none" />
        <motion.circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round"
          initial={{ strokeDashoffset: circ } as any} animate={{ strokeDashoffset: circ - pct * circ } as any}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} strokeDasharray={circ}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono', color }}>{Math.round(value)}</span>
        <span className="text-[9px]" style={{ color: '#64748B' }}>{label}</span>
      </div>
    </div>
  );
}

/* Lab Tool Card */
function LabTool({ icon: Icon, title, description, color, children }: {
  icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>; title: string; description: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6 card-hover h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon className="w-5 h-5" style={{ color: color }} />
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>{title}</h3>
          <p className="text-[11px]" style={{ color: '#94A3B8' }}>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SimpleSlider({ label, value, onChange, min, max, step, color = '#00E5FF' }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs w-28 flex-shrink-0" style={{ color: '#94A3B8' }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }} />
      <span className="text-xs w-10 text-right font-bold" style={{ fontFamily: 'JetBrains Mono', color: '#F1F5F9' }}>
        {Number.isInteger(step) ? value : value.toFixed(1)}
      </span>
    </div>
  );
}

export default function DeveloperLabPage() {
  // Focus Score
  const [focusDistractions, setFocusDistractions] = useState(3);
  const [focusCogLoad, setFocusCogLoad] = useState(4);
  const focusScore = Math.max(0, Math.round(100 - focusDistractions * 10 - focusCogLoad * 5));

  // Burnout
  const [burnoutInputs, setBurnoutInputs] = useState<PredictionInput>({
    hours_coding: 8, coffee_intake_mg: 500, distractions: 5, sleep_hours: 5,
    commits: 8, bugs_reported: 3, ai_usage_hours: 1, cognitive_load: 7,
  });
  const burnoutRisk = computeBurnoutRisk(burnoutInputs);

  // Sleep
  const [sleepHours, setSleepHours] = useState(7);
  const sleepScore = sleepHours >= 7 && sleepHours <= 9 ? 95 : sleepHours >= 6 ? 70 : sleepHours >= 5 ? 45 : 20;

  // Coding Efficiency
  const [codingHours, setCodingHours] = useState(6);
  const [codingCommits, setCodingCommits] = useState(5);
  const efficiency = Math.min(100, Math.round((codingCommits / Math.max(codingHours, 0.1)) * 20));

  // AI Analyzer
  const [aiHours, setAiHours] = useState(2);
  const [aiCodingHours, setAiCodingHours] = useState(6);
  const aiMultiplier = aiHours > 0 ? (1 + aiHours * 0.15).toFixed(2) : '1.00';

  // Habit Simulator
  const [habitInputs, setHabitInputs] = useState<PredictionInput>({
    hours_coding: 5, coffee_intake_mg: 300, distractions: 2, sleep_hours: 8,
    commits: 5, bugs_reported: 0, ai_usage_hours: 2, cognitive_load: 3,
  });
  const [habitResult, setHabitResult] = useState<number | null>(null);
  const runHabit = useCallback(async () => {
    const { probability } = await predict(habitInputs);
    setHabitResult(probability);
  }, [habitInputs]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(0,229,255,0.2))', border: '1px solid rgba(16,185,129,0.2)' }}>
              <FlaskConical className="w-7 h-7" style={{ color: '#10B981' }} />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
              Developer Lab
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-sm mt-2" style={{ color: '#94A3B8' }}>
              Personal optimization tools powered by machine learning
            </motion.p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Focus Score */}
            <RevealSection>
              <LabTool icon={Focus} title="Focus Score" description="Calculate your focus quality" color="#00E5FF">
                <div className="flex justify-center my-4 relative">
                  <ScoreGauge value={focusScore} label="FOCUS" color={focusScore > 60 ? '#10B981' : focusScore > 30 ? '#F59E0B' : '#EF4444'} />
                </div>
                <SimpleSlider label="Distractions" value={focusDistractions} onChange={setFocusDistractions} min={0} max={10} step={1} color="#EF4444" />
                <SimpleSlider label="Cognitive Load" value={focusCogLoad} onChange={setFocusCogLoad} min={0} max={10} step={0.5} color="#F59E0B" />
              </LabTool>
            </RevealSection>

            {/* Burnout Predictor */}
            <RevealSection delay={0.1}>
              <LabTool icon={AlertTriangle} title="Burnout Predictor" description="Assess your burnout risk level" color="#EF4444">
                <div className="flex justify-center my-4 relative">
                  <ScoreGauge value={burnoutRisk} label="RISK" color={burnoutRisk < 30 ? '#10B981' : burnoutRisk < 60 ? '#F59E0B' : '#EF4444'} />
                </div>
                <SimpleSlider label="Sleep" value={burnoutInputs.sleep_hours} onChange={(v) => setBurnoutInputs({...burnoutInputs, sleep_hours: v})} min={3} max={10} step={0.5} color="#7C3AED" />
                <SimpleSlider label="Cognitive Load" value={burnoutInputs.cognitive_load} onChange={(v) => setBurnoutInputs({...burnoutInputs, cognitive_load: v})} min={0} max={10} step={0.5} color="#EF4444" />
                <SimpleSlider label="Hours Coding" value={burnoutInputs.hours_coding} onChange={(v) => setBurnoutInputs({...burnoutInputs, hours_coding: v})} min={0} max={12} step={0.5} color="#00E5FF" />
              </LabTool>
            </RevealSection>

            {/* Sleep Optimizer */}
            <RevealSection delay={0.2}>
              <LabTool icon={Moon} title="Sleep Optimizer" description="Find your optimal sleep hours" color="#7C3AED">
                <div className="flex justify-center my-4 relative">
                  <ScoreGauge value={sleepScore} label="QUALITY" color={sleepScore > 70 ? '#10B981' : sleepScore > 40 ? '#F59E0B' : '#EF4444'} />
                </div>
                <SimpleSlider label="Sleep Hours" value={sleepHours} onChange={setSleepHours} min={3} max={10} step={0.5} color="#7C3AED" />
                <div className="mt-3 p-2 rounded-lg text-[10px]" style={{ background: 'rgba(255,255,255,0.03)', color: '#94A3B8' }}>
                  {sleepHours >= 7 && sleepHours <= 8 ? '✅ Optimal sleep range for peak cognitive performance.' :
                   sleepHours < 6 ? '⚠️ Critical: Less than 6 hours significantly impairs decision-making.' :
                   sleepHours > 9 ? '💡 Oversleeping may indicate other health concerns.' :
                   '💡 Try to aim for 7-8 hours for best results.'}
                </div>
              </LabTool>
            </RevealSection>

            {/* Coding Efficiency */}
            <RevealSection delay={0.3}>
              <LabTool icon={Code2} title="Coding Efficiency" description="Commits per hour of coding" color="#10B981">
                <div className="flex justify-center my-4 relative">
                  <ScoreGauge value={efficiency} label="EFFICIENCY" color={efficiency > 60 ? '#10B981' : efficiency > 30 ? '#F59E0B' : '#EF4444'} />
                </div>
                <SimpleSlider label="Hours Coding" value={codingHours} onChange={setCodingHours} min={0} max={12} step={0.5} color="#00E5FF" />
                <SimpleSlider label="Commits" value={codingCommits} onChange={setCodingCommits} min={0} max={15} step={1} color="#10B981" />
              </LabTool>
            </RevealSection>

            {/* AI Usage Analyzer */}
            <RevealSection delay={0.4}>
              <LabTool icon={Sparkles} title="AI Usage Analyzer" description="Measure your AI multiplier effect" color="#22D3EE">
                <div className="text-center my-4">
                  <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'JetBrains Mono', color: '#22D3EE' }}>{aiMultiplier}x</div>
                  <div className="text-xs" style={{ color: '#64748B' }}>Productivity Multiplier</div>
                </div>
                <SimpleSlider label="AI Hours" value={aiHours} onChange={setAiHours} min={0} max={8} step={0.5} color="#22D3EE" />
                <SimpleSlider label="Coding Hours" value={aiCodingHours} onChange={setAiCodingHours} min={0} max={12} step={0.5} color="#00E5FF" />
              </LabTool>
            </RevealSection>

            {/* Habit Impact Simulator */}
            <RevealSection delay={0.5}>
              <LabTool icon={TrendingUp} title="Habit Simulator" description="Simulate ideal work habits" color="#F59E0B">
                <div className="text-center my-4">
                  {habitResult !== null ? (
                    <>
                      <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'JetBrains Mono', color: habitResult >= 0.7 ? '#10B981' : habitResult >= 0.4 ? '#F59E0B' : '#EF4444' }}>
                        {(habitResult * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs" style={{ color: '#64748B' }}>Success Probability</div>
                    </>
                  ) : (
                    <button onClick={runHabit} className="px-4 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', color: '#050816' }}>
                      <Zap className="w-3.5 h-3.5 inline mr-1" /> Run Simulation
                    </button>
                  )}
                </div>
                <SimpleSlider label="Sleep" value={habitInputs.sleep_hours} onChange={(v) => { setHabitInputs({...habitInputs, sleep_hours: v}); setHabitResult(null); }} min={3} max={10} step={0.5} color="#7C3AED" />
                <SimpleSlider label="Distractions" value={habitInputs.distractions} onChange={(v) => { setHabitInputs({...habitInputs, distractions: v}); setHabitResult(null); }} min={0} max={10} step={1} color="#EF4444" />
                {habitResult === null && (
                  <button onClick={runHabit} className="w-full mt-3 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: 'rgba(249,168,11,0.15)', color: '#F59E0B', border: '1px solid rgba(249,168,11,0.2)' }}>
                    Predict
                  </button>
                )}
              </LabTool>
            </RevealSection>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
