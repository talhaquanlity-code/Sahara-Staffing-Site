import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { articlesData } from '../data/articlesData';
import ScrollRevealText from './common/ScrollRevealText';

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const popupVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 22,
      mass: 0.8,
    },
  },
};

export default function Articles() {
  const { openModal } = useUI();
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 pt-24 pb-20 font-sans"
    >
      {/* ========================================================================= */}
      {/* 1. HEADER SECTION (Entrance animation & Interactive CTA)                  */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.8 }}
        className="will-change-transform flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6"
      >
        <div>
          <span className="text-[#B87314] text-xs font-bold tracking-[0.2em] uppercase font-sans mb-3 block">
            THOUGHT LEADERSHIP & INSIGHTS
          </span>
          <ScrollRevealText
            as="h2"
            text="Our Latest Articles & Playbooks"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B0F17]"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => openModal('All Sahara Articles')}
          className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-xs sm:text-sm font-bold text-[#0B0F17] shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 shrink-0 self-start sm:self-auto"
        >
          <span>View All Insights</span>
          <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#E69D2B] group-hover:text-[#0B0F17] flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </motion.button>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. ARTICLES GRID (Staggered Spring + Shimmer + Hover Tilt & Lift)         */}
      {/* ========================================================================= */}
      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="articles-grid grid grid-cols-1 md:grid-cols-3 gap-7"
      >
        {articlesData.map((article) => (
          <motion.article
            key={article.id}
            variants={popupVariants}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => openModal(`Article: ${article.title}`)}
            className="article-card will-change-transform group cursor-pointer rounded-[28px] overflow-hidden relative aspect-[4/3.2] bg-[#0B0F17] shadow-lg hover:shadow-2xl border border-slate-200/40 select-none flex flex-col justify-between"
          >
            {/* Shimmer Light Sweep on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none z-20" />

            {/* Background Image with Smooth Zoom */}
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Dark Editorial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/95 via-[#0B0F17]/40 to-transparent group-hover:via-[#0B0F17]/25 transition-all duration-300 z-10" />

            {/* Top Bar: Category Pill & Floating Arrow Action */}
            <div className="relative z-20 p-6 flex items-center justify-between">
              <span className="bg-black/45 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-white/15 group-hover:bg-[#E69D2B] group-hover:text-[#0B0F17] group-hover:border-[#E69D2B] transition-all duration-300">
                {article.category || 'Executive Hiring'}
              </span>

              {/* Glass Arrow Button that Rotates 45deg on Hover */}
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white group-hover:bg-[#E69D2B] group-hover:text-[#0B0F17] group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-20 p-6 sm:p-7">
              {/* Meta info: Read Time & Date */}
              <div className="flex items-center gap-3 text-xs text-white/70 font-medium mb-2 font-inter">
                <span className="text-[#E69D2B] font-semibold">{article.readTime || '5 min read'}</span>
                <span>•</span>
                <span>{article.date || 'Oct 2026'}</span>
              </div>

              {/* Article Headline */}
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug tracking-tight group-hover:text-[#FDE68A] transition-colors duration-300 font-sans">
                {article.title}
              </h3>

              {/* Expanding Accent Bar Underline */}
              <div className="h-0.5 w-0 bg-[#E69D2B] rounded-full group-hover:w-16 transition-all duration-400 mt-3" />
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}