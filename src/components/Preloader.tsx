import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  phase: number;
  delay: number;
  life: number;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
}) => {
  const [loading, setLoading] = useState(true);
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame = 0;

    const particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        Math.floor(width * dpr);

      canvas.height =
        Math.floor(height * dpr);

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    const createParticles = () => {
      particles.length = 0;

      const count =
        width < 640
          ? 320
          : 700;

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const startX =
          -100 -
          Math.random() *
            width *
            0.55;

        const centerY =
          height * 0.5;

        const spread =
          height * 0.38;

        particles.push({
          x: startX,

          y:
            centerY +
            (Math.random() - 0.5) *
              spread,

          vx:
            3.5 +
            Math.random() *
              5.5,

          vy:
            (Math.random() - 0.5) *
            2.2,

          size:
            Math.random() < 0.12
              ? 4 +
                Math.random() *
                  4
              : 1.2 +
                Math.random() *
                  3.2,

          alpha:
            0.35 +
            Math.random() *
              0.65,

          color:
            Math.random() < 0.52
              ? "#FFFFFF"
              : Math.random() < 0.48
              ? "#D00078"
              : Math.random() < 0.55
              ? "#C000C8"
              : "#7B1FA2",

          phase:
            Math.random() *
            Math.PI *
            2,

          delay:
            Math.random() *
            650,

          life:
            0.7 +
            Math.random() *
              0.7,
        });
      }
    };

    createParticles();

    const start =
      performance.now();

    const render = (
      now: number
    ) => {
      const elapsed =
        now - start;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      particles.forEach(
        (particle) => {
          const time =
            elapsed -
            particle.delay;

          if (time < 0) {
            return;
          }

          const progress =
            Math.min(
              time / 2800,
              1
            );

          const wave =
            Math.sin(
              elapsed *
                0.0045 +
                particle.phase
            );

          const verticalWave =
            Math.sin(
              elapsed *
                0.0028 +
                particle.phase *
                  1.7
            );

          if (
            progress < 0.42
          ) {
            particle.x +=
              particle.vx;

            particle.y +=
              particle.vy +
              wave *
                0.65;
          } else {
            particle.x +=
              particle.vx *
              (1.05 +
                progress *
                  0.8);

            particle.y +=
              particle.vy +
              verticalWave *
                0.9;
          }

          particle.vx +=
            0.003;

          if (
            particle.x >
            width * 0.55 &&
            particle.x <
            width * 0.82
          ) {
            particle.y +=
              Math.sin(
                elapsed *
                  0.006 +
                  particle.phase
              ) *
              0.7;
          }

          if (
            particle.x >
            width + 120
          ) {
            particle.x =
              -120 -
              Math.random() *
                120;

            particle.y =
              height * 0.18 +
              Math.random() *
                height *
                0.64;

            particle.vx =
              4 +
              Math.random() *
                5;
          }

          let alpha =
            particle.alpha;

          if (
            time < 350
          ) {
            alpha *=
              time / 350;
          }

          if (
            elapsed >
            2400
          ) {
            alpha *= Math.max(
              0,
              1 -
                (elapsed - 2400) /
                  650
            );
          }

          if (
            alpha <= 0
          ) {
            return;
          }

          ctx.beginPath();

          ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            particle.color;

          ctx.globalAlpha =
            alpha;

          ctx.fill();

          ctx.globalAlpha = 1;
        }
      );

      animationFrame =
        requestAnimationFrame(
          render
        );
    };

    animationFrame =
      requestAnimationFrame(
        render
      );

    const timer =
      window.setTimeout(() => {
        setLoading(false);

        if (onComplete) {
          onComplete();
        }
      }, 3200);

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      clearTimeout(timer);

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden select-none"
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.7,
              ease: "easeInOut",
            },
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          <div className="relative z-10 flex items-center justify-center w-full max-w-[1500px] px-5 sm:px-8">
            <div className="flex items-center gap-5 sm:gap-8 md:gap-10">
              <motion.div
                className="flex-shrink-0 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  rotate: -20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />

                  <path
                    d="M30 133 A82 82 0 0 0 53 166 L77 147 A51 51 0 0 1 63 128 Z"
                    fill="#FF6B00"
                  />

                  <path
                    d="M170 133 A82 82 0 0 1 147 166 L123 147 A51 51 0 0 0 137 128 Z"
                    fill="#FF6B00"
                  />

                  <circle
                    cx="100"
                    cy="100"
                    r="50"
                    fill="#FFFFFF"
                  />

                  <path
                    d="M100 100 L78 60 A50 50 0 0 1 122 60 Z"
                    fill="#FF6B00"
                  />
                </svg>
              </motion.div>

              <div className="flex flex-col">
                <div className="flex items-center leading-none">
                  <motion.span
                    className="font-black text-[#D00078] text-[70px] sm:text-[100px] md:text-[135px] lg:text-[160px]"
                    initial={{
                      opacity: 0,
                      x: -35,
                      filter:
                        "blur(10px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter:
                        "blur(0px)",
                    }}
                    transition={{
                      delay: 0.95,
                      duration: 0.45,
                    }}
                  >
                    J
                  </motion.span>

                  <motion.span
                    className="font-black text-[#D00078] text-[70px] sm:text-[100px] md:text-[135px] lg:text-[160px]"
                    initial={{
                      opacity: 0,
                      x: -25,
                      filter:
                        "blur(12px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter:
                        "blur(0px)",
                    }}
                    transition={{
                      delay: 1.05,
                      duration: 0.45,
                    }}
                  >
                    O
                  </motion.span>

                  <motion.span
                    className="font-black text-[#C000C8] text-[70px] sm:text-[100px] md:text-[135px] lg:text-[160px]"
                    initial={{
                      opacity: 0,
                      x: -15,
                      filter:
                        "blur(14px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter:
                        "blur(0px)",
                    }}
                    transition={{
                      delay: 1.15,
                      duration: 0.5,
                    }}
                  >
                    D
                  </motion.span>

                  <motion.div
                    className="relative flex items-center justify-center w-[58px] h-[58px] sm:w-[82px] sm:h-[82px] md:w-[110px] md:h-[110px] lg:w-[130px] lg:h-[130px] ml-1.5 sm:ml-2.5"
                    initial={{
                      opacity: 0,
                      x: -5,
                      filter:
                        "blur(16px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter:
                        "blur(0px)",
                    }}
                    transition={{
                      delay: 1.25,
                      duration: 0.55,
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="#7B1FA2"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="22"
                        fill="#000000"
                      />

                      <path
                        d="M88.97 27.5 A45 45 0 0 1 88.97 72.5 L69.05 61 A22 22 0 0 0 69.05 39 Z"
                        fill="#C0C0C0"
                      />
                    </svg>
                  </motion.div>
                </div>

                <motion.p
                  className="text-white text-[10px] sm:text-sm md:text-base lg:text-lg font-light tracking-[0.12em] whitespace-nowrap text-center mt-1"
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 1.4,
                    duration: 0.55,
                  }}
                >
                  JIIT Open-Source Developers Circle
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Preloader;
