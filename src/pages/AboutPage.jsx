import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Linkedin, Mail } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useCMS } from '../context/CMSContext';
import saharaMarkImg from '../assets/sahara-mark.png';
import KineticTalentPipeline from '../components/KineticTalentPipeline';

// ============================================================================
// DATA: SECTION FOUR — THE PRINCIPLES THAT DEFINE SAHARA
// Spacious horizontal editorial list — modern typography, fine lines, subtle hover
// ============================================================================
const PRINCIPLES = [
  {
    num: '01',
    title: 'People first',
    desc: 'We consider the people behind every role and the teams they become part of.',
  },
  {
    num: '02',
    title: 'Clarity before assumptions',
    desc: 'Understanding the business\u2019s needs is an important starting point for the staffing conversation.',
  },
  {
    num: '03',
    title: 'Meaningful connections',
    desc: 'We focus on relevant professional connections and alignment between people and roles.',
  },
];

// ============================================================================
// DATA: SECTION FIVE — THE SAHARA MINDSET NARRATIVE CHAPTERS
// Pinned scroll-hijacked cinematic storytelling
// ============================================================================
const STORY_CHAPTERS = [
  {
    id: '01',
    badge: 'CHAPTER 01',
    title: 'Understand the people',
    text: 'Every staffing conversation begins with listening and learning about the needs behind the role.',
    image: '/assets/female-executive-beige.jpg',
    fallback: '/assets/card1-staffing.jpg',
    tag: 'Active Discovery',
  },
  {
    id: '02',
    badge: 'CHAPTER 02',
    title: 'See the bigger picture',
    text: 'Business priorities, professional experience, and team needs all contribute to a more informed conversation.',
    image: '/assets/card2-talent.jpg',
    fallback: '/assets/service-workforce.jpg',
    tag: 'Context & Perspective',
  },
  {
    id: '03',
    badge: 'CHAPTER 03',
    title: 'Focus on the connection',
    text: 'The goal is to help businesses and professionals move toward a connection that makes sense for both.',
    image: '/assets/card3-workforce.jpg',
    fallback: '/assets/card1-female-clean.jpg',
    tag: 'Enduring Partnerships',
  },
];

// ============================================================================
// COMPONENT: SECTION FIVE — THE SAHARA MINDSET NARRATIVE CHAPTERS
// Supports two layout engines:
// 1. 'sticky': Interactive pinned scroll-driven storytelling (h-[300vh], top-[100px], h-[calc(100vh-140px)])
// 2. 'grid': Clean 2x2 static grid cards for zero scroll-hijacking
// ============================================================================
function MindsetSection({ chapters = STORY_CHAPTERS, layoutEngine = 'sticky', prefersReducedMotion }) {
  const containerRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const activeChapters = chapters && chapters.length > 0 ? chapters : STORY_CHAPTERS;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const total = activeChapters.length;
      const ch = Math.min(total - 1, Math.floor(latest * total));
      setActiveChapter((prev) => (prev !== ch ? ch : prev));
    });
  }, [scrollYProgress, activeChapters.length]);

  const current = activeChapters[activeChapter] || activeChapters[0];

  // ---------------------------------------------------------------------------
  // LAYOUT ENGINE B: STATIC GRID CARDS (CLEAN 2x2 GRID, NO SCROLL HIJACKING)
  // ---------------------------------------------------------------------------
  if (layoutEngine === 'grid') {
    return (
      <section
        id="about-mindset"
        className="w-full bg-[#FAF9F6] text-[#080B12] border-t border-[#E7E3D9] py-16 sm:py-24 px-5 sm:px-10 lg:px-16"
      >
        <div className="max-w-[1360px] mx-auto space-y-12">
          {/* Section Header */}
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-[1.5px] bg-[#F5A623]" />
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                THE SAHARA MINDSET
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#080B12] tracking-tight leading-tight font-sans">
              A people-centered approach to every search.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              We believe thoughtful staffing is grounded in perspective, patience, and a genuine
              focus on long-term team cohesion.
            </p>
          </div>

          {/* 2x2 Static Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {activeChapters.map((ch, idx) => (
              <div
                key={ch.id || idx}
                className="group relative rounded-[28px] overflow-hidden bg-[#0D111B] shadow-xl p-8 sm:p-10 text-white min-h-[340px] flex flex-col justify-end border border-black/10 transition-all duration-300 hover:shadow-2xl"
              >
                <img
                  src={ch.image}
                  onError={(e) => {
                    e.currentTarget.src = ch.fallback || '/assets/card1-staffing.jpg';
                  }}
                  alt={ch.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/60 to-[#080B12]/20 pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#F5A623] uppercase">
                      {ch.badge || `CHAPTER 0${idx + 1}`}
                    </span>
                    <span className="text-white/40 text-xs">&bull;</span>
                    <span className="text-[11px] text-white/70 font-sans font-medium">
                      {ch.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
                    {ch.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-normal pt-1">
                    {ch.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // LAYOUT ENGINE A: INTERACTIVE STICKY SCROLL-HIJACK (SMOOTH CROSSFADE)
  // Strict Container Fix: h-[300vh] with position: relative
  // Inner Sticky Card Container: position: sticky, top: 100px, h-[calc(100vh-140px)]
  // ---------------------------------------------------------------------------
  return (
    <section
      ref={containerRef}
      id="about-mindset"
      className="relative w-full bg-[#FAF9F6] text-[#080B12] border-t border-[#E7E3D9] h-[300vh]"
    >
      {/* Pinned Sticky Stage */}
      <div className="sticky top-[100px] h-[calc(100vh-140px)] w-full flex items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16">
        <div className="max-w-[1360px] mx-auto w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Fixed Context & Synced Gold Progress Track */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1.5px] bg-[#F5A623]" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                  THE SAHARA MINDSET
                </span>
              </div>

              {/* Anchored Left Statement */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#080B12] tracking-[-0.03em] leading-[1.08] font-sans">
                A people-centered approach to every search.
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans max-w-md font-normal">
                We believe thoughtful staffing is grounded in perspective, patience, and a genuine
                focus on long-term team cohesion.
              </p>

              {/* Gold Progress Track */}
              <div className="flex items-center gap-5 pt-4">
                <div className="flex items-center gap-1.5 font-sans text-xs font-extrabold text-[#B87314]">
                  <span>0{activeChapter + 1}</span>
                  <span className="text-slate-300 font-normal">/</span>
                  <span className="text-slate-400 font-normal">0{activeChapters.length}</span>
                </div>

                {/* Smooth Progress Bar linked to scroll */}
                <div className="relative w-36 sm:w-44 h-[3px] bg-[#E2DBD0] rounded-full overflow-hidden">
                  <motion.div
                    style={{
                      scaleX: scrollYProgress,
                      transformOrigin: 'left',
                    }}
                    className="absolute inset-0 bg-[#F5A623]"
                  />
                </div>

                {/* Active Chapter Label with Smooth Crossfade */}
                <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider transition-colors duration-300">
                  {current?.tag}
                </span>
              </div>
            </div>

            {/* Right Column: Pre-rendered Layered Visual Cards with Fluid Crossfade */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[16/11] min-h-[400px] sm:min-h-[460px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0D111B] shadow-2xl">
                {activeChapters.map((ch, idx) => {
                  const isCurrent = activeChapter === idx;
                  return (
                    <div
                      key={ch.id || idx}
                      className={`absolute inset-0 w-full h-full flex flex-col justify-end p-8 sm:p-12 text-white transition-all duration-700 ease-out ${
                        isCurrent
                          ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                          : 'opacity-0 scale-[0.98] z-0 pointer-events-none'
                      }`}
                    >
                      {/* Photographic Background */}
                      <img
                        src={ch.image}
                        onError={(e) => {
                          e.currentTarget.src = ch.fallback || '/assets/card1-staffing.jpg';
                        }}
                        alt={ch.title}
                        className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.05]"
                      />

                      {/* Cinematic Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/50 to-transparent pointer-events-none" />

                      {/* Overlaid Chapter Content */}
                      <div className="relative z-10 max-w-xl space-y-3">
                        <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-[#F5A623] uppercase block">
                          {ch.badge || `CHAPTER 0${idx + 1}`} &bull; {ch.tag}
                        </span>

                        <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-white font-sans leading-tight">
                          {ch.title}
                        </h3>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-normal pt-1">
                          {ch.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN COMPONENT: SAHARA STAFFING ABOUT PAGE (CINEMATIC REBUILD)
// ============================================================================
export default function AboutPage({ onNavigateContact, onNavigateServices }) {
  const { openModal } = useUI();
  const { content } = useCMS();
  const aboutData = content?.about;
  const heroRef = useRef(null);

  // Viewport & Reduced Motion Detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    return () => {
      motionQuery.removeEventListener('change', motionListener);
    };
  }, []);

  // Section 1: Hero Scroll Parallax
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgParallax = useTransform(
    heroScroll,
    [0, 1],
    !prefersReducedMotion ? ['0%', '16%'] : ['0%', '0%']
  );
  const heroTextParallax = useTransform(
    heroScroll,
    [0, 1],
    !prefersReducedMotion ? ['0%', '-12%'] : ['0%', '0%']
  );

  // Section 2: Perspective Editorial Columns Parallax
  const perspectiveRef = useRef(null);
  const { scrollYProgress: perspectiveScroll } = useScroll({
    target: perspectiveRef,
    offset: ['start end', 'end start'],
  });
  const perspectiveLeftY = useTransform(
    perspectiveScroll,
    [0, 1],
    !prefersReducedMotion ? [25, -25] : [0, 0]
  );
  const perspectiveRightY = useTransform(
    perspectiveScroll,
    [0, 1],
    !prefersReducedMotion ? [-18, 18] : [0, 0]
  );

  // Section 3: Cinematic Human Moment Parallax Window (with safe 140% bleed buffer)
  const humanMomentRef = useRef(null);
  const { scrollYProgress: humanScroll } = useScroll({
    target: humanMomentRef,
    offset: ['start end', 'end start'],
  });
  const humanImgY = useTransform(
    humanScroll,
    [0, 1],
    !prefersReducedMotion ? ['-15%', '15%'] : ['0%', '0%']
  );
  const humanImgScale = useTransform(
    humanScroll,
    [0, 0.5, 1],
    !prefersReducedMotion ? [1.18, 1.12, 1.18] : [1, 1, 1]
  );
  const humanTextY = useTransform(
    humanScroll,
    [0, 1],
    !prefersReducedMotion ? ['18px', '-18px'] : ['0px', '0px']
  );

  const handleContactClick = () => {
    if (onNavigateContact) onNavigateContact();
    else openModal('Discuss Your Hiring Needs');
  };

  return (
    <div className="w-full bg-[#080B12] text-white font-sans selection:bg-[#F5A623] selection:text-[#080B12] overflow-x-clip">
      {/* ===================================================================== */}
      {/* 03. HERO — A DISTINCTIVE FIRST IMPRESSION (DEEP OBSIDIAN #080B12)     */}
      {/* Cinematic, asymmetric composition with line-by-line masked reveals    */}
      {/* ===================================================================== */}
      <section
        id="about-hero"
        ref={heroRef}
        className="relative w-full min-h-[85vh] lg:min-h-[92vh] pt-24 sm:pt-40 lg:pt-44 pb-14 sm:pb-24 px-5 sm:px-10 lg:px-16 flex flex-col justify-center border-b border-white/[0.08] overflow-hidden"
      >
        <div className="max-w-[1360px] mx-auto w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Column: Eyebrow, Line-Masked Headline, Staggered Supporting Copy */}
            <motion.div
              style={{ y: heroTextParallax }}
              className="lg:col-span-7 space-y-5 sm:space-y-8 will-change-transform"
            >
              {/* 1. Eyebrow */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-[1.5px] bg-[#F5A623]" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#F5A623] uppercase font-sans">
                  SAHARA STAFFING INC. / OUR STORY
                </span>
              </motion.div>

              {/* 2. Main Headline (Line-by-Line Masked Reveal) */}
              <h1 className="text-3xl xs:text-5xl sm:text-6xl lg:text-[76px] xl:text-[84px] font-extrabold text-white tracking-[-0.035em] leading-[1.08] sm:leading-[1.03] font-sans">
                <span className="block overflow-hidden">
                  <motion.span
                    initial={prefersReducedMotion ? { y: 0 } : { y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="block"
                  >
                    People make
                  </motion.span>
                </span>
                <span className="block overflow-hidden">
                  <motion.span
                    initial={prefersReducedMotion ? { y: 0 } : { y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="block text-[#F5A623]"
                  >
                    the difference.
                  </motion.span>
                </span>
              </h1>

              {/* 3. Supporting Copy with Slight Stagger */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2.5 sm:space-y-3 pt-1"
              >
                <p className="text-slate-300 text-sm sm:text-xl lg:text-[22px] leading-relaxed font-normal max-w-xl font-sans">
                  We connect businesses with professional talent through a thoughtful,
                  people-centered approach to staffing.
                </p>

                <p className="text-xs sm:text-base font-medium tracking-wide text-[#F5A623]/90 font-sans">
                  Built around people. Focused on possibilities.
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column: High-Resolution Authentic Corporate Photography */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, clipPath: 'inset(10% 0% 10% 0% round 24px)' }
                }
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 32px)' }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ y: heroImgParallax }}
                className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 shadow-[0_28px_72px_rgba(0,0,0,0.65)] bg-[#0D111B] group will-change-transform"
              >
                <img
                  src="/assets/card1-female-clean.jpg"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/service-staffing.jpg';
                  }}
                  alt="Sahara Staffing executive professional"
                  className="w-full h-full object-cover object-top filter grayscale-[15%] contrast-[1.05] group-hover:scale-103 group-hover:grayscale-0 transition-all duration-700 ease-out"
                />

                {/* Subtle Luxury Film Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/85 via-transparent to-transparent pointer-events-none" />

                {/* Lower Inset Details */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-300/90 font-sans pointer-events-none">
                  <span className="font-medium tracking-wide">People-Centered Staffing</span>
                  <span className="text-[#F5A623] font-sans font-semibold text-[11px] uppercase tracking-wider">Sahara Executive</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 04. SECTION TWO — A LARGE EDITORIAL BRAND STATEMENT (WARM CREAM)       */}
      {/* Oversized typography, asymmetrical layout, and generous whitespace    */}
      {/* ===================================================================== */}
      <section
        id="about-philosophy"
        ref={perspectiveRef}
        className="relative w-full bg-[#FAF9F6] text-[#080B12] py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16 border-b border-[#E7E3D9] overflow-hidden"
      >
        <div className="max-w-[1360px] mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <span className="w-6 h-[1.5px] bg-[#F5A623]" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
              OUR PERSPECTIVE
            </span>
          </motion.div>

          {/* Asymmetrical Editorial Composition with Parallax Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Oversized Statement (8 Cols) */}
            <motion.div
              style={{ y: perspectiveLeftY }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 will-change-transform"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-[64px] font-extrabold text-[#080B12] tracking-[-0.035em] leading-[1.18] font-sans">
                Hiring is about people, <br className="hidden sm:block" />
                <span className="text-[#B87314]">not just positions.</span>
              </h2>
            </motion.div>

            {/* Dedicated Reading Column with Counter-Parallax (4 Cols) */}
            <motion.div
              style={{ y: perspectiveRightY }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 lg:pt-3 space-y-5 will-change-transform"
            >
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal font-sans">
                Behind every search is a business objective and a professional’s career. We align both with clarity, precision, and purpose.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 05. SECTION THREE — CINEMATIC HUMAN MOMENT (FULL-BLEED PARALLAX)      */}
      {/* Collaborative team photograph, 140% bleed buffer, optical 3D depth    */}
      {/* ===================================================================== */}
      <section
        ref={humanMomentRef}
        className="relative w-full bg-[#FAF9F6] py-14 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 border-b border-[#E7E3D9] overflow-hidden"
      >
        <div className="max-w-[1360px] mx-auto">
          <div
            style={{
              transform: 'translateZ(0)',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            }}
            className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden bg-[#0D111B] shadow-2xl aspect-[16/10] sm:aspect-[2/1] lg:aspect-[2.3/1] min-h-[440px] sm:min-h-[480px] flex items-end p-8 sm:p-14 lg:p-16 text-white group border-0 outline-none ring-0 isolate"
          >
            {/* Parallax Photographic Layer with Safe 140% Vertical Bleed Buffer */}
            <div className="absolute inset-x-0 -top-[20%] -bottom-[20%] w-full h-[140%] pointer-events-none overflow-hidden">
              <motion.img
                src="/assets/service-workforce.jpg"
                onError={(e) => {
                  e.currentTarget.src = '/assets/card2-talent.jpg';
                }}
                alt="Executive talent and client collaboration"
                style={{ y: humanImgY, scale: humanImgScale }}
                className="w-full h-full object-cover object-center filter contrast-[1.05] will-change-transform"
              />
            </div>

            {/* Cinematic Gradient Vignette Overlay for Crisp Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/45 to-transparent pointer-events-none" />

            {/* Overlay Editorial Content with Counter-Parallax for 3D Depth */}
            <motion.div
              style={{ y: humanTextY }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-w-2xl space-y-3.5 will-change-transform"
            >
              {/* Refined Eyebrow */}
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-[1.5px] bg-[#F5A623]" />
                <span className="text-[11px] font-sans font-bold tracking-[0.24em] text-[#F5A623] uppercase block">
                  THE HUMAN SIDE OF HIRING
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-[-0.03em] leading-[1.12] font-sans">
                Every connection starts with understanding.
              </h2>

              {/* Supporting Text */}
              <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed font-sans max-w-xl font-normal pt-1">
                Recognizing the needs of a business and the potential of people is an important
                part of building meaningful professional connections.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 06. SECTION FOUR — THE PRINCIPLES THAT DEFINE SAHARA (DARK NAVY)      */}
      {/* Clean horizontal editorial list with modern premium typography        */}
      {/* ===================================================================== */}
      <section id="about-benchmarks" className="relative w-full bg-[#0D111B] text-white py-28 sm:py-36 lg:py-40 px-6 sm:px-10 lg:px-16 border-b border-white/[0.08]">
        <div className="max-w-[1360px] mx-auto space-y-16 sm:space-y-20">
          {/* Section Header */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#F5A623]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#F5A623] uppercase font-sans">
                WHAT GUIDES US
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-[-0.03em] leading-[1.08] font-sans">
              A more thoughtful approach.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-2xl pt-1">
              We believe effective staffing begins with understanding the business, respecting the
              people involved, and focusing on meaningful alignment.
            </p>
          </motion.div>

          {/* Horizontal Editorial List (Rows, Not Boxed Cards) */}
          <div className="divide-y divide-white/10 border-y border-white/10">
            {PRINCIPLES.map((item, index) => (
              <motion.div
                key={item.num}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group py-8 sm:py-10 transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-baseline">
                  {/* Modern Premium Gold Number */}
                  <div className="lg:col-span-2 flex items-baseline gap-3">
                    <span className="text-xl sm:text-2xl font-sans font-extrabold text-[#F5A623] tracking-tight">
                      {item.num}
                    </span>
                    <span className="hidden lg:block w-8 h-[2px] bg-white/20 group-hover:w-14 group-hover:bg-[#F5A623] transition-all duration-500 rounded-full" />
                  </div>

                  {/* Principle Heading */}
                  <div className="lg:col-span-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans group-hover:text-[#F5A623] transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {/* Principle Description */}
                  <div className="lg:col-span-6">
                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 07. SECTION FIVE — THE SAHARA MINDSET (SCROLL HIJACK & GRID ENGINES)  */}
      {/* ===================================================================== */}
      <MindsetSection
        chapters={aboutData?.chapters}
        layoutEngine={aboutData?.chaptersLayout}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* ===================================================================== */}
      {/* 08. SECTION SIX — LEADERSHIP COUNCIL                                  */}
      {/* ===================================================================== */}
      <section id="about-leadership" className="relative w-full bg-[#0D111B] text-white py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-b border-white/[0.08]">
        <div className="max-w-[1360px] mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#F5A623]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#F5A623] uppercase font-sans">
                EXECUTIVE STEWARDSHIP
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-[-0.03em] leading-[1.08] font-sans">
              The Leadership Council.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans max-w-2xl">
              Seasoned search practitioners with decades of domain depth in distributed systems, strategic finance, and technical diligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(aboutData?.leadership || [
              {
                id: 'lead-1',
                name: 'Elena Vance',
                title: 'VP of Systems Engineering',
                bio: '14 years leading infrastructure architecture and distributed platform scaling.',
                image: '/assets/female-executive-beige.jpg',
              },
              {
                id: 'lead-2',
                name: 'David Reynolds',
                title: 'Managing Partner, Executive Search',
                bio: 'Specialized in discreet board-level C-Suite and VP appointments.',
                image: '/assets/card2-talent.jpg',
              },
              {
                id: 'lead-3',
                name: 'Marcus Chen',
                title: 'Head of Technical Diligence',
                bio: 'Pioneered peer-level technical assessments for top 2% engineering talent.',
                image: '/assets/card1-staffing.jpg',
              },
            ]).map((leader, idx) => (
              <div
                key={leader.id || idx}
                className="group rounded-3xl bg-[#131926]/80 border border-white/10 p-6 space-y-5 hover:border-[#F5A623]/40 transition-all duration-300 shadow-xl"
              >
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#0B0F17]">
                  <img
                    src={leader.image}
                    onError={(e) => { e.currentTarget.src = '/assets/card1-staffing.jpg'; }}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/90 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white font-sans group-hover:text-[#F5A623] transition-colors">
                      {leader.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[#F5A623] px-2 py-0.5 rounded bg-[#F5A623]/10">
                      PARTNER
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#F5A623] tracking-wide font-sans">
                    {leader.title}
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans pt-1">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 09. SECTION SEVEN — HARD SCALE STATS                                  */}
      {/* ===================================================================== */}
      <section id="about-stats" className="relative w-full bg-[#FAF9F6] text-[#080B12] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-b border-[#E7E3D9]">
        <div className="max-w-[1360px] mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#F5A623]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                MEASURABLE SCALE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#080B12] tracking-tight leading-tight font-sans">
              Proven Velocity at Scale.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {(aboutData?.stats || [
              { value: '500+', label: 'Placements Delivered' },
              { value: '98%', label: 'Retention SLA' },
              { value: '14 Days', label: 'Average Time-to-Fill' },
              { value: '$250M+', label: 'Enterprise Value Backed' },
            ]).map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E7E3D9] shadow-sm space-y-2">
                <span className="text-3xl sm:text-5xl font-extrabold text-[#B87314] tracking-tight font-sans block">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 tracking-wide font-sans block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 10. THE SAHARA PHILOSOPHY (KINETIC TALENT PIPELINE & RADAR)           */}
      {/* ===================================================================== */}
      <KineticTalentPipeline />

      {/* ===================================================================== */}
      {/* 11. SECTION NINE — AN ELEGANT BRAND CLOSING (DEEP OBSIDIAN #080B12)   */}
      {/* ===================================================================== */}
      <section id="about-final-cta" className="relative w-full bg-[#080B12] text-white py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16 text-center overflow-hidden">
        {aboutData?.finalCta?.backgroundImage && (
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <img
              src={aboutData.finalCta.backgroundImage}
              alt="Background overlay"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080B12] via-[#080B12]/80 to-[#080B12]" />
          </div>
        )}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-[880px] mx-auto space-y-7 sm:space-y-8"
        >
          {/* Official Sahara Golden Symbol as Tasteful Signature */}
          <div className="flex justify-center">
            <img
              src={saharaMarkImg}
              alt="Sahara Staffing"
              className="h-9 sm:h-10 w-auto object-contain opacity-90 drop-shadow-[0_4px_16px_rgba(245,166,35,0.25)]"
            />
          </div>

          {/* Eyebrow */}
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#F5A623] uppercase font-sans block">
            SAHARA STAFFING INC.
          </span>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-[62px] font-extrabold text-white tracking-[-0.035em] leading-[1.06] font-sans">
            {aboutData?.finalCta?.headline || "Let's find the right people for your team."}
          </h2>

          {/* Supporting Copy */}
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed font-sans font-normal">
            {aboutData?.finalCta?.subtitle || "Tell us about your business and your hiring needs. Let's start a conversation."}
          </p>

          {/* Single Primary CTA Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={handleContactClick}
              className="bg-[#F5A623] hover:bg-[#F2A51A] text-[#080B12] font-bold text-sm sm:text-base px-9 sm:px-10 py-4 rounded-full inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 group cursor-pointer"
            >
              <span>{aboutData?.finalCta?.buttons?.[0]?.label || 'Discuss Your Hiring Needs'}</span>
              <ArrowRight className="w-4 h-4 text-[#080B12] group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
