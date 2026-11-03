import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import saharaMarkImg from '../assets/sahara-mark.png';

export default function KineticTalentPipeline() {
  const sectionRef = useRef(null);
  const radarRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 200 });
  const [isHovered, setIsHovered] = useState(false);

  // Parallax tracking across the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Spatial parallax offsets for depth
  const radarY = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const quoteY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!radarRef.current) return;
    const rect = radarRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="kinetic-pipeline"
      className="bg-[#0B0F17] py-14 sm:py-18 lg:py-20 px-6 sm:px-10 lg:px-16 text-white relative select-none font-sans overflow-hidden border-t border-white/[0.08]"
    >
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
        
        {/* ===================================================================== */}
        {/* 1. LEFT COLUMN: MODERN & REFINED RADAR WITH SCROLL PARALLAX           */}
        {/* ===================================================================== */}
        <motion.div
          style={{ y: radarY }}
          className="lg:col-span-5 flex items-center justify-center will-change-transform"
        >
          <div
            ref={radarRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full max-w-[380px] aspect-square rounded-[32px] bg-[#0E131F]/90 border border-white/[0.08] p-6 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-crosshair group"
          >
            {/* Minimal Modern Concentric Rings & Crosshairs */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full absolute inset-0 select-none pointer-events-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Perimeter */}
              <circle cx="200" cy="200" r="180" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              {/* Mid Range Ring */}
              <circle cx="200" cy="200" r="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              {/* Golden Ambient Ring */}
              <circle cx="200" cy="200" r="85" stroke="rgba(230,157,43,0.18)" strokeWidth="1" />
              {/* Core Perimeter */}
              <circle cx="200" cy="200" r="48" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              {/* Minimal Hairline Crosshair Axes */}
              <line x1="24" y1="200" x2="376" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="200" y1="24" x2="200" y2="376" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </svg>

            {/* Smooth Rotating Gold Radar Beam */}
            <div className="w-[340px] h-[340px] absolute inset-0 m-auto pointer-events-none rounded-full overflow-hidden">
              <div
                className="w-full h-full rounded-full animate-spin [animation-duration:8s] [animation-timing-function:linear]"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(230,157,43,0.18) 0deg, rgba(230,157,43,0.03) 45deg, transparent 80deg, transparent 360deg)',
                }}
              />
            </div>

            {/* Central Sahara Core Medallion with Real Sahara Brand Symbol */}
            <div className="relative z-10 w-24 h-24 sm:w-26 sm:h-26 rounded-full bg-[#0B0F17] border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.85)] flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.025, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 sm:w-15 sm:h-15 flex items-center justify-center select-none"
              >
                <img
                  src={saharaMarkImg}
                  alt="Sahara Staffing Inc."
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(230,157,43,0.3)]"
                  draggable={false}
                />
              </motion.div>
            </div>

            {/* Interactive Cursor Target: Yellow dot appearing and disappearing slowly on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    left: cursorPos.x,
                    top: cursorPos.y,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    left: { type: 'spring', damping: 28, stiffness: 240, mass: 0.35 },
                    top: { type: 'spring', damping: 28, stiffness: 240, mass: 0.35 },
                    opacity: { duration: 0.3 },
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                >
                  {/* Subtle Expanding Ripple Aura */}
                  <motion.div
                    animate={{
                      scale: [0.8, 2.4, 0.8],
                      opacity: [0.65, 0, 0.65],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 -m-2.5 w-8 h-8 rounded-full border border-[#E69D2B]/60 pointer-events-none"
                  />

                  {/* Pulsing Yellow Dot: Appearing and disappearing slowly */}
                  <motion.div
                    animate={{
                      opacity: [0.15, 1, 0.15],
                      scale: [0.85, 1.25, 0.85],
                      boxShadow: [
                        '0 0 6px rgba(230,157,43,0.3)',
                        '0 0 20px rgba(230,157,43,0.95)',
                        '0 0 6px rgba(230,157,43,0.3)',
                      ],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-3.5 h-3.5 rounded-full bg-[#E69D2B]"
                  />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

        {/* ===================================================================== */}
        {/* 2. RIGHT COLUMN: EXACT USER SCREENSHOT QUOTE + EXPANDED LINE HEIGHT   */}
        {/* ===================================================================== */}
        <motion.div
          style={{ y: quoteY }}
          className="lg:col-span-7 space-y-6 sm:space-y-8 lg:pl-4 will-change-transform"
        >
          {/* Eyebrow Label: THE SAHARA PHILOSOPHY */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <span className="w-6 h-[1.5px] bg-[#E69D2B]" />
            <span className="text-xs font-semibold tracking-[0.2em] text-[#E69D2B] uppercase font-sans">
              THE SAHARA PHILOSOPHY
            </span>
          </motion.div>

          {/* Big Modern Minimal Quote with Generous Line-Height */}
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-white tracking-[-0.025em] leading-[1.3] sm:leading-[1.28] lg:leading-[1.24] font-sans"
            >
              “Great teams aren’t built by headcount - they’re defined by the{' '}
              <span className="text-[#E69D2B]">pivotal talent</span> that moves business forward.”
            </motion.h2>
          </div>

          {/* 3-Column Metadata Row (Matches Screenshot Exactly) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pt-6 sm:pt-7 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 items-start"
          >
            {/* Col 1 */}
            <div className="space-y-1">
              <h4 className="text-white text-sm sm:text-base font-bold font-sans">
                Sahara Staffing Inc.
              </h4>
              <p className="text-slate-400 text-xs sm:text-[13px] font-sans leading-relaxed">
                Executive &amp; Technical Placement
              </p>
            </div>

            {/* Col 2 */}
            <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-6">
              <h4 className="text-[#E69D2B] text-sm sm:text-base font-bold font-sans">
                48-Hour Shortlist
              </h4>
              <p className="text-slate-400 text-xs sm:text-[13px] font-sans leading-relaxed">
                100% Peer-Reviewed Code
              </p>
            </div>

            {/* Col 3 */}
            <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-6">
              <h4 className="text-white text-sm sm:text-base font-bold font-sans">
                90-Day Guarantee
              </h4>
              <p className="text-slate-400 text-xs sm:text-[13px] font-sans leading-relaxed">
                Zero-Risk Replacement
              </p>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
