import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * SAHARA STAFFING INC. — SERVICES REDESIGN
 * Creative Concept: "PEOPLE, POSITIONED."
 *
 * Visual Rhythm of Alternating Chapters:
 * 1. Introduction: Warm Cream (#F8F6F1) + Industry Expertise
 * 2. Chapter 01 (Permanent Placement): Deep Obsidian (#0B0F17)
 * 3. Chapter 02 (Contract & Temporary Staffing): Warm Cream (#F8F6F1)
 * 4. Chapter 03 (Professional & Executive Search): Deep Obsidian (#0B0F17)
 * 5. The Sahara Approach (How We Work): Warm Cream (#F8F6F1) + Verified Credibility
 * 6. Closing CTA: Luminous Golden Gradient (#FAF9F6 -> #FCEFD2)
 *
 * Natural scrolling throughout — zero scroll-jacking or forced sticky pinning.
 */

// ============================================================================
// COMPONENT: HERO PANORAMIC FRAME WITH SUBTLE PARALLAX & CONTROLLED CROP
// ============================================================================
function HeroPanoramicFrame({
  src,
  fallbackSrc,
  alt,
  isDesktop = false,
  prefersReducedMotion = false,
  children,
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const canParallax = isDesktop && !prefersReducedMotion;
  // Increased, deep cinematic vertical parallax
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    canParallax ? ['-12%', '12%'] : ['0%', '0%']
  );

  return (
    <motion.div
      ref={containerRef}
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, clipPath: 'inset(4% 0% 4% 0% round 20px)' }
      }
      animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
      transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-2xl sm:rounded-[28px] overflow-hidden bg-slate-900 shadow-2xl border border-black/[0.08] aspect-[16/10] sm:aspect-[21/9] max-h-[320px] sm:max-h-[540px] will-change-transform"
    >
      {/* Parallax Container with Extra Vertical Bleed */}
      <div className="absolute inset-x-0 -top-[16%] -bottom-[16%] pointer-events-none">
        <motion.img
          src={src}
          onError={(e) => {
            if (fallbackSrc) e.currentTarget.src = fallbackSrc;
          }}
          alt={alt}
          style={{ y: parallaxY }}
          initial={prefersReducedMotion ? { scale: 1 } : { scale: 1.12 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover object-center will-change-transform"
          loading="eager"
        />
      </div>

      {/* Restrained cinematic film vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/75 via-transparent to-black/10 pointer-events-none" />
      {children}
    </motion.div>
  );
}

// ============================================================================
// COMPONENT: SERVICE PHOTOGRAPH FRAME WITH DISTINCT EDITORIAL REVEAL
// ============================================================================
function ServicePhotoFrame({
  src,
  fallbackSrc,
  alt,
  revealType = 'vertical', // 'vertical' | 'horizontal' | 'aperture'
  aspectRatio = 'aspect-[16/10] sm:aspect-[14/10]',
  className = '',
  isDesktop = false,
  prefersReducedMotion = false,
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const canParallax = isDesktop && !prefersReducedMotion;

  // Custom bounded parallax ranges per reveal type
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    canParallax
      ? revealType === 'vertical'
        ? ['-3%', '3%']
        : revealType === 'horizontal'
        ? ['2.5%', '-2.5%']
        : ['-2%', '2%']
      : ['0%', '0%']
  );

  // Distinct editorial clip-path reveals:
  const clipInitial = prefersReducedMotion
    ? 'inset(0% 0% 0% 0% round 24px)'
    : revealType === 'vertical'
    ? 'inset(0% 0% 10% 0% round 20px)'
    : revealType === 'horizontal'
    ? 'inset(0% 8% 0% 0% round 20px)'
    : 'inset(4% 4% 4% 4% round 20px)';

  const clipFinal = 'inset(0% 0% 0% 0% round 28px)';

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, clipPath: clipInitial }}
      whileInView={{ opacity: 1, clipPath: clipFinal }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl sm:rounded-[28px] overflow-hidden shadow-2xl ${aspectRatio} ${className} will-change-transform`}
    >
      <motion.img
        src={src}
        onError={(e) => {
          if (fallbackSrc) e.currentTarget.src = fallbackSrc;
        }}
        alt={alt}
        style={{ y: parallaxY }}
        initial={prefersReducedMotion ? { scale: 1 } : { scale: 1.07 }}
        whileInView={{ scale: 1.03 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full object-cover object-center will-change-transform"
        loading="lazy"
      />
      {/* Subtle protective vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}

// ============================================================================
// COMPONENT: THE SAHARA APPROACH (STICKY SCROLL REVEAL)
// ============================================================================
function SaharaApproachSection({ isDesktop = false, prefersReducedMotion = false }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const isStickyDesktop = isDesktop && !prefersReducedMotion;

  // Spring-physics smoothing: turns stepped mouse-wheel ticks into liquid-smooth momentum
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.22,
    restDelta: 0.0001,
  });

  // Stage 01 Opacity: Starts crisp, eases gently to 0.55 during new stage reveals,
  // then illuminates back to 1.0 when all 3 stages complete their entrance.
  const stage1Opacity = useTransform(
    smoothProgress,
    [0, 0.18, 0.32, 0.50, 0.64, 0.76, 0.88],
    [1, 1, 0.60, 0.60, 0.50, 0.50, 1]
  );

  // Stage 02: Starts offset below with 0 opacity.
  // Glides up smoothly into place between 0.14 and 0.36.
  const stage2Opacity = useTransform(
    smoothProgress,
    [0.14, 0.22, 0.36, 0.50, 0.64, 0.76, 0.88],
    [0, 0.15, 1, 1, 0.50, 0.50, 1]
  );
  const stage2Y = useTransform(smoothProgress, [0.14, 0.36], [28, 0]);

  // Stage 03: Starts offset below with 0 opacity.
  // Glides up smoothly into place between 0.46 and 0.68.
  const stage3Opacity = useTransform(
    smoothProgress,
    [0.46, 0.54, 0.68, 0.76, 1],
    [0, 0.15, 1, 1, 1]
  );
  const stage3Y = useTransform(smoothProgress, [0.46, 0.68], [28, 0]);

  // Fluid hairline divider drawing animations
  const divider2Scale = useTransform(smoothProgress, [0.14, 0.32], [0, 1]);
  const divider2Opacity = useTransform(smoothProgress, [0.14, 0.24], [0, 1]);

  const divider3Scale = useTransform(smoothProgress, [0.46, 0.64], [0, 1]);
  const divider3Opacity = useTransform(smoothProgress, [0.46, 0.56], [0, 1]);

  // Subtle fluid vertical drift for right column
  const rightColumnY = useTransform(smoothProgress, [0, 0.85], [16, -8]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-[#F8F6F1] text-[#0B0F17] border-t border-[#E7E3D9] selection:bg-[#E69D2B] selection:text-[#0B0F17] ${
        isStickyDesktop ? 'lg:h-[260vh]' : 'py-24 sm:py-32'
      }`}
    >
      <div
        className={`w-full px-6 sm:px-10 lg:px-16 ${
          isStickyDesktop
            ? 'lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center overflow-hidden py-24 lg:py-0'
            : ''
        }`}
      >
        <div className="max-w-[1360px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start lg:items-center">
            {/* Left Column (lg:col-span-5): Section Title, Narrative & Verified Guarantee (Fixed/Stopped) */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-[1.5px] bg-[#B87314]" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                  THE SAHARA APPROACH
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F17] tracking-[-0.03em] leading-[1.12] font-sans"
              >
                Good hiring starts with <span className="text-[#B87314]">understanding.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.16, ease: 'easeOut' }}
                className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed font-sans max-w-md"
              >
                Every hiring need is different. We start by understanding your requirements and work
                toward connecting your business with relevant talent.
              </motion.p>

              {/* Verified Direct-Hire Guarantee Reassurance (Zero Yellow Dots) */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className="pt-6 border-t border-[#E7E3D9] space-y-1.5 text-xs font-sans text-slate-600"
              >
                <div className="text-slate-900 font-semibold tracking-tight">
                  100% 90-Day Candidate Replacement Guarantee
                </div>
              </motion.div>
            </div>

            {/* Right Column (lg:col-span-7): Refined Sequential Editorial Flow */}
            <motion.div
              style={isStickyDesktop ? { y: rightColumnY } : undefined}
              className="lg:col-span-7 border-t border-b border-[#E7E3D9]"
            >
              {/* Stage 01 */}
              <motion.div
                style={isStickyDesktop ? { opacity: stage1Opacity } : undefined}
                initial={!isStickyDesktop ? { opacity: 0, y: 16 } : undefined}
                whileInView={!isStickyDesktop ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="py-7 sm:py-9 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline transition-opacity duration-300"
              >
                <div className="sm:col-span-2 flex items-baseline gap-1 font-sans">
                  <span className="text-xs sm:text-[13px] font-semibold text-[#B87314] tracking-wider">
                    01
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal tracking-wide">
                    / 03
                  </span>
                </div>
                <div className="sm:col-span-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0B0F17] tracking-tight font-sans">
                    Understand
                  </h3>
                </div>
                <div className="sm:col-span-6">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    Learn about your role, team, requirements, and hiring priorities.
                  </p>
                </div>
              </motion.div>

              {/* Hairline Divider 1 -> 2 with Smooth Drawing Expansion */}
              <motion.div
                style={
                  isStickyDesktop
                    ? {
                        scaleX: divider2Scale,
                        opacity: divider2Opacity,
                        transformOrigin: 'left',
                      }
                    : undefined
                }
                className="h-[1px] w-full bg-[#E7E3D9]"
              />

              {/* Stage 02 */}
              <motion.div
                style={
                  isStickyDesktop
                    ? { opacity: stage2Opacity, y: stage2Y }
                    : undefined
                }
                initial={!isStickyDesktop ? { opacity: 0, y: 16 } : undefined}
                whileInView={!isStickyDesktop ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="py-7 sm:py-9 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
              >
                <div className="sm:col-span-2 flex items-baseline gap-1 font-sans">
                  <span className="text-xs sm:text-[13px] font-semibold text-[#B87314] tracking-wider">
                    02
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal tracking-wide">
                    / 03
                  </span>
                </div>
                <div className="sm:col-span-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0B0F17] tracking-tight font-sans">
                    Identify
                  </h3>
                </div>
                <div className="sm:col-span-6">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    Focus on candidates whose experience and capabilities align with the role.
                  </p>
                </div>
              </motion.div>

              {/* Hairline Divider 2 -> 3 with Smooth Drawing Expansion */}
              <motion.div
                style={
                  isStickyDesktop
                    ? {
                        scaleX: divider3Scale,
                        opacity: divider3Opacity,
                        transformOrigin: 'left',
                      }
                    : undefined
                }
                className="h-[1px] w-full bg-[#E7E3D9]"
              />

              {/* Stage 03 */}
              <motion.div
                style={
                  isStickyDesktop
                    ? { opacity: stage3Opacity, y: stage3Y }
                    : undefined
                }
                initial={!isStickyDesktop ? { opacity: 0, y: 16 } : undefined}
                whileInView={!isStickyDesktop ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="py-7 sm:py-9 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
              >
                <div className="sm:col-span-2 flex items-baseline gap-1 font-sans">
                  <span className="text-xs sm:text-[13px] font-semibold text-[#B87314] tracking-wider">
                    03
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal tracking-wide">
                    / 03
                  </span>
                </div>
                <div className="sm:col-span-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0B0F17] tracking-tight font-sans">
                    Connect
                  </h3>
                </div>
                <div className="sm:col-span-6">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    Help move the hiring conversation forward with relevant talent.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN SERVICES PAGE COMPONENT
// ============================================================================
export default function ServicesPage({ onNavigateContact, onNavigate }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    // Check desktop viewport for restrained parallax
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => {
      motionQuery.removeEventListener('change', motionListener);
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  const handleInquiry = (serviceName) => {
    if (onNavigateContact) {
      onNavigateContact({
        staffingNeed: serviceName,
        hiringRequirements: `Inquiry regarding Sahara ${serviceName} solutions.`,
      });
    } else if (onNavigate) {
      onNavigate('contact');
    } else {
      window.location.hash = 'contact';
    }
  };

  const handleGeneralInquiry = () => {
    if (onNavigateContact) {
      onNavigateContact({
        staffingNeed: 'Permanent Staffing',
        hiringRequirements: 'General hiring inquiry via Services overview.',
      });
    } else if (onNavigate) {
      onNavigate('contact');
    } else {
      window.location.hash = 'contact';
    }
  };

  return (
    <div className="w-full bg-[#F8F6F1] text-[#0B0F17] font-sans selection:bg-[#E69D2B] selection:text-[#0B0F17]">
      {/* ===================================================================== */}
      {/* CHAPTER ONE: HERO INTRODUCTION (Warm Cream #F8F6F1)                   */}
      {/* ===================================================================== */}
      <section className="relative w-full pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 px-6 sm:px-10 lg:px-16 border-b border-[#E7E3D9]">
        <div className="max-w-[1360px] mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
              SAHARA STAFFING INC. / OUR SERVICES
            </span>
          </motion.div>

          {/* Editorial Two-Column Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-12 sm:mb-16 lg:mb-20">
            {/* Left Column: Primary Headline (Subtle directional reveal) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold text-[#0B0F17] tracking-[-0.035em] leading-[1.03] font-sans">
                People are the <br className="hidden sm:block" />
                <span className="text-[#B87314]">difference.</span>
              </h1>
            </motion.div>

            {/* Right Column: Stable, immediately readable supporting text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
              className="lg:col-span-5 flex flex-col justify-between pt-2 sm:pt-3 space-y-5"
            >
              <p className="text-slate-700 text-lg sm:text-xl font-normal leading-relaxed font-sans">
                &ldquo;Great teams don&rsquo;t happen by accident. We help businesses find the people
                they need to move forward.&rdquo;
              </p>

              <div className="pt-1 text-xs text-slate-500 font-medium tracking-wide">
                <span>Direct Hire</span>
                <span className="mx-2.5 text-slate-300">•</span>
                <span>Contract &amp; Interim</span>
                <span className="mx-2.5 text-slate-300">•</span>
                <span>Executive Search</span>
              </div>
            </motion.div>
          </div>

          {/* Panoramic Corporate Photographic Feature with Subtle Parallax & Crop Reveal */}
          <HeroPanoramicFrame
            src="/assets/card3-workforce.jpg"
            fallbackSrc="/assets/service-workforce.jpg"
            alt="Sahara Staffing recruitment professionals collaborating in a modern workplace"
            isDesktop={isDesktop}
            prefersReducedMotion={prefersReducedMotion}
          >
            <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-8 right-5 sm:right-8 flex items-center justify-between text-white z-10 pointer-events-none">
              <span className="text-[11px] sm:text-xs text-white/80 font-medium tracking-wide">
                Strategic talent placement across US technology, finance, and enterprise operations.
              </span>
              <span className="hidden sm:inline-block text-[10px] text-[#E69D2B] tracking-widest uppercase font-semibold">
                Sahara Staffing Inc.
              </span>
            </div>
          </HeroPanoramicFrame>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 01: PERMANENT PLACEMENT (Deep Obsidian #0B0F17)              */}
      {/* ===================================================================== */}
      <section className="relative w-full bg-[#0B0F17] text-white py-14 sm:py-28 lg:py-36 px-5 sm:px-10 lg:px-16 selection:bg-[#E69D2B] selection:text-[#0B0F17]">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left: Typography & Generous Negative Space */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 lg:pr-6">
              {/* Editorial Marker & Category */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-sans font-bold text-[#E69D2B] tracking-wider">
                  01
                </span>
                <span className="w-6 h-[1px] bg-white/20" />
                <span className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                  PERMANENT PLACEMENT
                </span>
              </motion.div>

              {/* Main Headline (Subtle directional reveal) */}
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl xs:text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] font-sans"
              >
                Built for the <br className="hidden sm:block" />
                <span className="text-[#E69D2B]">long term.</span>
              </motion.h2>

              {/* Concise Supporting Copy (Stable, immediately readable) */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl font-sans"
              >
                Connect with people who can grow with your business through thoughtful, full-time
                recruitment.
              </motion.p>

              {/* Restrained Action Link */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="pt-4"
              >
                <button
                  type="button"
                  onClick={() => handleInquiry('Permanent Placement')}
                  className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white hover:text-[#E69D2B] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="border-b border-white/30 group-hover:border-[#E69D2B] pb-0.5 transition-colors">
                    Inquire About Permanent Placement
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>

            {/* Right: Large Editorial Photograph (Reveal 1: Vertical Curtain Crop) */}
            <div className="lg:col-span-6">
              <ServicePhotoFrame
                src="/assets/card2-talent.jpg"
                fallbackSrc="/assets/service-talent.jpg"
                alt="Business professional discussing long-term career growth in a modern office"
                revealType="vertical"
                className="bg-slate-800 border border-white/[0.08] max-h-[500px]"
                isDesktop={isDesktop}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 02: CONTRACT & TEMPORARY STAFFING (Warm Cream #F8F6F1)       */}
      {/* ===================================================================== */}
      <section className="relative w-full bg-[#F8F6F1] text-[#0B0F17] py-14 sm:py-28 lg:py-36 px-5 sm:px-10 lg:px-16 border-y border-[#E7E3D9]">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left: Asymmetric Photograph on the Left (Reveal 2: Horizontal Editorial Aperture) */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <ServicePhotoFrame
                src="/assets/service-staffing.jpg"
                fallbackSrc="/assets/card1-staffing.jpg"
                alt="Agile engineering and operational team collaborating on project sprint"
                revealType="horizontal"
                className="bg-slate-200 border border-black/[0.08] max-h-[500px]"
                isDesktop={isDesktop}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            {/* Right: Typography on the Right */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 sm:space-y-6 lg:pl-6">
              {/* Editorial Marker & Category */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-sans font-bold text-[#B87314] tracking-wider">
                  02
                </span>
                <span className="w-6 h-[1px] bg-black/15" />
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#0B0F17]/70 uppercase">
                  CONTRACT &amp; TEMPORARY STAFFING
                </span>
              </motion.div>

              {/* Main Headline (Subtle directional reveal) */}
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl xs:text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0B0F17] tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] font-sans"
              >
                Ready for <br className="hidden sm:block" />
                <span className="text-[#B87314]">what&rsquo;s next.</span>
              </motion.h2>

              {/* Concise Supporting Copy (Stable, immediately readable) */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-slate-700 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl font-sans"
              >
                Find flexible staffing support for changing workloads, temporary coverage, and
                evolving project needs.
              </motion.p>

              {/* Restrained Action Link */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 sm:pt-4"
              >
                <button
                  type="button"
                  onClick={() => handleInquiry('Contract Staffing')}
                  className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#0B0F17] hover:text-[#B87314] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="border-b border-[#0B0F17]/30 group-hover:border-[#B87314] pb-0.5 transition-colors">
                    Inquire About Flexible Staffing
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 03: PROFESSIONAL & EXECUTIVE SEARCH (Deep Obsidian #0B0F17)  */}
      {/* ===================================================================== */}
      <section className="relative w-full bg-[#0B0F17] text-white py-14 sm:py-28 lg:py-36 px-5 sm:px-10 lg:px-16 selection:bg-[#E69D2B] selection:text-[#0B0F17]">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left: Culminating Typography */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 lg:pr-6">
              {/* Editorial Marker & Category */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-sans font-bold text-[#E69D2B] tracking-wider">
                  03
                </span>
                <span className="w-6 h-[1px] bg-white/20" />
                <span className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                  PROFESSIONAL &amp; EXECUTIVE SEARCH
                </span>
              </motion.div>

              {/* Main Headline (Subtle directional reveal) */}
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl xs:text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] font-sans"
              >
                Experience that moves <br className="hidden sm:block" />
                <span className="text-[#E69D2B]">business forward.</span>
              </motion.h2>

              {/* Concise Supporting Copy (Stable, immediately readable) */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl font-sans"
              >
                Connect with experienced professionals and leadership talent aligned with your
                business&rsquo;s next stage.
              </motion.p>

              {/* Restrained Action Link */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="pt-4"
              >
                <button
                  type="button"
                  onClick={() => handleInquiry('Executive Search')}
                  className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white hover:text-[#E69D2B] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="border-b border-white/30 group-hover:border-[#E69D2B] pb-0.5 transition-colors">
                    Inquire About Executive Search
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>

            {/* Right: Refined Leadership Photography (Reveal 3: Symmetric Focus Aperture) */}
            <div className="lg:col-span-6">
              <ServicePhotoFrame
                src="/assets/card1-exec-clean.jpg"
                fallbackSrc="/assets/talent-exec.jpg"
                alt="Experienced corporate executive leader in an architectural office setting"
                revealType="aperture"
                className="bg-slate-800 border border-white/[0.08] max-h-[500px]"
                isDesktop={isDesktop}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* THE SAHARA APPROACH: HOW WE WORK (Sticky Scroll Pinned Sequence)     */}
      {/* ===================================================================== */}
      <SaharaApproachSection
        isDesktop={isDesktop}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* ===================================================================== */}
      {/* CHAPTER FOUR: CLOSING CALL TO ACTION (Luminous Golden Gradient)      */}
      {/* ===================================================================== */}
      <section className="relative w-full py-16 sm:py-36 lg:py-40 px-5 sm:px-10 lg:px-16 overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-white to-[#FCEFD2] text-center border-t border-[#DDD7CC] selection:bg-[#E69D2B] selection:text-[#0B0F17]">
        {/* Ambient Breathing Warm Gold Glow Layers (Identical to Home CTA Section) */}
        <div className="animate-breathe absolute bottom-0 inset-x-0 h-[640px] bg-gradient-to-t from-saharaGold/35 via-saharaGold/15 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 inset-x-0 h-80 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(230,157,43,0.38),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-[960px] mx-auto space-y-5 sm:space-y-7">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
              SAHARA STAFFING INC. / GET STARTED
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="text-2xl xs:text-3xl sm:text-5xl lg:text-[58px] font-extrabold text-[#0B0F17] tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] font-sans"
          >
            A better hiring conversation <br className="hidden sm:block" />
            starts here.
          </motion.h2>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-slate-600 text-sm sm:text-lg font-normal max-w-xl mx-auto leading-relaxed font-sans"
          >
            &ldquo;Tell us what your team needs. Let&rsquo;s discuss a staffing approach that fits
            your hiring goals.&rdquo;
          </motion.p>

          {/* Primary Sahara Brand Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="pt-2 sm:pt-4 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={handleGeneralInquiry}
              className="btn-shimmer w-full sm:w-auto justify-center bg-[#0B0F17] hover:bg-[#E69D2B] hover:text-[#0B0F17] text-white font-semibold text-xs sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2.5 shadow-xl transition-all duration-300 active:scale-95 group cursor-pointer"
            >
              <span>Discuss Your Hiring Needs</span>
              <ArrowRight className="w-4 h-4 text-[#E69D2B] group-hover:text-[#0B0F17] transition-colors" />
            </button>
          </motion.div>

          {/* Verified Direct Contact Reassurance */}
         
        </div>
      </section>
    </div>
  );
}
