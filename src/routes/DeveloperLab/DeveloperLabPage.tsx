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
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={2} fill="none" />
        <motion.circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={2} fill="none"
          initial={{ strokeDashoffset: circ } as any} animate={{ strokeDashoffset: circ - pct * circ } as any}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} strokeDasharray={circ}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-light" style={{ fontFamily: 'JetBrains Mono', color }}>{Math.round(value)}</span>
        <span className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>{label}</span>
      </div>
    </div>
  );
}

/* Lab Tool Card */
function LabTool({ icon: Icon, title, description, color, children }: {
  icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>; title: string; description: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="border border-white/20 bg-black/60 p-6 hover:bg-white/5 transition-colors h-full group relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-10 h-10 flex items-center justify-center border border-white/20 bg-white/5 group-hover:bg-white transition-colors">
          <Icon className="w-5 h-5 text-white group-hover:text-black transition-colors" />
        </div>
        <div>
          <h3 className="text-lg font-light uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>{title}</h3>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>{description}</p>
        </div>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function SimpleSlider({ label, value, onChange, min, max, step, color = '#FFFFFF' }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-[10px] uppercase tracking-widest w-28 flex-shrink-0" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-px appearance-none cursor-pointer bg-white/10"
        style={{ backgroundImage: `linear-gradient(to right, ${color} ${pct}%, transparent ${pct}%)` }} />
      <span className="text-[10px] w-10 text-right font-bold" style={{ fontFamily: 'JetBrains Mono', color: '#FFFFFF' }}>
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

  const monochromeScale = (val: number, reverse = false) => {
    const target = reverse ? 100 - val : val;
    return target > 70 ? '#FFFFFF' : target > 40 ? '#AAAAAA' : '#555555';
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden bg-black text-white">
        <div className="vignette-overlay" />
        <div className="noise-overlay" />
        <div className="film-lines" />
        
        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center mb-12 border-b border-white/20 pb-8">
            <div className="text-[10px] tracking-widest text-gray-500 mb-2 uppercase" style={{ fontFamily: 'JetBrains Mono' }}>
              // Subsystem: Experimental
            </div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-light uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Developer Lab
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-[10px] uppercase tracking-widest mt-4" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
              Personal optimization tools powered by machine learning
            </motion.p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Focus Score */}
            <RevealSection>
              <LabTool icon={Focus} title="Focus Index" description="Calculate cognitive focus quality" color="#FFFFFF">
                <div className="flex justify-center my-6 relative">
                  <ScoreGauge value={focusScore} label="INDEX" color={monochromeScale(focusScore)} />
                </div>
                <SimpleSlider label="Distractions" value={focusDistractions} onChange={setFocusDistractions} min={0} max={10} step={1} color="#FFFFFF" />
                <SimpleSlider label="Cognitive Load" value={focusCogLoad} onChange={setFocusCogLoad} min={0} max={10} step={0.5} color="#FFFFFF" />
              </LabTool>
            </RevealSection>

            {/* Burnout Predictor */}
            <RevealSection delay={0.1}>
              <LabTool icon={AlertTriangle} title="Burnout Risk" description="Assess fatigue probability" color="#FFFFFF">
                <div className="flex justify-center my-6 relative">
                  <ScoreGauge value={burnoutRisk} label="RISK" color={monochromeScale(burnoutRisk, true)} />
                </div>
                <SimpleSlider label="Sleep" value={burnoutInputs.sleep_hours} onChange={(v) => setBurnoutInputs({...burnoutInputs, sleep_hours: v})} min={3} max={10} step={0.5} color="#FFFFFF" />
                <SimpleSlider label="Cog. Load" value={burnoutInputs.cognitive_load} onChange={(v) => setBurnoutInputs({...burnoutInputs, cognitive_load: v})} min={0} max={10} step={0.5} color="#FFFFFF" />
                <SimpleSlider label="Hrs Coding" value={burnoutInputs.hours_coding} onChange={(v) => setBurnoutInputs({...burnoutInputs, hours_coding: v})} min={0} max={12} step={0.5} color="#FFFFFF" />
              </LabTool>
            </RevealSection>

            {/* Sleep Optimizer */}
            <RevealSection delay={0.2}>
              <LabTool icon={Moon} title="Sleep Engine" description="Optimize rest metrics" color="#FFFFFF">
                <div className="flex justify-center my-6 relative">
                  <ScoreGauge value={sleepScore} label="QUALITY" color={monochromeScale(sleepScore)} />
                </div>
                <SimpleSlider label="Sleep Hours" value={sleepHours} onChange={setSleepHours} min={3} max={10} step={0.5} color="#FFFFFF" />
                <div className="mt-4 p-3 border border-white/20 text-[10px] bg-white/5" style={{ color: '#AAAAAA', fontFamily: 'JetBrains Mono' }}>
                  {sleepHours >= 7 && sleepHours <= 8 ? 'SYSTEM: Optimal range for peak cognitive performance.' :
                   sleepHours < 6 ? 'WARNING: Less than 6 hours impairs decision-making.' :
                   sleepHours > 9 ? 'NOTICE: Excess rest may indicate systemic fatigue.' :
                   'SYSTEM: Suggest targeting 7-8 hours for optimal results.'}
                </div>
              </LabTool>
            </RevealSection>

            {/* Coding Efficiency */}
            <RevealSection delay={0.3}>
              <LabTool icon={Code2} title="Output Efficiency" description="Commits per hour density" color="#FFFFFF">
                <div className="flex justify-center my-6 relative">
                  <ScoreGauge value={efficiency} label="DENSITY" color={monochromeScale(efficiency)} />
                </div>
                <SimpleSlider label="Coding Hrs" value={codingHours} onChange={setCodingHours} min={0} max={12} step={0.5} color="#FFFFFF" />
                <SimpleSlider label="Commits" value={codingCommits} onChange={setCodingCommits} min={0} max={15} step={1} color="#FFFFFF" />
              </LabTool>
            </RevealSection>

            {/* AI Usage Analyzer */}
            <RevealSection delay={0.4}>
              <LabTool icon={Sparkles} title="AI Multiplier" description="Measure assistance effect" color="#FFFFFF">
                <div className="text-center my-8">
                  <div className="text-5xl font-light mb-2" style={{ fontFamily: 'JetBrains Mono', color: '#FFFFFF' }}>{aiMultiplier}x</div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Productivity Multiplier</div>
                </div>
                <div className="mt-8">
                  <SimpleSlider label="AI Hrs" value={aiHours} onChange={setAiHours} min={0} max={8} step={0.5} color="#FFFFFF" />
                  <SimpleSlider label="Coding Hrs" value={aiCodingHours} onChange={setAiCodingHours} min={0} max={12} step={0.5} color="#FFFFFF" />
                </div>
              </LabTool>
            </RevealSection>

            {/* Habit Impact Simulator */}
            <RevealSection delay={0.5}>
              <LabTool icon={TrendingUp} title="Habit Analyzer" description="Real-time ML performance inference" color="#FFFFFF">
                <div className="text-center my-6">
                  {habitResult !== null ? (
                    <>
                      <p className="text-white/60 mb-6 font-light" style={{ fontFamily: 'Barlow, sans-serif' }}>
                        Tweak parameters manually to observe how the ONNX model responds in real-time.
                        This allows you to test the decision boundaries of the active machine learning engine.
                      </p>
                      <div className="text-4xl font-light mb-2" style={{ fontFamily: 'JetBrains Mono', color: monochromeScale(habitResult * 100) }}>
                        {(habitResult * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Success Probability</div>
                    </>
                  ) : (
                    <button onClick={runHabit} className="px-6 py-3 border border-white bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors"
                      style={{ fontFamily: 'JetBrains Mono' }}>
                      <Zap className="w-3 h-3 inline mr-2" /> Run Inference
                    </button>
                  )}
                </div>
                <SimpleSlider label="Sleep" value={habitInputs.sleep_hours} onChange={(v) => { setHabitInputs({...habitInputs, sleep_hours: v}); setHabitResult(null); }} min={3} max={10} step={0.5} color="#FFFFFF" />
                <SimpleSlider label="Distractions" value={habitInputs.distractions} onChange={(v) => { setHabitInputs({...habitInputs, distractions: v}); setHabitResult(null); }} min={0} max={10} step={1} color="#FFFFFF" />
                {habitResult === null && (
                  <button onClick={runHabit} className="w-full mt-6 py-3 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                    style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>
                    Predict Outcome
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
