import React from 'react';
import { Linkedin, Twitter, Instagram, Mail, ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
import logoImg from '../assets/sahara-logo.png';

export default function Footer({ onNavigate }) {
  const { openModal, showToast } = useUI();

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => showToast('Opening Sahara Staffing on LinkedIn'),
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => showToast('Opening Sahara Staffing on X (Twitter)'),
    },
    {
      name: 'Instagram',
      icon: Instagram,
      action: () => showToast('Opening Sahara Staffing on Instagram'),
    },
    {
      name: 'Mail',
      icon: Mail,
      action: () => (window.location.href = 'mailto:hello@saharastaffing.example'),
    },
  ];

  const navLinks = [
    {
      label: 'Home',
      onClick: () => (onNavigate ? onNavigate('home') : (window.location.hash = 'home')),
    },
    {
      label: 'About',
      onClick: () => (onNavigate ? onNavigate('about') : (window.location.hash = 'about')),
    },
    {
      label: 'Services',
      onClick: () => (onNavigate ? onNavigate('services') : (window.location.hash = 'services')),
    },
    {
      label: 'Contact',
      onClick: () => (onNavigate ? onNavigate('contact') : (window.location.hash = 'contact')),
    },
  ];

  return (
    <footer className="w-full">
      {/* Sleek Dark Card Shell */}
      <div className="w-full bg-[#090D14] text-white rounded-[24px] sm:rounded-[36px] lg:rounded-[44px] p-6 sm:p-12 lg:p-14 shadow-2xl border border-white/[0.08]">
        {/* Top Row: Brand & Navigation Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 pb-8 sm:pb-14">
          {/* Left Brand Block */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-3.5">
            {/* Real Official Sahara Staffing Logo */}
            <a href="#" className="inline-block group">
              <img
                src={logoImg}
                alt="Sahara Staffing Inc."
                className="h-7 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </a>

            {/* Premium, Smaller, Clean Brand Tagline */}
            <p className="text-[12px] sm:text-[13px] text-[#94A3B8]/75 leading-[1.65] max-w-[330px] font-normal tracking-[-0.01em]">
              Connecting elite talent with high-growth enterprises. End-to-end executive search,
              tech recruitment, and specialized B2B staffing solutions.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-x-3.5 gap-y-2">
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('services') : (window.location.hash = 'services'))}
                className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-medium text-[#E69D2B] hover:text-[#F6C467] hover:underline transition-colors group tracking-wide focus:outline-none cursor-pointer"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
              <span className="text-white/20 hidden sm:inline">•</span>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('about') : (window.location.hash = 'about'))}
                className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-medium text-white/70 hover:text-[#E69D2B] hover:underline transition-colors group tracking-wide focus:outline-none cursor-pointer"
              >
                <span>About Sahara</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Navigation Links (Top-Right) */}
          <div className="lg:col-span-7 flex flex-wrap items-center justify-start lg:justify-end gap-x-6 sm:gap-x-9 gap-y-2.5 text-[12.5px] sm:text-[13px] font-normal text-white/80 self-start pt-1 sm:pt-1.5">
            {navLinks.map((item) =>
              item.onClick ? (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="hover:text-[#E69D2B] transition-colors focus:outline-none cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="hover:text-[#E69D2B] transition-colors"
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* Bottom Row: Socials, Copyright, Contact Info & Legal Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 pt-6 sm:pt-9 border-t border-white/[0.07] items-start">
          {/* Left Column: Social Media Row & Copyright String */}
          <div className="md:col-span-4 space-y-3 sm:space-y-3.5">
            {/* Horizontal Flex Row of Round Icon Buttons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <button
                    key={social.name}
                    onClick={social.action}
                    aria-label={social.name}
                    className="w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-full bg-white/[0.05] hover:bg-[#E69D2B] text-white/85 hover:text-[#0B0F17] flex items-center justify-center transition-all duration-200 active:scale-95 border border-white/[0.08] hover:border-[#E69D2B] cursor-pointer"
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-[#64748B] leading-relaxed font-normal tracking-tight flex items-center gap-2">
              <span>&copy; 2026 Sahara Staffing Inc. All Rights Reserved.</span>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('sahara_admin_session_v1');
                    sessionStorage.removeItem('sahara_admin_session_v1');
                  } catch {}
                  if (onNavigate) onNavigate('admin');
                  else window.location.hash = 'admin';
                }}
                title="Staff Portal (Shortcut: Tab + SH)"
                className="text-[#64748B]/50 hover:text-[#E69D2B] transition-colors p-0.5 cursor-pointer"
                aria-label="Staff Access Portal (Shortcut: Tab + SH)"
              >
                &bull;
              </button>
            </div>
          </div>

          {/* Middle Column: Contact Us & Primary Location */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <div className="text-[10.5px] font-semibold text-white/90 tracking-[0.08em] uppercase mb-1 sm:mb-1.5">
                Contact Us
              </div>
              <div className="space-y-0.5 text-[11.5px] sm:text-[12px] text-[#94A3B8]/75 leading-relaxed">
                <div>
                  <a
                    href="mailto:contact@saharastaffing.com"
                    className="hover:text-[#E69D2B] transition-colors"
                  >
                    contact@saharastaffing.com
                  </a>
                </div>
                <div>
                  <a
                    href="tel:+18005550199"
                    className="hover:text-[#E69D2B] transition-colors"
                  >
                    +1 (800) 555-0199
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10.5px] font-semibold text-white/90 tracking-[0.08em] uppercase mb-1 sm:mb-1.5">
                Primary Location
              </div>
              <div className="text-[11.5px] sm:text-[12px] text-[#94A3B8]/75 leading-relaxed">
                <div>100 Park Avenue, Suite 1600</div>
                <div>New York, NY 10017</div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Legal Links */}
          <div className="md:col-span-3 flex md:justify-end items-start pt-1">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] sm:text-[11.5px] text-[#94A3B8]/60 md:text-right">
              <button
                onClick={() => openModal('Privacy Policy')}
                className="hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => openModal('Terms of Service')}
                className="hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}