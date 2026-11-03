import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUI } from '../context/UIContext';
import LogoMarquee from './LogoMarquee';
import ScrollRevealText from './common/ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

export default function NextGenPayment() {
  const { openModal } = useUI();
  const sectionRef = useRef(null);
  const petalsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Staggered card entrance on scroll
      gsap.fromTo(
        '.nextgen-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.nextgen-cards-grid',
            start: 'top 82%',
          },
        }
      );

      // 2. Subtle rotation of petals on scroll
      if (petalsRef.current) {
        gsap.to(petalsRef.current, {
          rotate: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="payment-section" className="bg-crispWhite pt-16 pb-24">
      {/* Top Centered Pill Badge */}
      <div className="max-w-[1320px] mx-auto px-5 text-center">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-[#F1F5F9] text-obsidian/80 text-xs font-medium shadow-sm hover:scale-105 transition-transform duration-300 cursor-default">
          Join over 500 businesses already growing with Sahara.
        </div>
      </div>

      {/* Infinite Horizontal Logo Ticker */}
      <LogoMarquee />

      {/* Main 2-Column Asymmetric Content Block */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Left Column: Title, Dual Buttons, Bottom Editorial Copy */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
          <div>
            <ScrollRevealText
              as="h2"
              text="Build for your next gen of payment"
              className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-obsidian"
            />

            <div className="flex flex-wrap items-center gap-3 mt-7">
              <button
                onClick={() => openModal('Start Banking with Sahara')}
                className="btn-shimmer bg-obsidian hover:bg-slateCard text-crispWhite text-xs sm:text-sm font-medium px-6 py-3.5 rounded-full inline-flex items-center gap-2 transition-all shadow-md active:scale-95 group"
              >
                <span>Start banking</span>
                <ArrowRight className="w-4 h-4 text-saharaGold transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#capital-section"
                className="border border-slate-200 hover:border-obsidian text-obsidian text-xs sm:text-sm font-medium px-6 py-3.5 rounded-full transition-all hover:bg-slate-50"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Bottom Left Editorial Paragraphs with Word-by-word Reveal */}
          <div className="space-y-5 max-w-md pt-4">
            <ScrollRevealText
              as="p"
              text="Experience seamless integration of technology and finance, built for your success and convenience."
              className="text-sm sm:text-[15px] leading-relaxed text-obsidian"
            />
            <ScrollRevealText
              as="p"
              text="The power of an ERP, with none of the legacy baggage. Sahara gives mid-market finance & accounting teams an intuitive platform for audit-readiness, multi-entity."
              className="text-sm sm:text-[15px] leading-relaxed text-obsidian"
            />
          </div>
        </div>

        {/* Right Column: 2 Side-by-Side Feature Cards */}
        <div className="nextgen-cards-grid lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
          {/* Card 1: Soft Slate Tint ("Control spend effortlessly at any size") */}
          <div className="nextgen-card bg-softSlateBg rounded-[28px] p-7 sm:p-8 flex flex-col justify-between min-h-[350px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div>
              <h3 className="text-2xl sm:text-[26px] font-semibold tracking-[-0.02em] leading-[1.15] text-obsidian">
                Control spend effortlessly at any size
              </h3>

              <ul className="space-y-3 mt-8 text-xs sm:text-[13px] text-obsidian/85">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-obsidian shrink-0 mt-0.5" />
                  <span>Issue corporate cards and reimburse expenses.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-obsidian shrink-0 mt-0.5" />
                  <span>Set company-wide spend policies in minutes</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => openModal('Manage Corporate Spend')}
                className="btn-shimmer bg-obsidian hover:bg-slateCard text-crispWhite text-xs font-medium px-5 py-3 rounded-full inline-flex items-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <span>Manage expenses</span>
                <ArrowRight className="w-3.5 h-3.5 text-saharaGold" />
              </button>
            </div>
          </div>

          {/* Card 2: Obsidian Navy ("Fuel your growth with friendly Venture Debt") */}
          <div className="nextgen-card bg-obsidian text-crispWhite rounded-[28px] p-7 sm:p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden shadow-2xl hover:shadow-saharaGold/10 hover:-translate-y-1 transition-all duration-300">
            {/* Subtle Decorative Line Art Petals in Top-Left */}
            <svg
              ref={petalsRef}
              className="absolute -top-8 -left-8 w-44 h-44 text-slateCard/60 pointer-events-none will-change-transform"
              viewBox="0 0 200 200"
              fill="none"
            >
              <path
                d="M100 10 C120 60, 160 80, 190 100 C140 120, 120 160, 100 190 C80 140, 40 120, 10 100 C60 80, 80 40, 100 10 Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="75"
                ry="30"
                transform="rotate(35 100 100)"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="75"
                ry="30"
                transform="rotate(-35 100 100)"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>

            {/* Floating Mini UI Widgets (Send Money & Exchange Money) */}
            <div className="relative z-10 flex items-center gap-3 pt-4 overflow-x-auto no-scrollbar">
              {/* Mini Card A: Send Money (White) */}
              <div className="bg-crispWhite text-obsidian rounded-2xl p-3.5 w-[155px] shrink-0 shadow-xl hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between text-[10px] font-semibold text-obsidian/70 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Send money</span>
                  </div>
                  <span>•••</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                    alt="Avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="leading-tight">
                    <div className="text-[9px] font-bold">Floyd Miles</div>
                    <div className="text-[7px] text-slateGray">•••• 4821</div>
                  </div>
                </div>
                <div className="bg-saharaGold/25 text-obsidian font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center justify-between">
                  <span>$</span>
                  <span>250.00</span>
                </div>
              </div>

              {/* Mini Card B: Exchange Money (Elevated Slate) */}
              <div className="bg-slateCard text-crispWhite rounded-2xl p-3.5 w-[155px] shrink-0 shadow-xl border border-white/10 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slateGray mb-2">
                  <span>Exchange money</span>
                </div>
                <div className="flex items-center justify-between text-[10px] bg-obsidian/60 rounded-xl px-2.5 py-1.5 mb-2">
                  <span className="font-semibold text-white/90">USD</span>
                  <span className="font-bold">$250.00</span>
                </div>
                <div className="bg-saharaGold text-obsidian font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center justify-between">
                  <span>EUR</span>
                  <span>€202.00</span>
                </div>
              </div>
            </div>

            {/* Bottom Title */}
            <div className="relative z-10 pt-10">
              <h3 className="text-2xl sm:text-[26px] font-semibold tracking-[-0.02em] leading-[1.15]">
                <span className="text-saharaGold">Fuel your growth</span> with friendly Venture Debt
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
