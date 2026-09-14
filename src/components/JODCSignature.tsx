import { motion } from "framer-motion";

export function JODCSignature() {
  return (
    <div className="jodc-signature" aria-label="JODC neon digital signature">
      <div className="jodc-signature-glow" aria-hidden="true" />
      <svg viewBox="0 0 520 180" role="img" aria-hidden="true" className="h-auto w-full overflow-visible">
        <defs>
          <filter id="jodc-neon-glow" x="-30%" y="-50%" width="160%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="soft" />
            <feGaussianBlur stdDeviation="8" result="wide" />
            <feMerge>
              <feMergeNode in="wide" />
              <feMergeNode in="soft" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="jodc-beam" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <linearGradient id="jodc-orange" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff6a00" />
            <stop offset="0.5" stopColor="#ffb14a" />
            <stop offset="1" stopColor="#ff7a1a" />
          </linearGradient>
        </defs>

        <text x="260" y="116" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="116" fontWeight="800" letterSpacing="-7" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2">JODC</text>

        <motion.text
          x="260" y="116"
          textAnchor="middle"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="116"
          fontWeight="800"
          letterSpacing="-7"
          fill="none"
          stroke="url(#jodc-orange)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          initial={{ strokeDasharray: 1, strokeDashoffset: 1, opacity: 0.2 }}
          animate={{ strokeDashoffset: 0, opacity: [0.2, 1, 1, 0.92] }}
          transition={{ strokeDashoffset: { duration: 2.4, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 2.4, times: [0, 0.18, 0.7, 1] } }}
          filter="url(#jodc-neon-glow)"
        >
          JODC
        </motion.text>

        <motion.path
          d="M94 143 C180 157 342 157 447 141"
          fill="none"
          stroke="url(#jodc-orange)"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          initial={{ strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 1 }}
          transition={{ duration: 1.05, delay: 2.25, ease: [0.65, 0, 0.35, 1] }}
          filter="url(#jodc-neon-glow)"
        />

        <motion.circle
          cx="92" cy="74" r="4" fill="#fff4dc" filter="url(#jodc-beam)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: [0, 105, 235, 350], y: [0, 12, -5, 25] }}
          transition={{ duration: 2.4, ease: "easeInOut", times: [0, 0.25, 0.7, 1] }}
        />
      </svg>
      <div className="mt-0 flex items-center justify-center gap-3">
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.34em] text-flame">Open Source Signature</span>
        <motion.span className="h-1.5 w-1.5 rounded-full bg-flame" animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.15, 0.8] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
      </div>
    </div>
  );
}
