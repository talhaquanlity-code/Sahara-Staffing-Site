import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
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
// COMPONENT: SECTION FIVE — THE SAHARA MINDSET PINNED SCROLL STORYTELLING
// Restored pinned scroll-hijacking: GPU-smooth pre-rendered card crossfades
// ============================================================================
function MindsetPinnedScrollSection({ prefersReducedMotion }) {
  const containerRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Maps 0.0 -> 1.0 cleanly across 3 chapters without lag or glitches
      const ch = latest < 0.33 ? 0 : latest < 0.67 ? 1 : 2;
      setActiveChapter((prev) => (prev !== ch ? ch : prev));
    });
  }, [scrollYProgress]);

  const current = STORY_CHAPTERS[activeChapter];

  // Mobile Presentation: clean natural card sequence without sticky pinning
  if (!isDesktop) {
    return (
      <section
        id="about-mindset"
        className="w-full bg-[#FAF9F6] text-[#080B12] border-t border-[#E7E3D9] py-14 sm:py-20 px-5 sm:px-8"
      >
        <div className="max-w-xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-[1.5px] bg-[#F5A623]" />
              <span className="text-[11px] font-bold tracking-[0.24em] text-[#B87314] uppercase font-sans">
                THE SAHARA MINDSET
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080B12] tracking-tight leading-tight font-sans">
              A people-centered approach to every search.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
              We believe thoughtful staffing is grounded in perspective, patience, and a genuine
              focus on long-term team cohesion.
            </p>
          </div>

          <div className="space-y-4">
            {STORY_CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                className="relative rounded-2xl overflow-hidden bg-[#0D111B] shadow-xl p-5 sm:p-7 text-white min-h-[250px] flex flex-col justify-end border border-black/10"
              >
                <img
                  src={ch.image}
                  onError={(e) => {
                    e.currentTarget.src = ch.fallback;
                  }}
                  alt={ch.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/60 to-[#080B12]/20 pointer-events-none" />
                <div className="relative z-10 space-y-1.5">
                  <span className="text-[10.5px] font-sans font-bold tracking-[0.2em] text-[#F5A623] uppercase block">
                    {ch.badge} &bull; {ch.tag}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white font-sans">
                    {ch.title}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">
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

  return (
    <section
      ref={containerRef}
      id="about-mindset"
      className="relative w-full bg-[#FAF9F6] text-[#080B12] border-t border-[#E7E3D9] h-[220vh] sm:h-[240vh]"
    >
      {/* Pinned Sticky Stage */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16">
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

              {/* Gold Progress Track (Matches Screenshot: 01 / 03  ━━━━  ACTIVE DISCOVERY & ALIGNMENT) */}
              <div className="flex items-center gap-5 pt-4">
                <div className="flex items-center gap-1.5 font-sans text-xs font-extrabold text-[#B87314]">
                  <span>0{activeChapter + 1}</span>
                  <span className="text-slate-300 font-normal">/</span>
                  <span className="text-slate-400 font-normal">03</span>
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
                  {current.tag}
                </span>
              </div>
            </div>

            {/* Right Column: Pre-rendered Layered Visual Cards (No mode="wait" tearing) */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[16/11] min-h-[420px] sm:min-h-[480px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0D111B] shadow-2xl">
                {STORY_CHAPTERS.map((ch, idx) => {
                  const isCurrent = activeChapter === idx;
                  return (
                    <div
                      key={ch.id}
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
                          e.currentTarget.src = ch.fallback;
                        }}
                        alt={ch.title}
                        className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.05]"
                      />

                      {/* Cinematic Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/50 to-transparent pointer-events-none" />

                      {/* Overlaid Chapter Content */}
                      <div className="relative z-10 max-w-xl space-y-3">
                        <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-[#F5A623] uppercase block">
                          {ch.badge} - {ch.tag}
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
      <section className="relative w-full bg-[#0D111B] text-white py-28 sm:py-36 lg:py-40 px-6 sm:px-10 lg:px-16 border-b border-white/[0.08]">
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
      {/* 07. SECTION FIVE — THE SAHARA MINDSET (PINNED SCROLL HIJACKING)       */}
      {/* ===================================================================== */}
      <MindsetPinnedScrollSection prefersReducedMotion={prefersReducedMotion} />

      {/* ===================================================================== */}
      {/* 08. THE SAHARA PHILOSOPHY (KINETIC TALENT PIPELINE & RADAR)           */}
      {/* ===================================================================== */}
      <KineticTalentPipeline />

      {/* ===================================================================== */}
      {/* 08. SECTION SIX — AN ELEGANT BRAND CLOSING (DEEP OBSIDIAN #080B12)    */}
      {/* Strong editorial typography, single primary CTA, official mark       */}
      {/* ===================================================================== */}
      <section className="relative w-full bg-[#080B12] text-white py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16 text-center overflow-hidden">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[880px] mx-auto space-y-7 sm:space-y-8"
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
            Let&rsquo;s find the right people <br className="hidden sm:block" />
            <span className="text-[#F5A623]">for your team.</span>
          </h2>

          {/* Supporting Copy */}
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed font-sans font-normal">
            Tell us about your business and your hiring needs. Let&rsquo;s start a conversation.
          </p>

          {/* Single Primary CTA Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={handleContactClick}
              className="bg-[#F5A623] hover:bg-[#F2A51A] text-[#080B12] font-bold text-sm sm:text-base px-9 sm:px-10 py-4 rounded-full inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 group cursor-pointer"
            >
              <span>Discuss Your Hiring Needs</span>
              <ArrowRight className="w-4 h-4 text-[#080B12] group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>

          {/* Direct Communication Details */}
         
        </motion.div>
      </section>
    </div>
  );
}
