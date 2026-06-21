import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Info, Database, Brain, Code2, Layers, Cpu, ArrowRight, Zap, GitBranch, BarChart3, FlaskConical } from 'lucide-react';
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

const techStack = [
  { name: 'React 19', category: 'Frontend', color: '#FFFFFF' },
  { name: 'TypeScript', category: 'Language', color: '#FFFFFF' },
  { name: 'Vite', category: 'Build', color: '#FFFFFF' },
  { name: 'Tailwind CSS', category: 'Styling', color: '#FFFFFF' },
  { name: 'Three.js', category: '3D', color: '#FFFFFF' },
  { name: 'R3F', category: '3D', color: '#FFFFFF' },
  { name: 'Framer Motion', category: 'Animation', color: '#FFFFFF' },
  { name: 'GSAP', category: 'Animation', color: '#FFFFFF' },
  { name: 'ONNX Runtime', category: 'ML', color: '#FFFFFF' },
  { name: 'Recharts', category: 'Charts', color: '#FFFFFF' },
  { name: 'D3.js', category: 'Charts', color: '#FFFFFF' },
  { name: 'Zustand', category: 'State', color: '#FFFFFF' },
  { name: 'React Hook Form', category: 'Forms', color: '#FFFFFF' },
  { name: 'Zod', category: 'Validation', color: '#FFFFFF' },
  { name: 'PapaParse', category: 'Data', color: '#FFFFFF' },
  { name: 'Lucide', category: 'Icons', color: '#FFFFFF' },
];

const pipeline = [
  { step: '01', title: 'Data Collection', desc: 'Load the developer productivity CSV dataset with 501 records and 8 features.', icon: Database, color: '#FFFFFF' },
  { step: '02', title: 'Preprocessing', desc: 'StandardScaler normalization. Feature engineering and data validation.', icon: Layers, color: '#FFFFFF' },
  { step: '03', title: 'Model Training', desc: 'Train 4 models: Logistic Regression, Decision Tree, Random Forest, XGBoost.', icon: Brain, color: '#FFFFFF' },
  { step: '04', title: 'Evaluation', desc: 'Compare Accuracy, Precision, Recall, F1 Score, and ROC-AUC metrics.', icon: BarChart3, color: '#FFFFFF' },
  { step: '05', title: 'Model Selection', desc: 'Select the best performing model based on F1 score and ROC-AUC.', icon: FlaskConical, color: '#FFFFFF' },
  { step: '06', title: 'ONNX Export', desc: 'Convert the champion model to ONNX format for browser execution.', icon: Cpu, color: '#FFFFFF' },
  { step: '07', title: 'Browser Inference', desc: 'Load ONNX model in-browser via ONNX Runtime Web. Zero latency predictions.', icon: Zap, color: '#FFFFFF' },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden bg-black text-white">
        <div className="vignette-overlay" />
        <div className="noise-overlay" />
        <div className="film-lines" />
        
        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center mb-16 border-b border-white/20 pb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 border border-white/20 bg-white/5 mb-6">
              <Info className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl font-light uppercase tracking-widest mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              System <span className="font-bold">Architecture</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-[10px] uppercase tracking-widest max-w-2xl mx-auto" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
              A research-grade AI platform that predicts developer productivity using real machine learning models running entirely in your browser.
            </motion.p>
          </div>

          {/* Problem Statement */}
          <RevealSection className="mb-16">
            <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <h2 className="text-2xl font-light uppercase tracking-widest mb-6 flex items-center gap-4 relative z-10" style={{ fontFamily: 'Space Grotesk' }}>
                <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                Problem Definition
              </h2>
              <div className="relative z-10 space-y-4 text-sm" style={{ color: '#AAAAAA', fontFamily: 'Inter' }}>
                <p className="leading-relaxed">
                  Developer productivity is notoriously difficult to measure. Traditional metrics like lines of code or hours worked fail to capture the nuanced factors that truly determine success — sleep quality, cognitive load, distraction frequency, and AI tool adoption.
                </p>
                <p className="leading-relaxed">
                  DEVPULSE AI tackles this challenge by training machine learning models on a curated dataset of 501 developer work sessions, each characterized by 8 behavioral features. The trained model runs entirely in the browser via ONNX Runtime Web, enabling instant, private, zero-latency predictions with no data leaving the user's device.
                </p>
              </div>
            </div>
          </RevealSection>

          {/* Dataset */}
          <RevealSection className="mb-16">
            <div className="border border-white/20 bg-black/60 p-8 relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <h2 className="text-2xl font-light uppercase tracking-widest mb-8 flex items-center gap-4 relative z-10" style={{ fontFamily: 'Space Grotesk' }}>
                <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                Dataset Architecture
              </h2>
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                      <th className="text-left py-3 px-4 uppercase tracking-widest text-[10px]" style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>Feature</th>
                      <th className="text-left py-3 px-4 uppercase tracking-widest text-[10px]" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Type</th>
                      <th className="text-left py-3 px-4 uppercase tracking-widest text-[10px]" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Range</th>
                      <th className="text-left py-3 px-4 uppercase tracking-widest text-[10px]" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['hours_coding', 'float', '0-12', 'Daily coding hours'],
                      ['coffee_intake_mg', 'float', '0-600', 'Caffeine consumption (mg)'],
                      ['distractions', 'int', '0-8', 'Number of interruptions'],
                      ['sleep_hours', 'float', '3-10', 'Hours of sleep'],
                      ['commits', 'int', '0-13', 'Git commits per day'],
                      ['bugs_reported', 'int', '0-5', 'Bugs reported per day'],
                      ['ai_usage_hours', 'float', '0-6.4', 'AI tool usage hours'],
                      ['cognitive_load', 'float', '1-10', 'Mental fatigue level'],
                      ['task_success', 'binary', '0/1', 'Target: task outcome'],
                    ].map(([feat, type, range, desc]) => (
                      <tr key={feat} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <td className="py-3 px-4 font-medium" style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{feat}</td>
                        <td className="py-3 px-4" style={{ color: '#888888', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{type}</td>
                        <td className="py-3 px-4" style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{range}</td>
                        <td className="py-3 px-4" style={{ color: '#AAAAAA', fontSize: 11 }}>{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </RevealSection>

          {/* Training Pipeline */}
          <RevealSection className="mb-16">
            <h2 className="text-2xl font-light uppercase tracking-widest mb-8 flex items-center gap-4" style={{ fontFamily: 'Space Grotesk' }}>
              <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              Training Pipeline
            </h2>
            <div className="space-y-4">
              {pipeline.map((step, i) => {
                const Icon = step.icon;
                return (
                  <RevealSection key={step.step} delay={i * 0.08}>
                    <div className="border border-white/20 bg-black/40 p-6 flex items-start gap-6 hover:bg-white/5 transition-colors group">
                      <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                        <Icon className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold px-2 py-1 border border-white/20" style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono' }}>
                            {step.step}
                          </span>
                          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>{step.title}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#AAAAAA', fontFamily: 'Inter' }}>{step.desc}</p>
                      </div>
                      {i < pipeline.length - 1 && (
                        <ArrowRight className="w-5 h-5 flex-shrink-0 mt-4 text-white/50" />
                      )}
                    </div>
                  </RevealSection>
                );
              })}
            </div>
          </RevealSection>

          {/* Tech Stack */}
          <RevealSection className="mb-16">
            <h2 className="text-2xl font-light uppercase tracking-widest mb-8 flex items-center gap-4" style={{ fontFamily: 'Space Grotesk' }}>
              <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              Technology Stack
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/20 border border-white/20">
              {techStack.map((tech, i) => (
                <RevealSection key={tech.name} delay={i * 0.03} className="bg-black p-4 text-center hover:bg-white/5 transition-colors">
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>{tech.name}</div>
                  <div className="text-[9px] uppercase tracking-widest" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>{tech.category}</div>
                </RevealSection>
              ))}
            </div>
          </RevealSection>

          {/* ONNX Workflow */}
          <RevealSection>
            <div className="border border-white/20 bg-black/60 p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <h2 className="text-2xl font-light uppercase tracking-widest mb-4 relative z-10" style={{ fontFamily: 'Space Grotesk' }}>
                ONNX Workflow
              </h2>
              <p className="text-[10px] uppercase tracking-widest mb-10 max-w-xl mx-auto relative z-10" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>
                The entire ML pipeline runs without any server. Models are trained in Python, exported to ONNX, and executed in the browser via WebAssembly.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                {[
                  { label: 'Python Training', sub: 'scikit-learn / XGBoost' },
                  { label: 'ONNX Export', sub: 'skl2onnx' },
                  { label: 'Browser Inference', sub: 'ONNX Runtime Web' },
                  { label: 'Zero Latency', sub: 'WebAssembly' },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-4">
                    <div className="border border-white/20 bg-black p-4 text-center hover:bg-white hover:text-black transition-colors group">
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-black" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>{s.label}</div>
                      <div className="text-[9px] uppercase tracking-widest group-hover:text-gray-800" style={{ color: '#888888', fontFamily: 'JetBrains Mono' }}>{s.sub}</div>
                    </div>
                    {i < 3 && <ArrowRight className="w-4 h-4 text-white/50" />}
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </PageTransition>
  );
}
