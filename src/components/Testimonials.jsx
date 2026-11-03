import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCMS } from '../context/CMSContext';

const testimonials = [
  {
    id: 1,
    name: 'Michael Carter',
    role: 'VP of Engineering at CloudScale',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    quote:
      "Sahara has been a total game-changer for our engineering organization. Their technical vetting delivered two principal distributed systems architects within 9 days. The candidates hit the ground running on day one.",
  },
  {
    id: 2,
    name: 'Elena Rostova',
    role: 'Chief People Officer at FinPulse Global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    quote:
      "I've worked with dozens of executive recruitment agencies, and Sahara stands in a league of its own. Transparent SLAs, zero unqualified resume spams, and a genuine 90-day retention guarantee we can trust.",
  },
  {
    id: 3,
    name: 'John Spencer',
    role: 'Director of Platform at GlobeSync',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    quote:
      "Finding verified Kubernetes and infrastructure specialists used to stall our roadmap for quarters. With Sahara's 5-stage vetting framework, we closed our top candidate in just one week.",
  },
  {
    id: 4,
    name: 'David Lin',
    role: 'Founder & CEO at Omniverse AI',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    quote:
      "As a fast-growing startup, we can't afford hiring mistakes. Sahara understands technical nuances and cultural alignment. Their team feels like a natural extension of our leadership council.",
  },
  {
    id: 5,
    name: 'Sarah Jenkins',
    role: 'VP of Product at Horizon SaaS',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    quote:
      "From scoping the role to the final offer letter, Sahara executed with supreme speed and precision. The candidate caliber exceeded our board's expectations.",
  },
  {
    id: 6,
    name: 'Marcus Vance',
    role: 'Chief Technology Officer at Continiom',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    quote:
      "Sahara completely eliminated recruitment friction. We scaled our core data engineering squad by 4 senior hires within 3 weeks without sacrificing technical standards.",
  },
];

export default function Testimonials() {
  const { content } = useCMS();
  const cmsTestimonials = content?.testimonials;

  const displayTestimonials = (Array.isArray(cmsTestimonials) && cmsTestimonials.length > 0)
    ? cmsTestimonials.map((t, idx) => ({
        id: t.id || idx + 1,
        name: t.name || t.author?.split(',')?.[0]?.trim() || `Enterprise Leader ${idx + 1}`,
        role: t.role || t.title || t.author?.split(',')?.[1]?.trim() || 'Executive Partner',
        avatar: t.avatar || t.image || testimonials[idx % testimonials.length]?.avatar,
        quote: t.quote || '',
      }))
    : testimonials;

  const sectionRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headerY = useTransform(scrollYProgress, (v) => (isDesktop ? (0.5 - v) * 40 : 0));
  const marqueeY = useTransform(scrollYProgress, (v) => (isDesktop ? (v - 0.5) * 50 : 0));

  return (
    <section
      ref={sectionRef}
      id="testimonials-section"
      className="py-14 sm:py-24 bg-[#FAF9F6] font-sans overflow-hidden select-none"
    >
      <motion.div
        style={{ y: headerY }}
        className="max-w-[1360px] mx-auto px-4 sm:px-8 mb-8 sm:mb-14 text-center will-change-transform"
      >
        {/* ========================================================================= */}
        {/* 1. HEADER STACK (Clean, Minimal, Modern)                                  */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="max-w-2xl mx-auto"
        >
          {/* Subtle Sahara Kicker */}
          <span className="text-[#B87314] text-xs font-bold uppercase tracking-[0.2em] font-sans mb-2.5 sm:mb-3 block">
            CLIENT SUCCESS STORIES
          </span>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F17] tracking-tight mb-3 sm:mb-4">
            What Our Clients Are Saying
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-normal font-inter">
            Our enterprise partners rely on Sahara to recruit mission-critical specialists and build
            high-performing teams with speed and certainty.
          </p>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. COMPACT CONTINUOUS MARQUEE TRACK (Pause on Hover)                      */}
      {/* ========================================================================= */}
      <motion.div
        style={{ y: marqueeY }}
        className="relative w-full overflow-hidden py-2 sm:py-4 will-change-transform"
      >
        {/* Left & Right Soft Fade Masks for Seamless Edge Dissolve */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-36 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 sm:w-36 bg-gradient-to-l from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track with Duplicate for Infinite Loop */}
        <div className="marquee-track flex items-stretch gap-4 sm:gap-6 px-3 sm:px-4">
          {/* Set 1 */}
          <div className="flex items-stretch gap-4 sm:gap-6 shrink-0">
            {displayTestimonials.map((item) => (
              <div
                key={`t1-${item.id}`}
                className="w-[285px] xs:w-[320px] sm:w-[400px] shrink-0 p-5 sm:p-7 bg-white rounded-[20px] sm:rounded-[24px] border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#E69D2B]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: 5 Stars */}
                  <div className="flex items-center gap-1 text-[#E69D2B] mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote Body */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-inter mb-4 sm:mb-6">
                    {item.quote}
                  </p>
                </div>

                {/* Bottom Author Row */}
                <div className="flex items-center gap-3 pt-3.5 sm:pt-4 border-t border-slate-100">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-[#E69D2B]/20 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-[#0B0F17] text-xs sm:text-sm font-sans truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-inter truncate">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Set 2 (Duplicate for Seamless Loop) */}
          <div className="flex items-stretch gap-4 sm:gap-6 shrink-0" aria-hidden="true">
            {displayTestimonials.map((item) => (
              <div
                key={`t2-${item.id}`}
                className="w-[285px] xs:w-[320px] sm:w-[400px] shrink-0 p-5 sm:p-7 bg-white rounded-[20px] sm:rounded-[24px] border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#E69D2B]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: 5 Stars */}
                  <div className="flex items-center gap-1 text-[#E69D2B] mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote Body */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-inter mb-4 sm:mb-6">
                    {item.quote}
                  </p>
                </div>

                {/* Bottom Author Row */}
                <div className="flex items-center gap-3 pt-3.5 sm:pt-4 border-t border-slate-100">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-[#E69D2B]/20 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-[#0B0F17] text-xs sm:text-sm font-sans truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-inter truncate">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}