import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
import SaharaLogo from './SaharaLogo';

export default function ConversionCta({ onNavigateContact, onNavigateServices }) {
  const { openModal } = useUI();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-white via-white to-[#FCEFD2] text-[#0B0F17] font-sans overflow-hidden"
    >
      {/* Radiant Golden Glow Transition Layer with Scroll Parallax */}
      <motion.div
        style={{ y: glowY }}
        className="animate-breathe absolute bottom-0 inset-x-0 h-[450px] bg-gradient-to-t from-[#E69D2B]/30 via-[#E69D2B]/10 to-transparent pointer-events-none will-change-transform"
      />
      <motion.div
        style={{ y: glowY }}
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-[radial-gradient(ellipse_at_center,_rgba(230,157,43,0.25)_0%,_transparent_70%)] pointer-events-none will-change-transform"
      />

      <motion.div
        style={{ y: contentY }}
        className="max-w-[1080px] mx-auto text-center relative z-10 flex flex-col items-center will-change-transform"
      >
        {/* Sahara Emblem Badge with Warm Accent */}
        <motion.div
          style={{ y: badgeY }}
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-14 h-14 rounded-2xl bg-white border border-[#E69D2B]/40 flex items-center justify-center mb-6 shadow-md shadow-[#E69D2B]/15"
        >
          <SaharaLogo className="w-8 h-8" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#B87314] text-xs font-bold tracking-[0.25em] uppercase font-sans mb-3 block"
        >
          LET'S BUILD A STRONGER TEAM
        </motion.span>

        {/* Oversized Confident Headline with Blur Reveal */}
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B0F17] tracking-tight leading-[1.08] mb-6 max-w-3xl"
        >
          Your Next Great Hire Starts with a Conversation.
        </motion.h2>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal font-inter mb-10"
        >
          Tell us what your business needs, and let's explore the right recruitment approach
          together with clarity, purpose, and dedication.
        </motion.p>

        {/* Dual Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              if (onNavigateContact) onNavigateContact();
              else openModal('Discuss Your Hiring Needs');
            }}
            className="btn-shimmer bg-[#0B0F17] hover:bg-[#1E293B] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-full inline-flex items-center gap-2.5 shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>Discuss Your Hiring Needs</span>
            <ArrowRight className="w-4 h-4 text-[#E69D2B]" />
          </button>

          <button
            onClick={() => {
              if (onNavigateServices) onNavigateServices();
              else {
                const el = document.getElementById('services-gallery');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-white/90 backdrop-blur-sm border border-slate-300 hover:border-[#0B0F17] text-[#0B0F17] font-semibold text-sm sm:text-base px-8 py-4 rounded-full hover:bg-white transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
          >
            Explore Our Services
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
