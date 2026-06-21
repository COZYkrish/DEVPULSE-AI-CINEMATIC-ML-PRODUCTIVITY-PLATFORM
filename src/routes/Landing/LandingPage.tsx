import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Zap, BarChart3, Brain, ArrowRight, ChevronDown, Code2, Coffee, Moon, GitCommit, Bug, Activity, Sparkles, TrendingUp } from 'lucide-react';
import SceneContainer from '@/components/3d/SceneContainer';

/* ============================================ */
/* Animated Counter                              */
/* ============================================ */
function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2 }: {
  value: number; suffix?: string; prefix?: string; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null!);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    let start = 0;
    const end = value;
    const startTime = performance.now();

    function animate(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * end;
      if (ref.current) {
        ref.current.textContent = `${prefix}${Number.isInteger(end) ? Math.round(start) : start.toFixed(1)}${suffix}`;
      }
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [isInView, value, suffix, prefix, duration]);

  return <span ref={ref} style={{ fontFamily: 'JetBrains Mono, monospace' }}>0</span>;
}

/* ============================================ */
/* Section Reveal                                */
/* ============================================ */
function SectionReveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-20%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================ */
/* Feature Row                                   */
/* ============================================ */
function FeatureRow({ icon: Icon, title, description, delay }: {
  icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>; title: string; description: string; delay: number;
}) {
  return (
    <SectionReveal delay={delay}>
      <div className="flex items-start gap-6 p-6 border-b border-white/10 hover:bg-white/5 transition-colors duration-300">
        <div className="w-12 h-12 flex items-center justify-center border border-white/20 shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2 tracking-wide uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </SectionReveal>
  );
}

/* ============================================ */
/* LANDING PAGE                                  */
/* ============================================ */
export default function LandingPage() {
  return (
    <div className="relative w-full bg-black text-white">
      {/* 3D Fixed Background */}
      <SceneContainer isFixedScroll={true} />
      
      {/* Cinematic Overlays */}
      <div className="vignette-overlay" />
      <div className="noise-overlay" />
      <div className="film-lines" />

      {/* ============================================ */}
      {/* SCENE 1 — THE VOID (HERO)                    */}
      {/* ============================================ */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="container relative z-10 text-center">
          <SectionReveal delay={0.2}>
            <div className="inline-block border border-white/20 px-4 py-2 mb-8 tracking-widest text-xs uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              System Initialization
            </div>
          </SectionReveal>

          <SectionReveal delay={0.4}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light mb-6 tracking-tighter uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Predict Developer <br />
              <span className="font-bold">Productivity</span>
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.6}>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 text-gray-400 font-light">
              Understand success patterns. Optimize performance. Make data-driven decisions 
              with raw machine learning running directly in your browser.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/dashboard" className="magnetic-btn magnetic-btn-primary w-64 h-16">
                Launch System
              </Link>
              <Link to="/analytics" className="magnetic-btn magnetic-btn-secondary w-64 h-16">
                Explore Data
              </Link>
            </div>
          </SectionReveal>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] tracking-widest uppercase text-gray-500" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Scroll to Dive Deeper
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* SCENE 2 — THE ARCHITECT (Features)           */}
      {/* ============================================ */}
      <section className="relative min-h-[100vh] flex items-center py-32">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionReveal>
                <div className="text-xs tracking-widest text-gray-500 mb-4 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  // Scene 02: The Architect
                </div>
                <h2 className="text-4xl sm:text-6xl font-light mb-8 tracking-tight uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Deconstruct <br/><span className="font-bold">Performance</span>
                </h2>
                <p className="text-lg text-gray-400 mb-12">
                  We analyze 8 critical dimensions of developer productivity to predict task success with machine learning precision. 
                  Every input is a vector in high-dimensional space.
                </p>
              </SectionReveal>
            </div>
            <div className="space-y-0 border-t border-white/10">
              <FeatureRow icon={Code2} title="Coding Hours" description="Track deep work sessions and their impact on deliverables and code quality." delay={0.1} />
              <FeatureRow icon={Moon} title="Sleep Quality" description="Understand how rest patterns correlate with cognitive performance." delay={0.2} />
              <FeatureRow icon={Activity} title="Cognitive Load" description="Measure mental fatigue and its effect on decision quality and error rates." delay={0.3} />
              <FeatureRow icon={GitCommit} title="Commit Frequency" description="Analyze version control activity as a signal of consistent progress." delay={0.4} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SCENE 3 — THE NEXUS (Data Galaxy)            */}
      {/* ============================================ */}
      <section className="relative min-h-[100vh] flex items-center justify-center py-32">
        <div className="container relative z-10">
          <SectionReveal className="max-w-3xl">
            <div className="text-xs tracking-widest text-gray-500 mb-4 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              // Scene 03: The Nexus
            </div>
            <h2 className="text-4xl sm:text-6xl font-light mb-8 tracking-tight uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Patterns in the <br/><span className="font-bold">Noise</span>
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/20 mt-16">
            {[
              { label: 'Dataset Records', value: 501 },
              { label: 'Feature Dimensions', value: 8 },
              { label: 'Success Rate', value: 57, suffix: '%' },
              { label: 'ML Models', value: 4 },
            ].map((stat, i) => (
              <SectionReveal key={stat.label} delay={i * 0.1} className="bg-black p-8 sm:p-12">
                <div className="text-5xl font-light mb-4 text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                </div>
                <div className="text-xs tracking-widest text-gray-500 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {stat.label}
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SCENE 4 — THE ORACLE (AI Core)               */}
      {/* ============================================ */}
      <section className="relative min-h-[100vh] flex items-center py-32">
        <div className="container relative z-10">
          <div className="max-w-xl ml-auto">
            <SectionReveal>
              <div className="text-xs tracking-widest text-gray-500 mb-4 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                // Scene 04: The Oracle
              </div>
              <h2 className="text-4xl sm:text-6xl font-light mb-8 tracking-tight uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Inference <br/><span className="font-bold">Engine</span>
              </h2>
              <p className="text-lg text-gray-400 mb-12">
                Four models compete in our AI arena. The best is exported to ONNX format and runs real-time inference directly in your browser — zero latency, pure computation.
              </p>
            </SectionReveal>

            <div className="space-y-4">
              {[
                { name: 'XGBoost', desc: 'Champion Model (Active)', active: true },
                { name: 'Random Forest', desc: 'Ensemble Analysis', active: false },
                { name: 'Decision Tree', desc: 'Interpretable Logic', active: false },
                { name: 'Logistic Regression', desc: 'Linear Baseline', active: false },
              ].map((model, i) => (
                <SectionReveal key={model.name} delay={i * 0.1}>
                  <div className={`p-4 border ${model.active ? 'border-white bg-white/5' : 'border-white/10'} flex items-center justify-between`}>
                    <div>
                      <div className="text-sm font-bold uppercase tracking-wide">{model.name}</div>
                      <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{model.desc}</div>
                    </div>
                    {model.active && (
                      <div className="w-2 h-2 bg-white animate-pulse" />
                    )}
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SCENE 5 — THE HORIZON (CTA)                  */}
      {/* ============================================ */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center py-32">
        <div className="container relative z-10 text-center">
          <SectionReveal>
            <div className="text-xs tracking-widest text-gray-500 mb-4 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              // Scene 05: The Horizon
            </div>
            <h2 className="text-5xl sm:text-7xl font-light mb-8 tracking-tight uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              The future is <span className="font-bold">Predicted</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-16 text-gray-400">
              Start making data-driven decisions about developer productivity today. 
              No signup required. No data leaves your browser.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/dashboard" className="magnetic-btn magnetic-btn-primary w-64 h-16">
                Initialize Sequence
              </Link>
            </div>
          </SectionReveal>
        </div>
        
        {/* Footer info at absolute bottom */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-between px-8 text-[10px] text-gray-600 uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <span>Devpulse AI // System v1.0</span>
          <span>End of Transmission</span>
        </div>
      </section>
    </div>
  );
}
