import React, { useState, useEffect } from 'react';
import { UIProvider } from './context/UIContext';
import { ScrollProvider } from './context/ScrollContext';
import { CMSProvider, useCMS } from './context/CMSContext';
import Header from './components/Header';
import Hero from './components/Hero';
import SocialProofMarquee from './components/SocialProofMarquee';
import BentoGrowthCapital from './components/BentoGrowthCapital';
import VettingProcess from './components/VettingProcess';
import Calculator from './components/Calculator';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import SpeakToExperts from './components/SpeakToExperts';
import Footer from './components/Footer';
import Modal from './components/Modal';
import Toast from './components/Toast';
import ScrollProgressButton from './components/ScrollProgressButton';

// Dedicated Subpages
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function LuxuryCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = e.target;
      const isInteractive = target?.closest('button, a, input, textarea, select, [role="button"]');
      setHovered(!!isInteractive);
    };
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    >
      <div
        className={`rounded-full border border-[#E69D2B] bg-[#E69D2B]/15 transition-all duration-200 ${
          hovered ? 'w-10 h-10 scale-125 bg-[#E69D2B]/30' : 'w-6 h-6'
        }`}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#E69D2B]" />
    </div>
  );
}

function AppContent() {
  const { settings } = useCMS();
  const [currentRoute, setCurrentRoute] = useState('home'); // 'home' | 'services' | 'about' | 'contact' | 'admin'
  const [contactPrefill, setContactPrefill] = useState(null);

  // Sync route with URL hash for bookmarking & browser back/forward support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'services', 'about', 'contact', 'admin'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route, prefill = null) => {
    if (prefill) {
      setContactPrefill(prefill);
    }
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick keyboard shortcut to access Admin Portal:
  // Supports TAB + SH (or Tab + S + H, or Tab + Shift + H)
  useEffect(() => {
    let isTabDown = false;
    let lastTabTime = 0;
    let sequence = '';
    let sequenceTimer = null;

    const triggerAdminAccess = (e) => {
      e.preventDefault();
      e.stopPropagation();
      sequence = '';
      // Always ensure the user lands on the secure Login Gate, not directly in the dashboard
      try {
        localStorage.removeItem('sahara_admin_session_v1');
        sessionStorage.removeItem('sahara_admin_session_v1');
      } catch {}
      navigate('admin');
    };

    const handleKeyDown = (e) => {
      // Don't intercept while typing in an input field or textarea
      const targetTag = e.target?.tagName?.toLowerCase();
      const isInput =
        targetTag === 'input' || targetTag === 'textarea' || e.target?.isContentEditable;
      if (isInput) return;

      const key = e.key;

      if (key === 'Tab') {
        isTabDown = true;
        lastTabTime = Date.now();
        sequence = '';
        return;
      }

      const keyLower = key ? key.toLowerCase() : '';

      // Check if Tab is currently held down or was pressed recently (within 2.5s)
      const isTabActive = isTabDown || Date.now() - lastTabTime < 2500;

      if (isTabActive) {
        // Direct support for Tab + Shift + H
        if (e.shiftKey && keyLower === 'h' && sequence === '') {
          triggerAdminAccess(e);
          return;
        }

        // Sequential support for Tab + 'S' + 'H'
        if (keyLower === 's') {
          sequence = 's';
          clearTimeout(sequenceTimer);
          sequenceTimer = setTimeout(() => {
            sequence = '';
          }, 1800);
          return;
        }

        if (keyLower === 'h' && sequence === 's') {
          // 'sh' completed while Tab was active!
          triggerAdminAccess(e);
          return;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Tab') {
        isTabDown = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      if (sequenceTimer) clearTimeout(sequenceTimer);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#EBE7DE] text-obsidian selection:bg-saharaGold selection:text-obsidian">
      {/* Global Interactive Modal & Toast & Floating Progress Control */}
      <Modal />
      <Toast />
      <ScrollProgressButton />
      {settings?.enableCustomCursor && <LuxuryCursor />}

      {/* ========================================================================= */}
      {/* ROUTE 1: HOMEPAGE                                                         */}
      {/* ========================================================================= */}
      {currentRoute === 'home' && (
        <>
          {/* 1. Hero Section (Immersive Full-Bleed Cinematic Experience) */}
          <Hero
            onNavigate={navigate}
            onNavigateContact={() => navigate('contact')}
            onNavigateServices={() => navigate('services')}
            currentRoute={currentRoute}
          />

          {/* ===================================================================== */}
          {/* ARCHITECTURAL BENTO CANVAS (Warm Stone Gutter with Rounded Cards)      */}
          {/* ===================================================================== */}
          <main className="relative z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-3.5 sm:gap-5 lg:gap-6 bg-[#EBE7DE]">
            {/* 1. Executive Social Proof & Partner Marquee (White Tone Detached Rounded Card) */}
            <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
              <SocialProofMarquee />
            </section>

            {/* 2. Bento Services Grid (Staffing Services Gallery) */}
            <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#FAF9F6] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
              <BentoGrowthCapital onNavigateService={(slug) => navigate('services')} />
            </section>
          </main>

          {/* ===================================================================== */}
          {/* 3. RECRUITMENT JOURNEY: FROM NEED TO THE RIGHT PEOPLE                 */}
          {/* (Full-Width Cinematic GSAP Story Stage)                              */}
          {/* ===================================================================== */}
          <VettingProcess
            onNavigateContact={() => navigate('contact')}
            onNavigateServices={() => navigate('services')}
          />

          {/* ===================================================================== */}
          {/* ARCHITECTURAL BENTO CANVAS — LOWER BLOCK                             */}
          {/* ===================================================================== */}
          <main className="relative z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-3.5 sm:gap-5 lg:gap-6 bg-[#EBE7DE]">

            {/* 4. Staffing Value & Interactive Sahara Orbit */}
            <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
              <Calculator
                onNavigateContact={() => navigate('contact')}
                onProceedToContact={(data) => navigate('contact', data)}
              />
            </section>

            {/* 5. Client Perspectives / Stories */}
            <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#FAF9F6] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
              <Testimonials />
            </section>

            {/* 6. Frequently Asked Questions (FAQs) */}
            <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
              <FAQ />
            </section>

            {/* 7. Speak to Staffing Experts CTA Block */}
            <section className="relative rounded-2xl sm:rounded-[20px] overflow-hidden bg-gradient-to-b from-white via-white to-[#FCEFD2] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
              <div className="animate-breathe absolute bottom-0 inset-x-0 h-[720px] bg-gradient-to-t from-saharaGold/30 via-saharaGold/10 to-transparent pointer-events-none" />
              <SpeakToExperts onNavigateContact={() => navigate('contact')} />
            </section>

            {/* 8. Global Footer */}
            <Footer onNavigate={navigate} />
          </main>
        </>
      )}

      {/* ========================================================================= */}
      {/* ROUTE 2: SERVICES PAGE                                                    */}
      {/* ========================================================================= */}
      {currentRoute === 'services' && (
        <div className="min-h-screen bg-[#F8F6F1] flex flex-col justify-between">
          <Header onNavigate={navigate} currentRoute={currentRoute} />
          <ServicesPage
            onNavigateContact={(prefill) => navigate('contact', prefill)}
            onNavigate={navigate}
          />
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={navigate} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROUTE 3: ABOUT PAGE                                                       */}
      {/* ========================================================================= */}
      {currentRoute === 'about' && (
        <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-between">
          <Header onNavigate={navigate} currentRoute={currentRoute} />
          <AboutPage
            onNavigateContact={() => navigate('contact')}
            onNavigateServices={() => navigate('services')}
          />
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={navigate} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROUTE 4: CONTACT PAGE                                                     */}
      {/* ========================================================================= */}
      {currentRoute === 'contact' && (
        <div className="min-h-screen bg-[#F8F6F1] flex flex-col justify-between">
          <Header onNavigate={navigate} currentRoute={currentRoute} />
          <ContactPage prefillData={contactPrefill} />
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={navigate} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROUTE 5: ADMIN PORTAL & EXECUTIVE DASHBOARD                               */}
      {/* ========================================================================= */}
      {currentRoute === 'admin' && (
        <AdminPage onNavigateHome={() => navigate('home')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <UIProvider>
        <ScrollProvider>
          <AppContent />
        </ScrollProvider>
      </UIProvider>
    </CMSProvider>
  );
}
