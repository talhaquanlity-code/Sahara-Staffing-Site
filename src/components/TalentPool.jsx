import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldCheck, TrendingUp, Code2, ArrowUpRight } from 'lucide-react';
import { useUI } from '../context/UIContext';

const disciplinesData = [
  {
    id: 'ai-cloud',
    stepNumber: '01',
    icon: Cpu,
    title: 'AI & Cloud Engineering',
    description: 'Principal Python, PyTorch, Kubernetes, and Distributed Systems Engineers.',
    candidateRole: 'Senior AI & Systems Architect',
    image: '/assets/talent-ai.jpg',
    metric1Label: 'Avg. Time-to-Fill',
    metric1Val: '10 Days',
    metric2Label: 'Vetting Pass Rate',
    metric2Val: 'Top 2.0%',
    skills: ['Python', 'PyTorch', 'AWS', 'LLMs', 'Kubernetes'],
  },
  {
    id: 'exec-search',
    stepNumber: '02',
    icon: ShieldCheck,
    title: 'Executive Search',
    description: 'VP of Engineering, CTO, COO, and Director-level placements.',
    candidateRole: 'VP of Engineering (Series B - Enterprise)',
    image: '/assets/talent-exec.jpg',
    metric1Label: 'Avg. Time-to-Fill',
    metric1Val: '14 Days',
    metric2Label: '90-Day Retention',
    metric2Val: '98%',
    skills: ['Tech Strategy', 'Scale-Up', 'Board Advisory', 'Org Design'],
  },
  {
    id: 'finance-ops',
    stepNumber: '03',
    icon: TrendingUp,
    title: 'Finance & Leadership',
    description: 'CFOs, Controllers, FP&A Directors, and Audit-readiness leads.',
    candidateRole: 'Director of Strategic Finance & FP&A',
    image: '/assets/talent-finance.jpg',
    metric1Label: 'Avg. Time-to-Fill',
    metric1Val: '12 Days',
    metric2Label: 'Vetting Pass Rate',
    metric2Val: 'Top 3.0%',
    skills: ['M&A', 'FP&A', 'Audit Prep', 'US GAAP', 'Venture Debt'],
  },
  {
    id: 'product-fullstack',
    stepNumber: '04',
    icon: Code2,
    title: 'Product & Full-Stack',
    description: 'Lead React, Node.js, and Enterprise SaaS Product Managers.',
    candidateRole: 'Lead Full-Stack React Architect',
    image: '/assets/talent-product.jpg',
    metric1Label: 'Avg. Time-to-Fill',
    metric1Val: '8 Days',
    metric2Label: 'Vetting Pass Rate',
    metric2Val: 'Top 2.5%',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Next.js'],
  },
];

export default function TalentPool() {
  const { openModal } = useUI();
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);

  const activeRole = disciplinesData[activeRoleIndex];

  return (
    <section id="talent-pool-section" className="py-20 sm:py-24 px-4 sm:px-8 bg-white font-sans">
      <div className="max-w-[1280px] mx-auto">
        {/* ========================================================================= */}
        {/* 1. HEADER STACK                                                           */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="will-change-transform flex flex-col items-start mb-12 sm:mb-14"
        >
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B0F17] border border-[#E69D2B]/40 text-white text-xs font-bold shadow-md mb-4">
            <span className="w-2 h-2 rounded-full bg-[#E69D2B]" />
            <span className="tracking-widest uppercase">SAHARA TALENT POOL</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F17] tracking-tight mb-4 leading-[1.12]">
            Pre-Vetted Specialists Ready for Immediate Deployment
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Explore our core recruitment disciplines. Hover over any domain to preview active candidate
            profiles and placement SLAs.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. MASTER 2-COLUMN SPLIT GRID                                             */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.1 }}
          className="will-change-transform grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* ======================================================================= */}
          {/* LEFT COLUMN: DYNAMIC CANDIDATE SHOWCASE FRAME (Span 5 Columns)          */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 relative rounded-[32px] overflow-hidden bg-[#0B0F17] min-h-[520px] sm:min-h-[560px] border border-slate-200 shadow-2xl flex flex-col justify-end p-6 select-none">
            {/* Background Candidate Image with Framer Motion Crossfade */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeRole.id}
                src={activeRole.image}
                alt={activeRole.candidateRole}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="object-cover object-top w-full h-full absolute inset-0"
                loading="eager"
              />
            </AnimatePresence>

            {/* Dark Editorial Gradient Overlay */}
            <div className="bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent absolute inset-0 z-10 pointer-events-none" />

            {/* Top-Left Live Availability Badge */}
            <div className="absolute top-6 left-6 z-20 bg-[#0B0F17]/85 backdrop-blur-md border border-white/15 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-xs text-white font-semibold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Vetted &amp; Available Now</span>
            </div>

            {/* Top-Right Quick CTA Pill */}
            <button
              onClick={() => openModal(`Interview Candidate: ${activeRole.candidateRole}`)}
              className="absolute top-6 right-6 z-20 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#E69D2B] hover:text-[#0B0F17] transition-all duration-200 cursor-pointer shadow-md"
              title="Request Candidate Profile"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Bottom Floating Profile Card (Overlaid on Photo) */}
            <motion.div
              key={`profile-${activeRole.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="relative z-20 bg-[#1E293B]/90 backdrop-blur-md rounded-[24px] border border-white/15 p-5 text-white shadow-xl"
            >
              {/* Candidate Role Title */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 tracking-tight font-sans">
                {activeRole.candidateRole}
              </h3>

              {/* Placement SLA Metrics Strip (2 Columns) */}
              <div className="grid grid-cols-2 gap-3 py-2.5 border-y border-white/10 mb-3 font-mono">
                <div>
                  <div className="text-[11px] text-slate-300 font-sans">{activeRole.metric1Label}</div>
                  <div className="text-[#E69D2B] font-bold text-base mt-0.5">{activeRole.metric1Val}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-300 font-sans">{activeRole.metric2Label}</div>
                  <div className="text-white font-bold text-base mt-0.5">{activeRole.metric2Val}</div>
                </div>
              </div>

              {/* Skill Tags Row */}
              <div className="flex flex-wrap gap-1.5">
                {activeRole.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-white/10 text-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-md border border-white/5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: 4 INTERACTIVE DISCIPLINE CARDS (Span 7 Columns)           */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {disciplinesData.map((discipline, index) => {
              const isActive = activeRoleIndex === index;
              const IconComp = discipline.icon;

              return (
                <div
                  key={discipline.id}
                  onMouseEnter={() => setActiveRoleIndex(index)}
                  onClick={() => setActiveRoleIndex(index)}
                  className={`rounded-[24px] p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[220px] select-none ${
                    isActive
                      ? 'bg-[#0B0F17] text-white border border-[#E69D2B]/60 shadow-xl translate-y-[-2px]'
                      : 'bg-white hover:bg-slate-50 border border-slate-200 text-[#0B0F17] shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon Container + Step Number */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                          isActive
                            ? 'bg-[#E69D2B] text-[#0B0F17]'
                            : 'bg-[#FAF5ED] text-[#E69D2B] border border-[#E69D2B]/20'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {discipline.stepNumber}
                      </span>
                    </div>

                    {/* Title */}
                    <h4
                      className={`text-lg font-bold mb-2 tracking-tight transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-[#0B0F17]'
                      }`}
                    >
                      {discipline.title}
                    </h4>

                    {/* Short Description */}
                    <p
                      className={`text-xs sm:text-sm leading-relaxed transition-colors duration-200 ${
                        isActive ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {discipline.description}
                    </p>
                  </div>

                  {/* Card Bottom Indicator */}
                  <div className="pt-4 flex items-center justify-between text-xs font-semibold">
                    <span
                      className={`transition-colors duration-200 ${
                        isActive ? 'text-[#E69D2B]' : 'text-slate-400'
                      }`}
                    >
                      {isActive ? 'Previewing Profile' : 'Hover to Inspect'}
                    </span>
                    <span
                      className={`text-base font-bold transition-all duration-200 ${
                        isActive ? 'text-[#E69D2B] translate-x-1' : 'text-slate-300'
                      }`}
                    >
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}