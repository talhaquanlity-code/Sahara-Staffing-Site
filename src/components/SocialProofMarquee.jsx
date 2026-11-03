import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Smooth Exponential Count-Up Component (triggers once when entering viewport)
function CounterNumber({ to, suffix = '', duration = 2.0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const node = ref.current;
    let startTime;
    let animationFrame;

    // Exponential ease-out for swift start and butter-smooth deceleration
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      const current = Math.floor(easeOutExpo(progress) * to);
      node.textContent = current + suffix;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        node.textContent = to + suffix;
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, to, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

// Authentic Enterprise Partner Logos (Clean Monochrome Vectors, Zero "AI Slop")
const enterprisePartners = [
  {
    name: 'GreenFlag',
    render: () => (
      <div className="flex items-center gap-2 text-[#0B0F17]/70 hover:text-[#0B0F17] transition-colors">
        <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs shrink-0">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5.25-3.5 10-8 12-4.5-2-8-6.75-8-12V6l8-4z" />
          </svg>
        </span>
        <span className="font-bold tracking-tight text-base sm:text-lg font-sans">GreenFlag</span>
      </div>
    ),
  },
  {
    name: 'Continiom',
    render: () => (
      <div className="flex items-center gap-2 text-[#0B0F17]/70 hover:text-[#0B0F17] transition-colors">
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="2,4 12,12 2,20" />
          <polygon points="22,4 12,12 22,20" />
        </svg>
        <span className="font-bold tracking-tight text-base sm:text-lg font-sans">Continiom</span>
      </div>
    ),
  },
  {
    name: '360° Global',
    render: () => (
      <div className="flex items-center gap-2 text-[#0B0F17]/70 hover:text-[#0B0F17] transition-colors">
        <div className="w-7 h-7 rounded-full bg-[#0B0F17] text-white flex items-center justify-center text-[8.5px] font-extrabold tracking-tighter shrink-0">
          360°
        </div>
        <span className="font-bold tracking-tight text-base sm:text-lg font-sans">Global</span>
      </div>
    ),
  },
  {
    name: 'Meetem',
    render: () => (
      <div className="flex items-center gap-2 text-[#0B0F17]/70 hover:text-[#0B0F17] transition-colors">
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="11" height="11" rx="2" />
          <rect x="10" y="10" width="11" height="11" rx="2" opacity="0.5" />
        </svg>
        <span className="font-bold tracking-tight text-base sm:text-lg font-sans">Meetem</span>
      </div>
    ),
  },
  {
    name: 'Nexus AI',
    render: () => (
      <div className="flex items-center gap-2 text-[#0B0F17]/70 hover:text-[#0B0F17] transition-colors">
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" opacity="0.6" />
          <rect x="8" y="13" width="8" height="8" rx="2" opacity="0.8" />
        </svg>
        <span className="font-bold tracking-tight text-base sm:text-lg font-sans">Nexus AI</span>
      </div>
    ),
  },
  {
    name: 'trustvil',
    render: () => (
      <div className="flex items-center gap-2 text-[#0B0F17]/70 hover:text-[#0B0F17] transition-colors">
        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">
          ✦
        </span>
        <span className="font-bold tracking-tight text-base sm:text-lg font-sans">trustvil</span>
      </div>
    ),
  },
  {
    name: 'FinPulse',
    render: () => (
      <div className="flex items-center gap-2 text-[#0B0F17]/70 hover:text-[#0B0F17] transition-colors">
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h2l2-4 2 8 1.5-4h2.5" />
        </svg>
        <span className="font-bold tracking-tight text-base sm:text-lg font-sans">FinPulse</span>
      </div>
    ),
  },
];

export default function SocialProofMarquee() {
  const containerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const yStats = useTransform(scrollYProgress, (v) => (isDesktop ? (0.5 - v) * 36 : 0));
  const yMarquee = useTransform(scrollYProgress, (v) => (isDesktop ? (v - 0.5) * 24 : 0));

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="w-full bg-white p-3 sm:p-4 lg:p-5 select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-7 items-center">
        {/* ========================================================================= */}
        {/* 1. LEFT COLUMN: SIGNATURE OBSIDIAN BLACK THEME STATS CAPSULE              */}
        {/* ========================================================================= */}
        <motion.div
          style={{ y: yStats }}
          className="lg:col-span-6 bg-[#0B0F17] text-white rounded-[20px] sm:rounded-[32px] p-4 sm:p-7 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden will-change-transform"
        >
          {/* Subtle Ambient Brand Sheen */}
          <div className="absolute -top-16 -left-16 w-44 h-44 bg-[#E69D2B]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Balanced 3-Column Responsive Grid on Mobile, Flex on Desktop */}
          <div className="grid grid-cols-3 divide-x divide-white/10 sm:divide-x-0 sm:flex sm:items-center sm:justify-between sm:gap-6 relative z-10">
            {/* Stat 1: 500+ */}
            <div className="flex flex-col pr-2 sm:pr-0">
              <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#E69D2B] font-display tracking-tight leading-none">
                <CounterNumber to={500} suffix="+" duration={2.2} />
              </span>
              <span className="text-[10px] xs:text-[11px] sm:text-xs text-[#94A3B8] font-medium block mt-1.5 sm:mt-2 font-inter tracking-tight leading-tight">
                Executive Placements
              </span>
            </div>

            {/* Desktop Divider 1 */}
            <div className="w-[1px] h-10 bg-white/15 hidden sm:block shrink-0" />

            {/* Stat 2: 98% */}
            <div className="flex flex-col px-2 sm:px-0">
              <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white font-display tracking-tight leading-none">
                <CounterNumber to={98} suffix="%" duration={1.9} />
              </span>
              <span className="text-[10px] xs:text-[11px] sm:text-xs text-[#94A3B8] font-medium block mt-1.5 sm:mt-2 font-inter tracking-tight leading-tight">
                90-Day Retention
              </span>
            </div>

            {/* Desktop Divider 2 */}
            <div className="w-[1px] h-10 bg-white/15 hidden sm:block shrink-0" />

            {/* Stat 3: 14 Days */}
            <div className="flex flex-col pl-2 sm:pl-0">
              <div className="flex items-baseline gap-1 sm:gap-1.5 whitespace-nowrap leading-none">
                <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#E69D2B] font-display tracking-tight">
                  <CounterNumber to={14} suffix="" duration={1.6} />
                </span>
                <span className="text-base xs:text-xl sm:text-2xl lg:text-[28px] font-extrabold text-[#E69D2B] font-display tracking-tight">
                  Days
                </span>
              </div>
              <span className="text-[10px] xs:text-[11px] sm:text-xs text-[#94A3B8] font-medium block mt-1.5 sm:mt-2 font-inter tracking-tight leading-tight">
                Avg Time-to-Fill
              </span>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. RIGHT COLUMN: PREMIUM MONOCHROME LOGO TICKER (ZERO AI SLOP)            */}
        {/* ========================================================================= */}
        <motion.div
          style={{ y: yMarquee }}
          className="lg:col-span-6 relative overflow-hidden flex flex-col justify-center px-2 sm:px-4 py-1 sm:py-2 will-change-transform"
        >
          {/* Subtle Luxury Brand Kicker */}
          <div className="flex items-center gap-2 mb-2.5 sm:mb-4">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#B87314] font-sans">
              TRUSTED BY ENTERPRISE LEADERS
            </span>
          </div>

          {/* Clean Ticker Track with Soft Edge Fades */}
          <div
            className="relative w-full overflow-hidden py-1 sm:py-2"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
              maskImage:
                'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            }}
          >
            {/* Soft Edge Blends */}
            <div className="absolute inset-y-0 left-0 w-4 sm:w-8 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-4 sm:w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />

            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="flex items-center gap-7 sm:gap-14 w-max"
            >
              {/* Loop Set 1 */}
              <div className="flex items-center gap-7 sm:gap-14 shrink-0">
                {enterprisePartners.map((partner, idx) => (
                  <div
                    key={`p1-${idx}`}
                    className="cursor-default select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                    title={partner.name}
                  >
                    {partner.render()}
                  </div>
                ))}
              </div>

              {/* Loop Set 2 (Seamless Duplicate) */}
              <div className="flex items-center gap-7 sm:gap-14 shrink-0" aria-hidden="true">
                {enterprisePartners.map((partner, idx) => (
                  <div
                    key={`p2-${idx}`}
                    className="cursor-default select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                    title={partner.name}
                  >
                    {partner.render()}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
