import { useEffect, useCallback, Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
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
function CircularGauge({ value, size = 140, strokeWidth = 2, color, label }: {
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
          initial={{ strokeDashoffset: circumference } as any}
          animate={{ strokeDashoffset: offset } as any}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          strokeDasharray={circumference}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-4xl font-light tracking-tighter" style={{ fontFamily: 'JetBrains Mono, monospace', color }}>
          {Math.round(value)}
        </span>
        <span className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: '#888888', fontFamily: 'JetBrains Mono, monospace' }}>
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
    <div className="p-4 border border-white/20 bg-black hover:bg-white/5 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-widest uppercase" style={{ color: '#888888', fontFamily: 'JetBrains Mono, monospace' }}>{label}</span>
        <Icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: color }} />
      </div>
      <div className="text-2xl font-light" style={{ fontFamily: 'JetBrains Mono, monospace', color }}>
        {typeof value === 'number' ? value.toFixed(1) : value}<span className="text-sm ml-1 text-white/50">{suffix}</span>
      </div>
      {description && (
        <p className="text-[10px] mt-2 text-white/40">{description}</p>
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
    <div className="p-4 border border-white/10 bg-black/40 hover:bg-white/5 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white" />
          <span className="text-[10px] tracking-widest uppercase text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{feature.label}</span>
        </div>
        <span className="text-sm font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
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
          className="w-full h-px appearance-none cursor-pointer bg-white/10"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff ${percentage}%, transparent ${percentage}%)`,
          }}
        />
        {/* Custom thumb styles are needed via CSS but we approximate with default for now */}
      </div>

      <p className="text-[10px] mt-2 text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{feature.description}</p>
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
  }, [runPrediction]);

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
  // Monochromatic scale: White for high prob, dark gray for low.
  const probColor = prob >= 0.7 ? '#FFFFFF' : prob >= 0.4 ? '#AAAAAA' : '#555555';

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden bg-black text-white">
        <div className="vignette-overlay" />
        <div className="noise-overlay" />
        <div className="film-lines" />
        
        <div className="container relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/20 pb-6">
            <div>
              <div className="text-[10px] tracking-widest text-gray-500 mb-2 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                // Operation: Inference
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-light uppercase tracking-widest"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Command Center
              </motion.h1>
            </div>
            
            {/* Preset Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mt-6 md:mt-0"
            >
              <span className="text-[10px] uppercase tracking-widest text-gray-500 mr-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Presets:</span>
              {Object.keys(PRESETS).map((name) => (
                <button
                  key={name}
                  onClick={() => handlePreset(name)}
                  className="px-3 py-1 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {name}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Main 3-Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Input Controls */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-2"
            >
              <h2 className="text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <Activity className="w-3 h-3 text-white" />
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              {/* 3D Visualization */}
              <div className="relative w-full aspect-square border border-white/20 bg-black overflow-hidden group">
                <Suspense fallback={null}>
                  <SceneContainer isFixedScroll={false} />
                </Suspense>
                <div className="scan-line" />
                
                {/* HUD Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/50 m-2" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/50 m-2" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/50 m-2" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/50 m-2" />
                
                {/* Overlay status */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="border border-white/10 bg-black/60 backdrop-blur-md p-3 text-center">
                    <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: '#888888', fontFamily: 'JetBrains Mono, monospace' }}>
                      {isLoading ? 'PROCESSING...' : 'PREDICTION ENGINE'}
                    </div>
                    <div className="text-2xl font-light" style={{ fontFamily: 'JetBrains Mono, monospace', color: probColor }}>
                      {(prob * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => runPrediction()}
                  className="flex items-center justify-center gap-2 p-3 border border-white bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-transparent hover:text-white transition-colors"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  <Zap className="w-3 h-3" /> Execute
                </button>
                <button
                  onClick={handleSave}
                  disabled={!result}
                  className="flex items-center justify-center gap-2 p-3 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors disabled:opacity-40"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  <Save className="w-3 h-3" /> Log
                </button>
                <button
                  onClick={() => handlePreset('Balanced')}
                  className="flex items-center justify-center gap-2 p-3 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </motion.div>

            {/* RIGHT: Prediction Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <TrendingUp className="w-3 h-3 text-white" />
                Output Vectors
              </h2>

              {/* Success Probability Gauge */}
              <div className="border border-white/20 bg-black/50 p-8 flex flex-col items-center relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <div className="relative z-10">
                  <CircularGauge
                    value={prob * 100}
                    color={probColor}
                    label="SUCCESS PROBABILITY"
                    size={160}
                    strokeWidth={1}
                  />
                </div>
                <div className="mt-6 flex items-center gap-2 relative z-10">
                  {result?.isSuccess ? (
                    <span className="flex items-center gap-2 px-4 py-1.5 border border-white bg-white/10 text-[10px] uppercase tracking-widest font-bold">
                      <CheckCircle className="w-3 h-3" /> Target Acquired
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-1.5 border border-white/40 bg-black text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      <XCircle className="w-3 h-3" /> At Risk
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  label="Confidence"
                  value={((result?.confidenceScore ?? 0) * 100)}
                  suffix="%"
                  icon={Shield}
                  color="#FFFFFF"
                />
                <MetricCard
                  label="Productivity"
                  value={result?.productivityScore ?? 0}
                  suffix="/100"
                  icon={TrendingUp}
                  color="#FFFFFF"
                />
                <MetricCard
                  label="Burnout Risk"
                  value={result?.burnoutRisk ?? 0}
                  suffix="%"
                  icon={AlertTriangle}
                  color={(result?.burnoutRisk ?? 0) > 50 ? '#FFFFFF' : '#AAAAAA'}
                />
                <MetricCard
                  label="Focus Score"
                  value={Math.max(0, 100 - (inputs.distractions * 10 + inputs.cognitive_load * 5))}
                  suffix="/100"
                  icon={Brain}
                  color="#FFFFFF"
                />
              </div>

              {/* Recommendations */}
              {result?.recommendations && result.recommendations.length > 0 && (
                <div className="border border-white/20 bg-black p-4">
                  <h3 className="text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <Sparkles className="w-3 h-3 text-white" />
                    System Directives
                  </h3>
                  <div className="space-y-2">
                    {result.recommendations.slice(0, 4).map((rec, i) => {
                      const RecIcon = getIcon(rec.icon);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-3 p-3 border border-white/10 hover:border-white/30 transition-colors"
                        >
                          <RecIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-white" />
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{rec.title}</div>
                            <div className="text-[10px] text-gray-500 leading-relaxed font-sans">{rec.description}</div>
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
