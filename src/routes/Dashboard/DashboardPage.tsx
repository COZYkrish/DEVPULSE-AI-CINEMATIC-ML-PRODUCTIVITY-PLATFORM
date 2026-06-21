import { useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Save, RotateCcw, TrendingUp, AlertTriangle, CheckCircle, XCircle, Shield, Brain, Moon, Coffee, Code2, GitCommit, Bug, Activity, Bell, BellOff, Sparkles, GitBranch, Trophy } from 'lucide-react';
import { usePredictionStore } from '@/store/predictionStore';
import { usePredictionEngine } from '@/hooks/usePredictionEngine';
import { FEATURES, PRESETS } from '@/lib/constants';
import type { PredictionInput } from '@/lib/constants';
import SceneContainer from '@/components/3d/SceneContainer';
import PageTransition from '@/components/animations/PageTransition';

const iconMap: Record<string, React.ComponentType<{ className?: string, style?: React.CSSProperties }>> = {
  Code2, Coffee, Bell, Moon, GitCommit, Bug, Brain, Activity,
  BellOff, Sparkles, GitBranch, Trophy, AlertTriangle, TrendingUp, Shield,
};

function getIcon(name: string) {
  return iconMap[name] || Activity;
}

/* ============================================ */
/* Gauge Component                               */
/* ============================================ */
function CircularGauge({ value, size = 140, strokeWidth = 8, color, label }: {
  value: number; size?: number; strokeWidth?: number; color: string; label: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} fill="none"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference } as any}
          animate={{ strokeDashoffset: offset } as any}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          strokeDasharray={circumference}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color }}>
          {Math.round(value)}
        </span>
        <span className="text-[10px] mt-1" style={{ color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}>
          {label}
        </span>
      </div>
    </div>
  );
}

/* ============================================ */
/* Metric Card                                   */
/* ============================================ */
function MetricCard({ label, value, suffix = '', icon: Icon, color, description }: {
  label: string; value: number | string; suffix?: string; icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>; color: string; description?: string;
}) {
  return (
    <div className="glass rounded-xl p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{label}</span>
        <Icon className="w-4 h-4" style={{ color: color }} />
      </div>
      <div className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color }}>
        {typeof value === 'number' ? value.toFixed(1) : value}{suffix}
      </div>
      {description && (
        <p className="text-[10px] mt-1" style={{ color: '#64748B' }}>{description}</p>
      )}
    </div>
  );
}

/* ============================================ */
/* Input Slider                                  */
/* ============================================ */
function InputSlider({ feature, value, onChange }: {
  feature: typeof FEATURES[number]; value: number; onChange: (val: number) => void;
}) {
  const Icon = getIcon(feature.icon);
  const percentage = ((value - feature.min) / (feature.max - feature.min)) * 100;

  return (
    <div className="glass rounded-xl p-4 group card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: '#00E5FF' } as React.CSSProperties} />
          <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{feature.label}</span>
        </div>
        <span className="text-sm font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#F1F5F9' }}>
          {Number.isInteger(feature.step) ? value : value.toFixed(1)}{feature.unit}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={feature.min}
          max={feature.max}
          step={feature.step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00E5FF ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`,
          }}
        />
      </div>

      <p className="text-[10px] mt-2" style={{ color: '#64748B' }}>{feature.description}</p>
    </div>
  );
}

/* ============================================ */
/* DASHBOARD PAGE                                */
/* ============================================ */
export default function DashboardPage() {
  const { inputs, result, isLoading, setInput, setInputs } = usePredictionStore((s) => s);
  const { runPrediction, runPredictionDebounced, savePrediction } = usePredictionEngine();
  const hasRunInitial = useRef(false);

  // Run initial prediction
  useEffect(() => {
    if (!hasRunInitial.current) {
      hasRunInitial.current = true;
      runPrediction();
    }
  }, []);

  const handleInputChange = useCallback(
    (key: keyof PredictionInput, value: number) => {
      setInput(key, value);
      runPredictionDebounced({ [key]: value });
    },
    [setInput, runPredictionDebounced]
  );

  const handlePreset = useCallback(
    (presetName: string) => {
      const preset = PRESETS[presetName];
      if (preset) {
        setInputs(preset);
        runPrediction(preset);
      }
    },
    [setInputs, runPrediction]
  );

  const handleSave = useCallback(() => {
    if (result) savePrediction(result);
  }, [result, savePrediction]);

  const prob = result?.successProbability ?? 0;
  const probColor = prob >= 0.7 ? '#10B981' : prob >= 0.4 ? '#F59E0B' : '#EF4444';

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}
            >
              AI Command Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm"
              style={{ color: '#94A3B8' }}
            >
              Adjust parameters and watch predictions update in real-time
            </motion.p>
          </div>

          {/* Preset Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
          >
            <span className="text-xs mr-2" style={{ color: '#64748B' }}>Presets:</span>
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => handlePreset(name)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94A3B8',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {name}
              </button>
            ))}
          </motion.div>

          {/* Main 3-Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT: Input Controls */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#94A3B8', fontFamily: 'Space Grotesk, sans-serif' }}>
                <Activity className="w-4 h-4" style={{ color: '#00E5FF' }} />
                Input Parameters
              </h2>
              {FEATURES.map((feature) => (
                <InputSlider
                  key={feature.key}
                  feature={feature}
                  value={inputs[feature.key]}
                  onChange={(val) => handleInputChange(feature.key, val)}
                />
              ))}
            </motion.div>

            {/* CENTER: 3D AI Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              {/* 3D Visualization */}
              <div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Suspense fallback={null}>
                  <SceneContainer variant="core" />
                </Suspense>
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse at center, transparent 40%, #050816 100%)',
                }} />
                
                {/* Overlay status */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass rounded-xl p-3 text-center">
                    <div className="text-[10px] mb-1" style={{ color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}>
                      {isLoading ? 'PROCESSING...' : 'PREDICTION ENGINE'}
                    </div>
                    <div className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: probColor }}>
                      {(prob * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => runPrediction()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #00E5FF, #22D3EE)', color: '#050816' }}
                >
                  <Zap className="w-4 h-4" /> Predict
                </button>
                <button
                  onClick={handleSave}
                  disabled={!result}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 disabled:opacity-40"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={() => handlePreset('Balanced')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </motion.div>

            {/* RIGHT: Prediction Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#94A3B8', fontFamily: 'Space Grotesk, sans-serif' }}>
                <TrendingUp className="w-4 h-4" style={{ color: '#00E5FF' }} />
                Prediction Results
              </h2>

              {/* Success Probability Gauge */}
              <div className="glass rounded-2xl p-6 flex flex-col items-center">
                <div className="relative">
                  <CircularGauge
                    value={prob * 100}
                    color={probColor}
                    label="SUCCESS %"
                    size={160}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {result?.isSuccess ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                      <CheckCircle className="w-3.5 h-3.5" /> SUCCESS
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                      <XCircle className="w-3.5 h-3.5" /> AT RISK
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="Confidence"
                  value={((result?.confidenceScore ?? 0) * 100)}
                  suffix="%"
                  icon={Shield}
                  color="#22D3EE"
                />
                <MetricCard
                  label="Productivity"
                  value={result?.productivityScore ?? 0}
                  suffix="/100"
                  icon={TrendingUp}
                  color="#10B981"
                />
                <MetricCard
                  label="Burnout Risk"
                  value={result?.burnoutRisk ?? 0}
                  suffix="%"
                  icon={AlertTriangle}
                  color={(result?.burnoutRisk ?? 0) > 50 ? '#EF4444' : '#F59E0B'}
                />
                <MetricCard
                  label="Focus Score"
                  value={Math.max(0, 100 - (inputs.distractions * 10 + inputs.cognitive_load * 5))}
                  suffix="/100"
                  icon={Brain}
                  color="#7C3AED"
                />
              </div>

              {/* Recommendations */}
              {result?.recommendations && result.recommendations.length > 0 && (
                <div className="glass rounded-2xl p-4">
                  <h3 className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: '#94A3B8' }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {result.recommendations.slice(0, 4).map((rec, i) => {
                      const RecIcon = getIcon(rec.icon);
                      const priorityColors: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-3 p-2.5 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                          <RecIcon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: priorityColors[rec.priority] || '#94A3B8' }} />
                          <div>
                            <div className="text-xs font-medium" style={{ color: '#F1F5F9' }}>{rec.title}</div>
                            <div className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#64748B' }}>{rec.description}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
