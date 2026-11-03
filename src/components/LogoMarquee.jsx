import React from 'react';

export default function LogoMarquee() {
  const partners = [
    {
      id: 'sahara',
      content: <span className="text-xl font-bold tracking-tight text-obsidian/40">Sahara.</span>,
    },
    {
      id: 'greenflag',
      content: (
        <div className="flex items-center gap-2 text-obsidian font-bold text-lg">
          <span className="w-6 h-6 rounded-full border-2 border-obsidian flex items-center justify-center text-xs">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5.25-3.5 10-8 12-4.5-2-8-6.75-8-12V6l8-4z" />
            </svg>
          </span>
          <span>GreenFlag</span>
        </div>
      ),
    },
    {
      id: '360',
      content: (
        <div className="w-9 h-9 rounded-full bg-obsidian text-crispWhite flex items-center justify-center text-[8px] font-bold tracking-tighter">
          360°
        </div>
      ),
    },
    {
      id: 'meetem',
      content: (
        <div className="flex items-center gap-2 text-obsidian font-bold text-lg">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="11" height="11" rx="2" />
            <rect x="10" y="10" width="11" height="11" rx="2" opacity="0.5" />
          </svg>
          <span>Meetem</span>
        </div>
      ),
    },
    {
      id: 'continiom',
      content: (
        <div className="flex items-center gap-2 text-obsidian font-bold text-lg">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="2,4 12,12 2,20" />
            <polygon points="22,4 12,12 22,20" />
          </svg>
          <span>Continiom</span>
        </div>
      ),
    },
    {
      id: 'mrlog',
      content: (
        <div className="flex items-center gap-2 text-obsidian font-bold text-lg">
          <span className="font-black text-xl">M</span>
          <span>Mrlog.ai</span>
        </div>
      ),
    },
    {
      id: 'trustvil',
      content: (
        <div className="flex items-center gap-2 text-obsidian/50 font-bold text-lg">
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
            ✦
          </span>
          <span>trustvil</span>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-hidden py-12 my-2">
      {/* Left & Right Soft White Fade Masks */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-crispWhite to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-crispWhite to-transparent z-10 pointer-events-none" />

      {/* Infinite track */}
      <div className="marquee-track items-center gap-14 sm:gap-20 px-8">
        {/* Set 1 */}
        <div className="flex items-center gap-14 sm:gap-20 shrink-0">
          {partners.map((partner, index) => (
            <div key={`set1-${partner.id}-${index}`}>{partner.content}</div>
          ))}
        </div>

        {/* Set 2 (Duplicate for Seamless Loop) */}
        <div className="flex items-center gap-14 sm:gap-20 shrink-0" aria-hidden="true">
          {partners.map((partner, index) => (
            <div key={`set2-${partner.id}-${index}`}>{partner.content}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

