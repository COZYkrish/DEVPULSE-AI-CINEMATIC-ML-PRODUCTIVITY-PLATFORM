import { useRef, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
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
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================ */
/* Floating Feature Card                         */
/* ============================================ */
function FeatureCard({ icon: Icon, title, description, delay, color }: {
  icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>; title: string; description: string; delay: number; color: string;
}) {
  return (
    <SectionReveal delay={delay}>
      <div className="glass rounded-2xl p-6 card-hover group cursor-pointer h-full">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-6 h-6" style={{ color: color }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
          {description}
        </p>
      </div>
    </SectionReveal>
  );
}

/* ============================================ */
/* Marquee                                       */
/* ============================================ */
function TechMarquee() {
  const items = [
    'React 19', 'TypeScript', 'ONNX Runtime', 'Three.js', 'Framer Motion', 'GSAP',
    'Tailwind CSS', 'Zustand', 'Vite', 'D3.js', 'Recharts', 'Machine Learning',
    'XGBoost', 'Random Forest', 'Neural Networks', 'Real-time Inference',
  ];

  return (
    <div className="overflow-hidden py-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex animate-[marquee_40s_linear_infinite]">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-8 text-sm font-medium whitespace-nowrap"
            style={{ color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================ */
/* LANDING PAGE                                  */
/* ============================================ */
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative">
      {/* ============================================ */}
      {/* SCENE 1 — THE HERO                           */}
      {/* ============================================ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <SceneContainer variant="hero" />
          </Suspense>
        </div>

        {/* Aurora overlay */}
        <div className="absolute inset-0 aurora-bg opacity-40" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #050816 70%)',
        }} />

        {/* Content */}
        <div className="relative z-10 container text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)' }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E5FF' }} />
            <span className="text-xs font-medium" style={{ color: '#00E5FF', fontFamily: 'JetBrains Mono, monospace' }}>
              AI-Powered Prediction Engine
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95] tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <span style={{ color: '#F1F5F9' }}>Predict Developer</span>
            <br />
            <span className="gradient-text">Productivity</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#94A3B8' }}
          >
            Understand success patterns. Optimize performance. Make data-driven decisions 
            with real machine learning running directly in your browser.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="magnetic-btn magnetic-btn-primary group text-base"
            >
              <Zap className="w-5 h-5 mr-2" />
              Launch Dashboard
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/analytics"
              className="magnetic-btn magnetic-btn-secondary text-base"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Explore Analytics
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16"
          >
            {[
              { value: 500, suffix: '+', label: 'Data Points' },
              { value: 8, suffix: '', label: 'Features' },
              { value: 95, suffix: '%', label: 'Accuracy' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#00E5FF' }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs" style={{ color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs" style={{ color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}>
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" style={{ color: '#64748B' }} />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ============================================ */}
      {/* TECH MARQUEE                                 */}
      {/* ============================================ */}
      <TechMarquee />

      {/* ============================================ */}
      {/* SCENE 2 — THE BUILDER (Features)             */}
      {/* ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        <div className="container relative z-10">
          <SectionReveal className="text-center mb-16">
            <span className="text-xs font-medium px-3 py-1.5 rounded-full mb-4 inline-block"
              style={{ color: '#00E5FF', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.15)', fontFamily: 'JetBrains Mono, monospace' }}>
              THE BUILDER
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
              Every great product begins
              <br />
              <span className="gradient-text">with a developer</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
              We analyze 8 critical dimensions of developer productivity to predict task success with machine learning precision.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={Code2} title="Coding Hours" description="Track deep work sessions and their impact on deliverables and code quality." delay={0} color="#00E5FF" />
            <FeatureCard icon={Moon} title="Sleep Quality" description="Understand how rest patterns correlate with cognitive performance and output." delay={0.1} color="#7C3AED" />
            <FeatureCard icon={Coffee} title="Caffeine Intake" description="Monitor stimulant consumption and its diminishing returns on productivity." delay={0.2} color="#F59E0B" />
            <FeatureCard icon={Activity} title="Cognitive Load" description="Measure mental fatigue and its effect on decision quality and error rates." delay={0.3} color="#EF4444" />
            <FeatureCard icon={GitCommit} title="Commit Frequency" description="Analyze version control activity as a signal of consistent progress." delay={0.4} color="#10B981" />
            <FeatureCard icon={Bug} title="Bug Reports" description="Track defect patterns to understand code quality under different conditions." delay={0.5} color="#EF4444" />
            <FeatureCard icon={Sparkles} title="AI Usage" description="Measure AI tool adoption and its multiplier effect on developer output." delay={0.6} color="#22D3EE" />
            <FeatureCard icon={TrendingUp} title="Success Prediction" description="Real-time ML predictions running entirely in your browser via ONNX." delay={0.7} color="#00E5FF" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SCENE 3 — THE DATA GALAXY                    */}
      {/* ============================================ */}
      <section className="relative py-32 overflow-hidden">
        {/* 3D Galaxy Background */}
        <div className="absolute inset-0 opacity-60">
          <Suspense fallback={null}>
            <SceneContainer variant="galaxy" />
          </Suspense>
        </div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #050816 0%, transparent 20%, transparent 80%, #050816 100%)',
        }} />

        <div className="container relative z-10">
          <SectionReveal className="text-center mb-16">
            <span className="text-xs font-medium px-3 py-1.5 rounded-full mb-4 inline-block"
              style={{ color: '#22D3EE', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.15)', fontFamily: 'JetBrains Mono, monospace' }}>
              THE DATA GALAXY
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
              Patterns exist inside
              <br />
              <span className="gradient-text">every work session</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
              500+ data points transform into insights. Each row becomes a star in our data universe, revealing hidden correlations.
            </p>
          </SectionReveal>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Dataset Records', value: 501, color: '#00E5FF' },
              { label: 'Feature Dimensions', value: 8, color: '#7C3AED' },
              { label: 'Success Rate', value: 57, suffix: '%', color: '#10B981' },
              { label: 'ML Models', value: 4, color: '#F59E0B' },
            ].map((stat, i) => (
              <SectionReveal key={stat.label} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 text-center card-hover">
                  <div className="text-4xl font-bold mb-2" style={{ color: stat.color }}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                  </div>
                  <div className="text-sm" style={{ color: '#94A3B8' }}>{stat.label}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SCENE 4 — THE AI CORE                        */}
      {/* ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: 3D Core */}
            <SectionReveal>
              <div className="relative h-[500px] rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <Suspense fallback={null}>
                  <SceneContainer variant="core" />
                </Suspense>
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse at center, transparent 30%, #050816 100%)',
                }} />
              </div>
            </SectionReveal>

            {/* Right: Content */}
            <div>
              <SectionReveal>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full mb-4 inline-block"
                  style={{ color: '#7C3AED', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.15)', fontFamily: 'JetBrains Mono, monospace' }}>
                  THE AI CORE
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                  Machine learning discovers
                  <br />
                  <span className="gradient-text">hidden relationships</span>
                </h2>
                <p className="text-lg mb-8" style={{ color: '#94A3B8' }}>
                  Four models compete in our AI arena. The best is exported to ONNX format and runs real-time inference directly in your browser — no API, no server, no latency.
                </p>
              </SectionReveal>

              {/* Model list */}
              <div className="space-y-3">
                {[
                  { name: 'Logistic Regression', desc: 'Linear baseline', color: '#22D3EE' },
                  { name: 'Decision Tree', desc: 'Interpretable splits', color: '#10B981' },
                  { name: 'Random Forest', desc: 'Ensemble power', color: '#F59E0B' },
                  { name: 'XGBoost', desc: 'Champion model', color: '#00E5FF', best: true },
                ].map((model, i) => (
                  <SectionReveal key={model.name} delay={i * 0.1}>
                    <div className={`glass rounded-xl p-4 flex items-center gap-4 card-hover ${model.best ? 'glow-primary' : ''}`}>
                      <div className="w-3 h-3 rounded-full" style={{ background: model.color }} />
                      <div className="flex-1">
                        <div className="text-sm font-semibold" style={{ color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>
                          {model.name}
                          {model.best && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(0,229,255,0.15)', color: '#00E5FF', fontFamily: 'JetBrains Mono, monospace' }}>
                              BEST
                            </span>
                          )}
                        </div>
                        <div className="text-xs" style={{ color: '#64748B' }}>{model.desc}</div>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SCENE 5 — THE FUTURE (CTA)                   */}
      {/* ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-30" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        <div className="container relative z-10 text-center">
          <SectionReveal>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full mb-4 inline-block"
              style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)', fontFamily: 'JetBrains Mono, monospace' }}>
              THE FUTURE
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
              The future is not guessed.
              <br />
              <span className="gradient-text">It is predicted.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-12" style={{ color: '#94A3B8' }}>
              Start making data-driven decisions about developer productivity. 
              No signup required. No data leaves your browser. Everything runs locally.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="magnetic-btn magnetic-btn-primary text-lg group"
              >
                <Zap className="w-5 h-5 mr-2" />
                Launch Dashboard
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/analytics"
                className="magnetic-btn magnetic-btn-secondary text-lg"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Analytics
              </Link>
              <Link
                to="/about"
                className="magnetic-btn magnetic-btn-secondary text-lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                Understand AI
              </Link>
            </div>
          </SectionReveal>

          {/* Bottom gradient divider */}
          <div className="mt-32 h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.3), rgba(124,58,237,0.3), transparent)',
          }} />
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER                                        */}
      {/* ============================================ */}
      <footer className="py-16 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)' }}
              >
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                DEVPULSE AI
              </span>
            </div>
            
            <p className="text-xs" style={{ color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}>
              Built with React 19 · ONNX Runtime Web · Three.js · Real ML
            </p>

            <p className="text-xs" style={{ color: '#64748B' }}>
              © {new Date().getFullYear()} DEVPULSE AI. All predictions run locally.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
