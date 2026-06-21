import { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';

interface HlsVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export default function HlsVideo({ src, ...props }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({
          startLevel: -1,
          debug: false,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Playback is now handled entirely by the IntersectionObserver below
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            setError(data.type);
            console.error('HLS error:', data);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for native HLS support (Safari)
        video.src = src;
      }
    } else {
      // Normal video
      video.src = src;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(e => console.log("Play interrupted or not ready:", e));
        } else {
          video.pause();
        }
      });
    }, { threshold: 0, rootMargin: '200px' }); // start playing slightly before it enters

    observer.observe(video);

    return () => {
      observer.disconnect();
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  if (error) {
    return <div className="text-red-500 text-xs">Video Error: {error}</div>;
  }

  return (
    <video
      ref={videoRef}
      playsInline
      muted
      loop
      {...props}
    />
  );
}
