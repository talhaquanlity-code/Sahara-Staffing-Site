import React from 'react';

export default function SaharaLogo({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="saharaGold1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF0A8" />
            <stop offset="100%" stopColor="#E69D2B" />
          </linearGradient>
          <linearGradient id="saharaGold2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5B945" />
            <stop offset="100%" stopColor="#B87314" />
          </linearGradient>
          <linearGradient id="saharaGold3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9831D" />
            <stop offset="100%" stopColor="#754808" />
          </linearGradient>
        </defs>
        {/* Top Faceted Polyhedron S */}
        <polygon points="52,6 88,42 50,38" fill="url(#saharaGold1)" />
        <polygon points="52,6 50,38 20,28" fill="url(#saharaGold2)" />
        <polygon points="20,28 50,38 35,49" fill="url(#saharaGold3)" />
        {/* Center Spine */}
        <polygon points="35,49 50,38 74,52" fill="url(#saharaGold1)" />
        {/* Bottom Faceted Polyhedron S */}
        <polygon points="35,49 74,52 52,64" fill="url(#saharaGold2)" />
        <polygon points="74,52 84,65 52,64" fill="url(#saharaGold1)" />
        <polygon points="52,64 84,65 48,94" fill="url(#saharaGold2)" />
        <polygon points="33,54 52,64 16,92" fill="url(#saharaGold1)" />
        <polygon points="16,92 52,64 48,94" fill="url(#saharaGold3)" />
      </svg>
    </div>
  );
}

