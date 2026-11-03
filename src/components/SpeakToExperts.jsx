import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ScrollRevealText from './common/ScrollRevealText';

export default function SpeakToExperts({ onNavigateContact }) {
  const { openModal } = useUI();

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-24 text-center">
      <ScrollRevealText
        as="h2"
        text="Speak to our staffing experts"
        className="text-3xl sm:text-5xl md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] text-obsidian font-sans"
      />

      <p className="text-xs sm:text-sm text-obsidian/75 max-w-md mx-auto leading-relaxed mt-4 sm:mt-5 font-inter">
        Our team is here to answer your questions, review your business needs, and guide you toward
        the right staffing solution so you can move forward with confidence.
      </p>

      {/* Experts Avatar Stack + Talk to staffing Button */}
      <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
        <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-obsidian font-sans">Experts</span>
          <div className="flex -space-x-2.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Expert 1"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-crispWhite shadow-sm hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="Expert 2"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-crispWhite shadow-sm hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
              alt="Expert 3"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-crispWhite shadow-sm hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (onNavigateContact) onNavigateContact();
            else openModal('Speak to a Sahara Staffing Expert');
          }}
          className="btn-shimmer w-full sm:w-auto justify-center bg-obsidian hover:bg-slateCard text-crispWhite text-xs sm:text-sm font-medium px-7 sm:px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2.5 transition-all shadow-lg active:scale-95 group cursor-pointer"
        >
          <span>Talk to staffing</span>
          <ArrowRight className="w-4 h-4 text-saharaGold transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
