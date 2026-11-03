import React, { useRef, useState } from 'react';
import { motion, useSpring, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useCMS } from '../context/CMSContext';

// ---------------------------------------------------------------------------
// STAFFING SOLUTIONS DATA
// ---------------------------------------------------------------------------
const staffingSolutions = [
  {
    id: '01',
    tag: '01 - CONTRACT & INTERIM',
    title: 'Flexible Staffing',
    subtitle: 'Rapid deployment of specialized contract talent, fractional engineering, and interim leadership.',
    image: '/assets/card1-female-clean.jpg',
    fallbackImage: '/assets/card1-exec-clean.jpg',
    modalTitle: 'Flexible Staffing Solutions',
  },
  {
    id: '02',
    tag: '02 - LEADERSHIP & C-SUITE',
    title: 'Executive Search',
    subtitle: 'Direct-hire placement for VP and C-suite leaders who redefine markets and scale valuation.',
    image: '/assets/card2-talent.jpg',
    fallbackImage: '/assets/talent-exec.jpg',
    modalTitle: 'Executive Search & Leadership',
  },
  {
    id: '03',
    tag: '03 - TECHNICAL DILIGENCE',
    title: 'Specialized Technical Teams',
    subtitle: 'Top 2% vetted AI architects, systems leads, and principal engineers ready for immediate sprint integration.',
    image: '/assets/talent-ai.jpg',
    fallbackImage: '/assets/card1-exec-clean.jpg',
    modalTitle: 'Specialized Technical Teams',
  },
  {
    id: '04',
    tag: '04 - ENTERPRISE RPO',
    title: 'Workforce Solutions',
    subtitle: 'End-to-end recruitment process outsourcing engineered for fast-growing ventures and enterprise scale.',
    image: '/assets/card3-workforce.jpg',
    fallbackImage: '/assets/service-workforce.jpg',
    modalTitle: 'Enterprise RPO & Workforce Solutions',
  },
];

// ---------------------------------------------------------------------------
// 3D TILT + SCROLL PARALLAX BENTO CARD COMPONENT
// ---------------------------------------------------------------------------
function BentoCard({
  tag,
  title,
  subtitle,
  image,
  fallbackImage,
  className = '',
  orientation = 'vertical', // 'vertical' or 'horizontal'
  scrollYProgress,
  scrollParallaxRange = ['-8%', '8%'],
  columnY,
  onClick,
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth spring physics for 3D cursor tilt & mouse parallax
  const rotateX = useSpring(0, { damping: 22, stiffness: 200 });
  const rotateY = useSpring(0, { damping: 22, stiffness: 200 });
  const mouseImgX = useSpring(0, { damping: 22, stiffness: 200 });
  const mouseImgY = useSpring(0, { damping: 22, stiffness: 200 });

  // Scroll parallax for the background image inside the frame
  const imgScrollY = useTransform(
    scrollYProgress,
    [0, 1],
    scrollParallaxRange
  );

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized spotlight coordinates (0 - 100%)
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });

    // Normalized coordinates (-1 to 1) for 3D tilt
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    rotateX.set(-normY * 5);
    rotateY.set(normX * 5);
    mouseImgX.set(normX * -10);
    mouseImgY.set(normY * -10);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    mouseImgX.set(0);
    mouseImgY.set(0);
  };

  return (
    <motion.div
      style={{ y: columnY }}
      className={`h-full ${className}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ perspective: 1000 }}
        className="group cursor-pointer select-none w-full h-full"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full rounded-[28px] sm:rounded-[32px] overflow-hidden border border-slate-200/90 hover:border-[#E69D2B]/70 bg-[#0B0F17] transition-colors duration-500 shadow-xl flex flex-col justify-between p-7 sm:p-8"
        >
          {/* Hardware-Accelerated Parallax Image Background (Oversized for Scroll Parallax) */}
          <div className="absolute inset-[-10%] z-0 overflow-hidden pointer-events-none">
            <motion.img
              src={image}
              onError={(e) => {
                if (fallbackImage) e.currentTarget.src = fallbackImage;
              }}
              alt={title}
              style={{
                x: mouseImgX,
                y: imgScrollY,
                scale: isHovered ? 1.08 : 1.03,
              }}
              transition={{
                scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              }}
              className="w-full h-full object-cover object-center will-change-transform"
            />

            {/* Luxury Filmic Gradient Vignette */}
            {orientation === 'vertical' ? (
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/55 to-[#0B0F17]/20 transition-opacity duration-500" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/75 to-[#0B0F17]/35 transition-opacity duration-500" />
            )}

            {/* Interactive Specular Spotlight Following Cursor */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle 320px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.12), transparent 70%)`,
              }}
            />
          </div>

          {/* Top Header: Understated Index & Category Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-widest text-[#E69D2B] uppercase font-sans">
              {tag}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-[#E69D2B] group-hover:text-[#0B0F17] group-hover:border-[#E69D2B] transition-all duration-300">
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Bottom Content: Clean, Confident Title & Subtitle */}
          <div className="relative z-10 space-y-2 max-w-md">
            <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-tight font-sans transition-transform duration-300 group-hover:translate-x-0.5">
              {title}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans line-clamp-2">
              {subtitle}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// MAIN BENTO GROWTH CAPITAL SECTION WITH SCROLL PARALLAX
// ---------------------------------------------------------------------------
export default function BentoGrowthCapital({ onNavigateService }) {
  const { openModal } = useUI();
  const { content } = useCMS();
  const cmsImages = content?.images || {};
  const cmsServices = content?.services || [];

  const activeStaffingSolutions = [
    {
      id: '01',
      tag: cmsServices[0]?.badge || '01 - CONTRACT & INTERIM',
      title: cmsServices[0]?.title || 'Flexible Staffing',
      subtitle: cmsServices[0]?.description || staffingSolutions[0].subtitle,
      image: cmsImages.bentoCard1 || cmsServices[0]?.image || staffingSolutions[0].image,
      fallbackImage: staffingSolutions[0].fallbackImage,
      modalTitle: 'Flexible Staffing Solutions',
    },
    {
      id: '02',
      tag: cmsServices[1]?.badge || '02 - LEADERSHIP & C-SUITE',
      title: cmsServices[1]?.title || 'Executive Search',
      subtitle: cmsServices[1]?.description || staffingSolutions[1].subtitle,
      image: cmsImages.bentoCard2 || cmsServices[1]?.image || staffingSolutions[1].image,
      fallbackImage: staffingSolutions[1].fallbackImage,
      modalTitle: 'Executive Search & Leadership',
    },
    {
      id: '03',
      tag: cmsServices[2]?.badge || '03 - TECHNICAL DILIGENCE',
      title: cmsServices[2]?.title || 'Specialized Technical Teams',
      subtitle: cmsServices[2]?.description || staffingSolutions[2].subtitle,
      image: cmsImages.bentoCard3 || cmsServices[2]?.image || staffingSolutions[2].image,
      fallbackImage: staffingSolutions[2].fallbackImage,
      modalTitle: 'Specialized Technical Teams',
    },
    {
      id: '04',
      tag: cmsServices[3]?.badge || '04 - ENTERPRISE RPO',
      title: cmsServices[3]?.title || 'Workforce Solutions',
      subtitle: cmsServices[3]?.description || staffingSolutions[3].subtitle,
      image: cmsImages.bentoCard4 || cmsServices[3]?.image || staffingSolutions[3].image,
      fallbackImage: staffingSolutions[3].fallbackImage,
      modalTitle: 'Enterprise RPO & Workforce Solutions',
    },
  ];

  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const cardWidth = 300;
    const index = Math.round(scrollLeft / (cardWidth + 14));
    setActiveSlide(Math.min(activeStaffingSolutions.length - 1, Math.max(0, index)));
  };

  const scrollToSlide = (idx) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.children;
    if (cards[idx]) {
      cards[idx].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      setActiveSlide(idx);
    }
  };

  // Track scroll progress across the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Staggered column vertical parallax offsets (gives multiplane depth on scroll)
  const yCard1 = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const yCard4 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const handleServicesClick = () => {
    if (onNavigateService) {
      onNavigateService('services');
    } else {
      window.location.hash = 'services';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="capital-section"
      className="relative z-20 bg-gradient-to-b from-[#F1F4F9] via-[#F7F9FC] to-[#EDF2F7] text-[#0B0F17] py-14 sm:py-24 lg:py-28 font-sans selection:bg-[#E69D2B] selection:text-[#0B0F17] overflow-hidden"
    >
      {/* Subtle Warm Ambient Top Glow */}
      <div className="absolute top-0 inset-x-0 h-48 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(230,157,43,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. SECTION HEADER                                                         */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.8 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 sm:gap-6 mb-8 sm:mb-12"
        >
          {/* Left Column */}
          <div className="max-w-2xl space-y-2.5">
            <span className="text-[#B87314] text-xs font-bold tracking-wider uppercase font-sans">
              STAFFING SOLUTIONS
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[#0B0F17] leading-[1.15] sm:leading-[1.1] font-sans">
              Exceptional <span className="text-[#B87314]">Talent.</span> Built Around Your Business.
            </h2>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start lg:items-end gap-3.5 sm:gap-4">
            <p className="text-slate-600 text-xs sm:text-sm max-w-sm lg:text-right leading-relaxed font-sans">
              Connect with pre-vetted professionals and build stronger teams through recruitment
              solutions designed around your business.
            </p>

            <button
              onClick={handleServicesClick}
              className="bg-[#0B0F17] hover:bg-[#E69D2B] hover:text-[#0B0F17] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-semibold transition-all duration-300 shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95 group font-sans"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. MOBILE SWIPEABLE CAROUSEL (< md)                                       */}
        {/* ========================================================================= */}
        <div className="block md:hidden">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-4 -mx-5 px-5 scrollbar-none scroll-smooth touch-pan-x"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {activeStaffingSolutions.map((item) => (
              <div
                key={item.id}
                onClick={() => openModal(item.modalTitle)}
                className="w-[84vw] max-w-[320px] h-[390px] shrink-0 snap-center rounded-[24px] overflow-hidden border border-slate-200/90 bg-[#0B0F17] shadow-xl relative flex flex-col justify-between p-6 select-none cursor-pointer active:scale-[0.98] transition-transform duration-200"
              >
                {/* Background Image & Vignette */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={item.image}
                    onError={(e) => {
                      if (item.fallbackImage) e.currentTarget.src = item.fallbackImage;
                    }}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/65 to-[#0B0F17]/25" />
                </div>

                {/* Top Header: Tag & Arrow Action */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10.5px] font-semibold tracking-widest text-[#E69D2B] uppercase font-sans">
                    {item.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Content: Title & Subtitle */}
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight leading-tight font-sans">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans line-clamp-3">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dot Indicators & Hint */}
          <div className="flex items-center justify-between pt-3 px-1">
            <div className="flex items-center gap-1.5">
              {activeStaffingSolutions.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to staffing solution ${idx + 1}`}
                  onClick={() => scrollToSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx
                      ? 'w-6 bg-[#E69D2B]'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1 font-sans">
              Swipe to explore &rarr;
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DESKTOP 4-CARD BENTO GRID WITH MULTIPLANE SCROLL PARALLAX (md+)       */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-7 lg:gap-5 w-full"
        >
          {/* --------------------------------------------------------------------- */}
          {/* CARD 1: VERTICAL 1 (LEFT FLANK - 3 COLS)                              */}
          {/* --------------------------------------------------------------------- */}
          <BentoCard
            tag={activeStaffingSolutions[0].tag}
            title={activeStaffingSolutions[0].title}
            subtitle={activeStaffingSolutions[0].subtitle}
            image={activeStaffingSolutions[0].image}
            fallbackImage={activeStaffingSolutions[0].fallbackImage}
            orientation="vertical"
            scrollYProgress={scrollYProgress}
            scrollParallaxRange={['-10%', '10%']}
            columnY={yCard1}
            className="lg:col-span-3 h-[480px] sm:h-[510px] lg:h-[540px]"
            onClick={() => openModal(activeStaffingSolutions[0].modalTitle)}
          />

          {/* --------------------------------------------------------------------- */}
          {/* CENTER STACK: 2 HORIZONTAL CARDS (6 COLS)                             */}
          {/* --------------------------------------------------------------------- */}
          <motion.div
            style={{ y: yCenter }}
            className="lg:col-span-6 flex flex-col gap-5 h-auto lg:h-[540px]"
          >
            {/* HORIZONTAL CARD 1 (TOP) */}
            <BentoCard
              tag={activeStaffingSolutions[1].tag}
              title={activeStaffingSolutions[1].title}
              subtitle={activeStaffingSolutions[1].subtitle}
              image={activeStaffingSolutions[1].image}
              fallbackImage={activeStaffingSolutions[1].fallbackImage}
              orientation="horizontal"
              scrollYProgress={scrollYProgress}
              scrollParallaxRange={['-7%', '7%']}
              className="h-[260px]"
              onClick={() => openModal(activeStaffingSolutions[1].modalTitle)}
            />

            {/* HORIZONTAL CARD 2 (BOTTOM) */}
            <BentoCard
              tag={activeStaffingSolutions[2].tag}
              title={activeStaffingSolutions[2].title}
              subtitle={activeStaffingSolutions[2].subtitle}
              image={activeStaffingSolutions[2].image}
              fallbackImage={activeStaffingSolutions[2].fallbackImage}
              orientation="horizontal"
              scrollYProgress={scrollYProgress}
              scrollParallaxRange={['-7%', '7%']}
              className="h-[260px]"
              onClick={() => openModal(activeStaffingSolutions[2].modalTitle)}
            />
          </motion.div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 4: VERTICAL 2 (RIGHT FLANK - 3 COLS)                             */}
          {/* --------------------------------------------------------------------- */}
          <BentoCard
            tag={activeStaffingSolutions[3].tag}
            title={activeStaffingSolutions[3].title}
            subtitle={activeStaffingSolutions[3].subtitle}
            image={activeStaffingSolutions[3].image}
            fallbackImage={activeStaffingSolutions[3].fallbackImage}
            orientation="vertical"
            scrollYProgress={scrollYProgress}
            scrollParallaxRange={['-12%', '12%']}
            columnY={yCard4}
            className="lg:col-span-3 h-[480px] sm:h-[510px] lg:h-[540px]"
            onClick={() => openModal(activeStaffingSolutions[3].modalTitle)}
          />
        </motion.div>

      </div>
    </section>
  );
}
