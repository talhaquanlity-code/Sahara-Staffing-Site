import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useCMS } from '../context/CMSContext';
import logoImg from '../assets/sahara-logo.png';

export default function Header({ onNavigate, currentRoute = 'home' }) {
  const { openModal } = useUI();
  const { settings } = useCMS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Other than homepage, navbar has fixed floating positioning.
  // On homepage, obeys global settings.stickyNavbar toggle (defaults to false / non-sticky)
  const isFixed = currentRoute !== 'home';
  const isStickyNavbar = Boolean(settings?.stickyNavbar);

  const handleNav = (route, anchorFallback) => {
    if (onNavigate) {
      onNavigate(route);
    } else if (anchorFallback) {
      const el = document.querySelector(anchorFallback);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.location.hash = route;
    } else {
      window.location.hash = route;
    }
  };

  return (
    <header
      className={`z-50 w-full transition-all duration-300 ${
        isFixed
          ? 'fixed top-0 inset-x-0 pt-4 sm:pt-6 pointer-events-auto'
          : isStickyNavbar
          ? 'sticky top-0 inset-x-0 pt-4 pb-2 z-50 backdrop-blur-md bg-[#0B0F17]/40 max-w-[1400px] mx-auto px-4 sm:px-8'
          : 'relative max-w-[1400px] mx-auto px-4 sm:px-8 pt-6'
      }`}
    >
      {/* 3-Part Symmetrical Navbar */}
      <div
        className={`w-full max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4 ${
          isFixed ? 'px-3 sm:px-8' : ''
        }`}
      >
        {/* ========================================================================= */}
        {/* PART 1: LEFT — SAHARA LOGO (WITH SLEEK OBSIDIAN PILL ON SUBPAGES)          */}
        {/* ========================================================================= */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleNav('home', '#')}
            className={`flex items-center group cursor-pointer focus:outline-none transition-all duration-300 ${
              isFixed
                ? 'bg-[#0B0F17]/85 backdrop-blur-xl border border-white/10 rounded-full px-3.5 sm:px-5 py-2 sm:py-3 shadow-2xl hover:border-white/20 hover:bg-[#0B0F17]/95 active:scale-95'
                : ''
            }`}
            aria-label="Sahara Staffing Inc. Home"
          >
            <img
              src={logoImg}
              alt="Sahara Staffing Inc."
              className="h-6 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PART 2: CENTER PILL — EXACTLY: Home | About | Services | Contact          */}
        {/* ========================================================================= */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 xl:gap-9 bg-[#0B0F17]/85 backdrop-blur-xl border border-white/10 rounded-full px-8 lg:px-10 py-4 shadow-2xl text-[13px] font-medium text-white/85 transition-all">
          <button
            type="button"
            onClick={() => handleNav('home', '#')}
            className={`transition-colors tracking-wide cursor-pointer focus:outline-none ${
              currentRoute === 'home' ? 'text-saharaGold font-semibold' : 'hover:text-saharaGold'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNav('about')}
            className={`transition-colors tracking-wide cursor-pointer focus:outline-none ${
              currentRoute === 'about' ? 'text-saharaGold font-semibold' : 'hover:text-saharaGold'
            }`}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => handleNav('services', '#payment-section')}
            className={`transition-colors tracking-wide cursor-pointer focus:outline-none ${
              currentRoute === 'services' ? 'text-saharaGold font-semibold' : 'hover:text-saharaGold'
            }`}
          >
            Services
          </button>

          <button
            type="button"
            onClick={() => handleNav('contact')}
            className={`transition-colors tracking-wide cursor-pointer focus:outline-none ${
              currentRoute === 'contact' ? 'text-saharaGold font-semibold' : 'hover:text-saharaGold'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* ========================================================================= */}
        {/* PART 3: RIGHT PILL — [ ACCOUNT ICON | JOIN US | MOBILE MENU TOGGLE ]      */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#0B0F17]/85 backdrop-blur-xl border border-white/10 rounded-full p-1.5 sm:p-2 pl-2.5 sm:pl-4 shadow-2xl shrink-0">
          <button
            type="button"
            onClick={() => openModal('Account Login')}
            aria-label="Account login"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/80 hover:text-saharaGold transition-colors cursor-pointer focus:outline-none"
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={() => handleNav('contact')}
            className="bg-saharaGold hover:bg-saharaGoldLight text-obsidian font-semibold text-xs sm:text-[13px] px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none whitespace-nowrap"
          >
            Join Us
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slateCard/90 hover:bg-slateCard hover:text-saharaGold flex items-center justify-center text-white transition-colors cursor-pointer border border-white/5 active:scale-95 md:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MENU — EXACTLY: Home | About | Services | Contact           */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="absolute top-20 right-4 left-4 bg-[#0B0F17]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-3 text-center z-50 md:hidden animate-in fade-in slide-in-from-top-2">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNav('home', '#');
            }}
            className={`text-sm py-2 transition-colors border-b border-white/5 cursor-pointer ${
              currentRoute === 'home' ? 'text-saharaGold font-bold' : 'text-white hover:text-saharaGold'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNav('about');
            }}
            className={`text-sm py-2 transition-colors border-b border-white/5 cursor-pointer ${
              currentRoute === 'about' ? 'text-saharaGold font-bold' : 'text-white hover:text-saharaGold'
            }`}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNav('services', '#payment-section');
            }}
            className={`text-sm py-2 transition-colors border-b border-white/5 cursor-pointer ${
              currentRoute === 'services' ? 'text-saharaGold font-bold' : 'text-white hover:text-saharaGold'
            }`}
          >
            Services
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNav('contact');
            }}
            className={`text-sm py-2 transition-colors border-b border-white/5 cursor-pointer ${
              currentRoute === 'contact' ? 'text-saharaGold font-bold' : 'text-white hover:text-saharaGold'
            }`}
          >
            Contact
          </button>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openModal('Account Login');
              }}
              className="w-full py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold hover:border-saharaGold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNav('contact');
              }}
              className="w-full py-2.5 rounded-full bg-saharaGold text-obsidian text-xs font-bold hover:bg-saharaGoldLight transition-colors cursor-pointer"
            >
              Join Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
