import { useEffect, useRef, useState } from "react";

const SIGNATURE_PATH =
  "M 28 36 " +
  "C 30 20, 48 14, 56 24 " +
  "C 62 32, 52 56, 46 76 " +
  "C 40 96, 28 108, 18 102 " +
  "C 8 96, 16 78, 42 66 " +
  "C 52 62, 60 46, 72 46 " +
  "C 60 46, 54 72, 66 74 " +
  "C 76 76, 84 62, 80 50 " +
  "C 78 44, 82 42, 90 46 " +
  "C 92 56, 86 74, 98 74 " +
  "C 106 74, 110 64, 110 50 " +
  "C 110 28, 112 16, 116 18 " +
  "C 118 20, 116 38, 114 54 " +
  "C 112 66, 114 74, 122 72 " +
  "C 128 70, 134 52, 144 46 " +
  "C 152 42, 158 46, 154 54 " +
  "C 148 64, 138 72, 148 74 " +
  "C 158 76, 184 70, 210 64 " +
  "C 226 60, 244 58, 238 68 " +
  "C 226 82, 178 92, 130 95 " +
  "C 82 98, 38 96, 16 88 " +
  "C 6 84, 14 78, 30 80 " +
  "C 65 83, 136 80, 186 73";

export function JODCSignature() {
  const pathRef = useRef<SVGPathElement>(null);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [pen, setPen] = useState<{ x: number; y: number; visible: boolean }>({
    x: 28,
    y: 36,
    visible: false,
  });

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setTotalLength(len);
    }
  }, []);

  useEffect(() => {
    if (!totalLength || !pathRef.current) return;

    let animFrameId: number;
    let startTime: number | null = null;
    const drawDuration = 4000; // 4s to draw
    const holdDuration = 2200; // 2.2s hold fully drawn
    const fadeDuration = 600;  // 0.6s reset fade
    const cycleDuration = drawDuration + holdDuration + fadeDuration;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % cycleDuration;

      if (elapsed <= drawDuration) {
        // Drawing phase (0 -> 1)
        const t = elapsed / drawDuration;
        // Smooth easeInOut curve
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const currentProg = Math.max(0, Math.min(1, eased));
        setProgress(currentProg);

        if (pathRef.current) {
          const pt = pathRef.current.getPointAtLength(currentProg * totalLength);
          setPen({ x: pt.x, y: pt.y, visible: true });
        }
      } else if (elapsed <= drawDuration + holdDuration) {
        // Hold phase
        setProgress(1);
        setPen((prev) => ({ ...prev, visible: false }));
      } else {
        // Reset phase
        const tFade = (elapsed - drawDuration - holdDuration) / fadeDuration;
        setProgress(1 - tFade);
        setPen((prev) => ({ ...prev, visible: false }));
      }

      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameId);
  }, [totalLength]);

  const strokeDashoffset = totalLength ? (1 - progress) * totalLength : 0;

  return (
    <div className="relative flex flex-col items-center sm:items-end select-none">
      <div className="relative w-[210px] sm:w-[240px] h-[95px] sm:h-[105px]">
        {/* Enhanced ambient glow with multiple layers */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-flame/20 via-orange-500/15 to-flame/20 blur-3xl rounded-full animate-pulse" />
        <div className="pointer-events-none absolute inset-0 bg-flame/10 blur-2xl rounded-full" />

        <svg
          viewBox="0 0 250 115"
          className="w-full h-full overflow-visible"
          aria-label="JODC Signature"
        >
          <defs>
            {/* Multi-layer glow filter */}
            <filter id="glow-flame" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Gradient for the stroke */}
            <linearGradient id="signature-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff6b00" />
              <stop offset="50%" stopColor="#ff9500" />
              <stop offset="100%" stopColor="#ff6b00" />
            </linearGradient>
            
            {/* Sparkle filter */}
            <filter id="sparkle" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Enhanced guide stroke with gradient */}
          <path
            d={SIGNATURE_PATH}
            fill="none"
            stroke="url(#signature-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
          />

          {/* Main animated drawing stroke with enhanced effects */}
          <path
            ref={pathRef}
            d={SIGNATURE_PATH}
            fill="none"
            stroke="url(#signature-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength || 1000}
            strokeDashoffset={strokeDashoffset}
            filter="url(#glow-flame)"
            style={{
              filter:
                "drop-shadow(0 0 8px #ff7a1a) drop-shadow(0 0 20px rgba(255,122,26,0.7)) drop-shadow(0 0 35px rgba(255,100,0,0.4))",
            }}
          />

          {/* Bright inner core for clarity */}
          <path
            d={SIGNATURE_PATH}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength || 1000}
            strokeDashoffset={strokeDashoffset}
            opacity="0.9"
            style={{
              filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))"
            }}
          />

          {/* Enhanced moving pen point with particle effects */}
          {pen.visible && (
            <g transform={`translate(${pen.x}, ${pen.y})`}>
              {/* Outer glow aura */}
              <circle r="14" fill="#ff7a1a" opacity="0.15" className="animate-pulse" />
              <circle r="10" fill="#ff9500" opacity="0.3" />
              <circle r="7" fill="#ff7a1a" opacity="0.6" />
              {/* Middle layer */}
              <circle r="4.5" fill="#ff6b00" opacity="0.9" filter="url(#sparkle)" />
              {/* Hot bright core */}
              <circle r="2.5" fill="#ffffff" filter="url(#sparkle)" />
              {/* Sparkle particles */}
              <circle r="1" fill="#fff" opacity="0.8" transform="translate(-6, -4)" />
              <circle r="0.8" fill="#fff" opacity="0.6" transform="translate(5, -6)" />
              <circle r="0.6" fill="#fff" opacity="0.5" transform="translate(-5, 5)" />
            </g>
          )}
        </svg>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-flame font-semibold">
          Open Source Signature
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-flame animate-ping" />
        <span className="h-1.5 w-1.5 rounded-full bg-flame/70 animate-pulse" />
      </div>
    </div>
  );
}
