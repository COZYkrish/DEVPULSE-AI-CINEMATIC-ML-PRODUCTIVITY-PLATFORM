import { useRef, useEffect } from 'react';

export default function FadingVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const opacityRef = useRef(0);
  const fadingOutRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const setOpacity = (val: number) => {
    opacityRef.current = Math.max(0, Math.min(1, val));
    if (videoRef.current) {
      videoRef.current.style.opacity = opacityRef.current.toString();
    }
  };

  const fade = (target: number, duration: number, callback?: () => void) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const startOpacity = opacityRef.current;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + (target - startOpacity) * progress;
      setOpacity(currentOpacity);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        if (callback) callback();
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      // initial fade in
      fade(1, 500);
      fadingOutRef.current = false;
      video.play().catch(e => console.error("Auto-play failed", e));
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeRemaining = video.duration - video.currentTime;
      if (timeRemaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fade(0, 500);
      }
    };

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play().then(() => {
          fadingOutRef.current = false;
          fade(1, 500);
        }).catch(e => console.error("Play after ended failed", e));
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      playsInline
      style={{ opacity: 0 }}
    />
  );
}
