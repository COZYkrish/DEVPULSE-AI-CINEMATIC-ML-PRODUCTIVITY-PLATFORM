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
  { name: 'React 19', category: 'Frontend', color: '#61DAFB' },
  { name: 'TypeScript', category: 'Language', color: '#3178C6' },
  { name: 'Vite', category: 'Build', color: '#646CFF' },
  { name: 'Tailwind CSS', category: 'Styling', color: '#06B6D4' },
  { name: 'Three.js', category: '3D', color: '#000000' },
  { name: 'R3F', category: '3D', color: '#00E5FF' },
  { name: 'Framer Motion', category: 'Animation', color: '#FF0055' },
  { name: 'GSAP', category: 'Animation', color: '#88CE02' },
  { name: 'ONNX Runtime', category: 'ML', color: '#7C3AED' },
  { name: 'Recharts', category: 'Charts', color: '#FF6347' },
  { name: 'D3.js', category: 'Charts', color: '#F9A03C' },
  { name: 'Zustand', category: 'State', color: '#F59E0B' },
  { name: 'React Hook Form', category: 'Forms', color: '#EC5990' },
  { name: 'Zod', category: 'Validation', color: '#3068B7' },
  { name: 'PapaParse', category: 'Data', color: '#10B981' },
  { name: 'Lucide', category: 'Icons', color: '#F1F5F9' },
];

const pipeline = [
  { step: '01', title: 'Data Collection', desc: 'Load the developer productivity CSV dataset with 501 records and 8 features.', icon: Database, color: '#00E5FF' },
  { step: '02', title: 'Preprocessing', desc: 'StandardScaler normalization. Feature engineering and data validation.', icon: Layers, color: '#22D3EE' },
  { step: '03', title: 'Model Training', desc: 'Train 4 models: Logistic Regression, Decision Tree, Random Forest, XGBoost.', icon: Brain, color: '#7C3AED' },
  { step: '04', title: 'Evaluation', desc: 'Compare Accuracy, Precision, Recall, F1 Score, and ROC-AUC metrics.', icon: BarChart3, color: '#F59E0B' },
  { step: '05', title: 'Model Selection', desc: 'Select the best performing model based on F1 score and ROC-AUC.', icon: FlaskConical, color: '#10B981' },
  { step: '06', title: 'ONNX Export', desc: 'Convert the champion model to ONNX format for browser execution.', icon: Cpu, color: '#EF4444' },
  { step: '07', title: 'Browser Inference', desc: 'Load ONNX model in-browser via ONNX Runtime Web. Zero latency predictions.', icon: Zap, color: '#00E5FF' },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-32 overflow-hidden">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)' }}>
              <Info className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
              About <span className="gradient-text">DEVPULSE AI</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
              A research-grade AI platform that predicts developer productivity using real machine learning models running entirely in your browser.
            </motion.p>
          </div>

          {/* Problem Statement */}
          <RevealSection className="mb-16">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk', color: '#F1F5F9' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.15)' }}>
                  <Code2 className="w-4 h-4" style={{ color: '#00E5FF' }} />
                </div>
                Problem Statement
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
                Developer productivity is notoriously difficult to measure. Traditional metrics like lines of code or hours worked fail to capture the nuanced factors that truly determine success — sleep quality, cognitive load, distraction frequency, and AI tool adoption.
              </p>
              <p className="leading-relaxed" style={{ color: '#94A3B8' }}>
                DEVPULSE AI tackles this challenge by training machine learning models on a curated dataset of 501 developer work sessions, each characterized by 8 behavioral features. The trained model runs entirely in the browser via ONNX Runtime Web, enabling instant, private, zero-latency predictions with no data leaving the user's device.
              </p>
            </div>
          </RevealSection>

          {/* Dataset */}
          <RevealSection className="mb-16">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk', color: '#F1F5F9' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
                  <Database className="w-4 h-4" style={{ color: '#7C3AED' }} />
                </div>
                Dataset
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th className="text-left py-2 px-3" style={{ color: '#00E5FF', fontFamily: 'Space Grotesk' }}>Feature</th>
                      <th className="text-left py-2 px-3" style={{ color: '#94A3B8' }}>Type</th>
                      <th className="text-left py-2 px-3" style={{ color: '#94A3B8' }}>Range</th>
                      <th className="text-left py-2 px-3" style={{ color: '#94A3B8' }}>Description</th>
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
                      <tr key={feat} className="hover:bg-[rgba(255,255,255,0.02)]" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td className="py-2.5 px-3 font-medium" style={{ color: '#F1F5F9', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{feat}</td>
                        <td className="py-2.5 px-3" style={{ color: '#64748B', fontSize: 12 }}>{type}</td>
                        <td className="py-2.5 px-3" style={{ color: '#22D3EE', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{range}</td>
                        <td className="py-2.5 px-3" style={{ color: '#94A3B8', fontSize: 12 }}>{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </RevealSection>

          {/* Training Pipeline */}
          <RevealSection className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk', color: '#F1F5F9' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <GitBranch className="w-4 h-4" style={{ color: '#10B981' }} />
              </div>
              Training Pipeline
            </h2>
            <div className="space-y-4">
              {pipeline.map((step, i) => {
                const Icon = step.icon;
                return (
                  <RevealSection key={step.step} delay={i * 0.08}>
                    <div className="glass rounded-xl p-5 flex items-start gap-4 card-hover">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${step.color}15`, border: `1px solid ${step.color}25` }}>
                        <Icon className="w-5 h-5" style={{ color: step.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${step.color}15`, color: step.color, fontFamily: 'JetBrains Mono' }}>
                            {step.step}
                          </span>
                          <span className="text-sm font-semibold" style={{ color: '#F1F5F9', fontFamily: 'Space Grotesk' }}>{step.title}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{step.desc}</p>
                      </div>
                      {i < pipeline.length - 1 && (
                        <ArrowRight className="w-4 h-4 flex-shrink-0 mt-3" style={{ color: '#64748B' }} />
                      )}
                    </div>
                  </RevealSection>
                );
              })}
            </div>
          </RevealSection>

          {/* Tech Stack */}
          <RevealSection className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk', color: '#F1F5F9' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(249,168,11,0.15)' }}>
                <Layers className="w-4 h-4" style={{ color: '#F59E0B' }} />
              </div>
              Technology Stack
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {techStack.map((tech, i) => (
                <RevealSection key={tech.name} delay={i * 0.03}>
                  <div className="glass rounded-xl p-3.5 text-center card-hover">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: '#F1F5F9', fontFamily: 'Space Grotesk' }}>{tech.name}</div>
                    <div className="text-[10px]" style={{ color: '#64748B' }}>{tech.category}</div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </RevealSection>

          {/* ONNX Workflow */}
          <RevealSection>
            <div className="glass rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk', color: '#F1F5F9' }}>
                ONNX Workflow
              </h2>
              <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: '#94A3B8' }}>
                The entire ML pipeline runs without any server. Models are trained in Python, exported to ONNX, and executed in the browser via WebAssembly.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {[
                  { label: 'Python Training', sub: 'scikit-learn / XGBoost', color: '#3178C6' },
                  { label: 'ONNX Export', sub: 'skl2onnx', color: '#7C3AED' },
                  { label: 'Browser Inference', sub: 'ONNX Runtime Web', color: '#00E5FF' },
                  { label: 'Zero Latency', sub: 'WebAssembly', color: '#10B981' },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className="glass rounded-xl p-4 text-center">
                      <div className="text-xs font-bold mb-0.5" style={{ color: s.color, fontFamily: 'Space Grotesk' }}>{s.label}</div>
                      <div className="text-[10px]" style={{ color: '#64748B', fontFamily: 'JetBrains Mono' }}>{s.sub}</div>
                    </div>
                    {i < 3 && <ArrowRight className="w-4 h-4" style={{ color: '#64748B' }} />}
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
