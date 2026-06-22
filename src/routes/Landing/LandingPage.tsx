import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Code2, Moon, GitCommit, Activity } from 'lucide-react';
import SceneContainer from '@/components/3d/SceneContainer';
import HlsVideo from '@/components/ui/HlsVideo';
import FadingVideo from '@/components/ui/FadingVideo';
import BlurText from '@/components/animations/BlurText';
import ShapeBlur from '@/components/animations/ShapeBlur';
import 'iconify-icon';

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

  return <span ref={ref} style={{ fontFamily: 'Instrument Serif, serif' }}>0</span>;
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
      <div className="relative liquid-glass flex items-start gap-6 p-6 mb-4 hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
          <ShapeBlur variation={0} shapeSize={2.0} roundness={0.8} borderSize={0.04} circleSize={0.4} circleEdge={1.0} />
        </div>
        <div className="relative z-10 w-12 h-12 flex items-center justify-center shrink-0 border border-white/20 rounded-full bg-white/5">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl mb-1 tracking-tight" style={{ fontFamily: 'Instrument Serif, serif' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-white/60 font-light" style={{ fontFamily: 'Barlow, sans-serif' }}>
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
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-black">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-transparent to-black/80" />
        </div>

        <div className="container relative z-10 w-full flex-1 flex flex-col justify-between pt-12 pb-24 px-6">
          {/* Top Left: Title */}
          <div className="flex flex-col items-start text-left max-w-3xl mt-48">
            <BlurText 
              text="Predict Developer Productivity"
              className="text-6xl sm:text-[6.5rem] leading-[1.0] tracking-tight italic drop-shadow-xl"
              delay={0.4}
              style={{ fontFamily: 'Instrument Serif, serif' }}
            />
          </div>

          {/* Bottom Right: Description & Actions */}
          <div className="flex flex-col items-start lg:items-end text-left lg:text-right max-w-lg lg:self-end mt-16 lg:mt-0">
            <SectionReveal delay={0.8}>
              <p className="text-lg sm:text-xl mb-8 text-white/90 font-light drop-shadow-lg" style={{ fontFamily: 'Barlow, sans-serif' }}>
                Understand success patterns. Optimize performance. Make data-driven decisions 
                with raw machine learning running directly in your browser.
              </p>
            </SectionReveal>

            <SectionReveal delay={1.0}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium text-lg hover:scale-105 transition-transform shadow-lg" style={{ fontFamily: 'Barlow, sans-serif' }}>
                  Launch System
                  {/* @ts-ignore */}
                  <iconify-icon icon="lucide:arrow-up-right" width="20" height="20"></iconify-icon>
                </Link>
                <Link to="/analytics" className="liquid-glass-strong rounded-full flex items-center gap-2 px-8 py-4 text-white font-medium text-lg hover:scale-105 transition-transform" style={{ fontFamily: 'Barlow, sans-serif' }}>
                  Explore Data
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SCENE 2 — THE ARCHITECT (Features)           */}
      {/* ============================================ */}
      <section className="relative min-h-[100vh] flex items-center py-32">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <HlsVideo src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8" className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionReveal>
                <div className="liquid-glass inline-flex rounded-full px-4 py-1.5 mb-6">
                  <span className="text-sm font-light text-white/80 uppercase tracking-widest" style={{ fontFamily: 'Barlow, sans-serif' }}>Scene 02: The Architect</span>
                </div>
              </SectionReveal>
              <BlurText 
                text="Deconstruct Performance"
                className="text-5xl sm:text-7xl mb-8 tracking-tight italic"
                style={{ fontFamily: 'Instrument Serif, serif' }}
              />
              <SectionReveal delay={0.3}>
                <p className="text-lg text-white/60 mb-12 font-light leading-relaxed" style={{ fontFamily: 'Barlow, sans-serif' }}>
                  We analyze 8 critical dimensions of developer productivity to predict task success with machine learning precision. 
                  Every input is a vector in high-dimensional space.
                </p>
              </SectionReveal>
            </div>
            <div className="space-y-4">
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
        <div className="absolute inset-0 z-0 pointer-events-none">
          <HlsVideo src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8" className="w-full h-full object-cover saturate-0" />
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="text-center">
            <SectionReveal>
              <div className="liquid-glass inline-flex rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm font-light text-white/80 uppercase tracking-widest" style={{ fontFamily: 'Barlow, sans-serif' }}>Scene 03: The Nexus</span>
              </div>
            </SectionReveal>
            <BlurText 
              text="Patterns in the Noise"
              className="text-5xl sm:text-7xl mb-16 tracking-tight italic justify-center"
              style={{ fontFamily: 'Instrument Serif, serif' }}
            />
          </div>

          <div className="relative liquid-glass-strong rounded-3xl p-8 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
              <ShapeBlur variation={0} shapeSize={2.0} roundness={0.2} borderSize={0.02} circleSize={0.6} circleEdge={1.0} />
            </div>
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/10">
              {[
                { label: 'Dataset Records', value: 501 },
                { label: 'Feature Dimensions', value: 8 },
                { label: 'Success Rate', value: 57, suffix: '%' },
                { label: 'ML Models', value: 4 },
              ].map((stat, i) => (
                <SectionReveal key={stat.label} delay={i * 0.1} className="text-center px-4">
                  <div className="text-6xl sm:text-7xl mb-4 text-white italic">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                  </div>
                  <div className="text-sm text-white/60 font-medium tracking-wide uppercase" style={{ fontFamily: 'Barlow, sans-serif' }}>
                    {stat.label}
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SCENE 4 — THE ORACLE (AI Core)               */}
      {/* ============================================ */}
      <section className="relative min-h-[100vh] flex items-center py-32">
        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE CONTENT: Engine Status Dashboard */}
          <div className="hidden lg:flex flex-col justify-center relative">
            <SectionReveal delay={0.2}>
              <div className="liquid-glass-strong rounded-3xl p-8 max-w-sm mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:cpu-bolt-linear" width="24" height="24"></iconify-icon>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 font-light" style={{ fontFamily: 'Barlow, sans-serif' }}>Engine Status</div>
                    <div className="text-xl italic" style={{ fontFamily: 'Instrument Serif, serif' }}>Online & Optimal</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2" style={{ fontFamily: 'Barlow, sans-serif' }}>
                      <span className="text-white/60">Processing Latency</span>
                      <span className="text-white">12ms</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/4 rounded-full" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2" style={{ fontFamily: 'Barlow, sans-serif' }}>
                      <span className="text-white/60">Model Accuracy</span>
                      <span className="text-white">98.4%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[98%] rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm text-white/60 font-light mb-1" style={{ fontFamily: 'Barlow, sans-serif' }}>Active Nodes</div>
                      <div className="text-4xl italic" style={{ fontFamily: 'Instrument Serif, serif' }}>1,024</div>
                    </div>
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:chart-square-linear" width="32" height="32" className="text-white/40"></iconify-icon>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* RIGHT SIDE CONTENT: Existing Inference Models */}
          <div className="max-w-xl lg:ml-auto">
            <SectionReveal>
              <div className="liquid-glass inline-flex rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm font-light text-white/80 uppercase tracking-widest" style={{ fontFamily: 'Barlow, sans-serif' }}>Scene 04: The Oracle</span>
              </div>
            </SectionReveal>
            <BlurText 
              text="Inference Engine"
              className="text-5xl sm:text-7xl mb-8 tracking-tight italic"
              style={{ fontFamily: 'Instrument Serif, serif' }}
            />
            <SectionReveal delay={0.3}>
              <p className="text-lg text-white/60 mb-12 font-light leading-relaxed" style={{ fontFamily: 'Barlow, sans-serif' }}>
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
                  <div className={`relative liquid-glass rounded-2xl p-6 flex items-center justify-between overflow-hidden ${model.active ? 'bg-white/10' : ''}`}>
                    <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
                      <ShapeBlur variation={0} shapeSize={2.0} roundness={0.8} borderSize={0.04} circleSize={0.4} circleEdge={1.0} />
                    </div>
                    <div className="relative z-10">
                      <div className="text-2xl italic tracking-tight" style={{ fontFamily: 'Instrument Serif, serif' }}>{model.name}</div>
                      <div className="text-sm text-white/60 mt-1 font-light" style={{ fontFamily: 'Barlow, sans-serif' }}>{model.desc}</div>
                    </div>
                    {model.active && (
                      <div className="relative z-10 w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_#fff]" />
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
        <div className="absolute inset-0 z-0 pointer-events-none">
          <HlsVideo src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8" className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="container relative z-10 text-center flex flex-col items-center">
          <BlurText 
            text="Your next workflow starts here."
            className="text-6xl sm:text-[6.5rem] leading-[1.1] mb-8 tracking-tight italic justify-center"
            style={{ fontFamily: 'Instrument Serif, serif' }}
          />

          <SectionReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium text-lg hover:scale-105 transition-transform" style={{ fontFamily: 'Barlow, sans-serif' }}>
                Initialize Sequence
                {/* @ts-ignore */}
                <iconify-icon icon="lucide:arrow-up-right" width="20" height="20"></iconify-icon>
              </Link>
            </div>
          </SectionReveal>
        </div>
        
        {/* Footer info at absolute bottom */}
        <div className="absolute bottom-8 left-0 right-0 border-t border-white/10 pt-6 px-8 flex justify-between text-sm text-white/40 font-light" style={{ fontFamily: 'Barlow, sans-serif' }}>
          <span>© 2026 Devpulse AI</span>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
