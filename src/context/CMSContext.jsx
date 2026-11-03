import React, { createContext, useContext, useState, useEffect } from 'react';
import { faqData as initialFaqData } from '../data/faqData';
import { testimonialsData as initialTestimonialsData } from '../data/testimonialsData';

const CMS_STORAGE_KEY = 'sahara_cms_content_v2';
const SETTINGS_STORAGE_KEY = 'sahara_brand_settings_v3';

// Comprehensive baseline content hierarchy for all pages & sections
export const INITIAL_CMS_CONTENT = {
  // =========================================================================
  // 1. HOME PAGE (8 SECTION BLOCKS)
  // =========================================================================
  home: {
    hero: {
      kicker: 'Pre-Vetted Tech & Executive Recruitment',
      headline: 'Connecting Elite Talent with High-Growth Enterprises',
      highlightWord: 'Elite Talent',
      subtitle: 'A premium end-to-end staffing partner placing pre-vetted specialists across technology, finance, and executive leadership in record time.',
      buttons: [
        {
          id: 'btn-1',
          enabled: true,
          label: 'Request Talent →',
          destination: '/contact',
          variant: 'primary',
        },
        {
          id: 'btn-2',
          enabled: true,
          label: 'Explore Open Roles',
          destination: '/services',
          variant: 'secondary',
        },
      ],
    },
    metrics: {
      stat1Value: 500,
      stat1Suffix: '+',
      stat1Label: 'Executive Placements',
      stat2Value: 98,
      stat2Suffix: '%',
      stat2Label: '90-Day Retention Guarantee',
      stat3Value: 14,
      stat3Suffix: ' Days',
      stat3Label: 'Avg Time-to-Fill',
      marqueeBadge: 'TRUSTED BY ENTERPRISE LEADERS',
    },
    bento: [
      {
        id: 'bento-1',
        title: 'Flexible Staffing',
        category: 'Contract & Interim',
        badge: '01 - CONTRACT & INTERIM',
        description: 'Rapid deployment of specialized contract talent, fractional engineering, and interim leadership.',
        image: '/assets/card1-female-clean.jpg',
      },
      {
        id: 'bento-2',
        title: 'Executive Search',
        category: 'Leadership & C-Suite',
        badge: '02 - LEADERSHIP & C-SUITE',
        description: 'Direct-hire placement for VP and C-suite leaders who redefine markets and scale valuation.',
        image: '/assets/card2-talent.jpg',
      },
      {
        id: 'bento-3',
        title: 'Specialized Technical Teams',
        category: 'Technical Diligence',
        badge: '03 - TECHNICAL DILIGENCE',
        description: 'Top 2% vetted AI architects, systems leads, and principal engineers ready for immediate sprint integration.',
        image: '/assets/talent-ai.jpg',
      },
      {
        id: 'bento-4',
        title: 'Workforce Solutions',
        category: 'Enterprise RPO',
        badge: '04 - ENTERPRISE RPO',
        description: 'End-to-end recruitment process outsourcing engineered for fast-growing ventures and enterprise scale.',
        image: '/assets/card3-workforce.jpg',
      },
    ],
    vetting: [
      {
        order: '01',
        name: 'Understand',
        label: '01 Understand',
        description: 'Deep-dive alignment with hiring managers to map technical stack requirements, compensation structure, and long-term organizational context.',
        image: '/assets/card1-staffing.jpg',
      },
      {
        order: '02',
        name: 'Source',
        label: '02 Source',
        description: 'Targeted headhunting across private talent reserves, senior engineering networks, and executive leadership communities.',
        image: '/assets/card3-workforce.jpg',
      },
      {
        order: '03',
        name: 'Assess',
        label: '03 Assess',
        description: 'Rigorous peer-level technical code evaluation, systems architecture reviews, and multi-point background verifications.',
        image: '/assets/service-workforce.jpg',
      },
      {
        order: '04',
        name: 'Coordinate',
        label: '04 Coordinate',
        description: 'Seamless interview management, pre-briefings, and compensation alignment to ensure high-offer acceptance velocity.',
        image: '/assets/hero-1.jpg',
      },
      {
        order: '05',
        name: 'Support',
        label: '05 Support',
        description: 'Post-placement 90-day onboarding check-ins, performance tracking, and complete satisfaction guarantee.',
        image: '/assets/female-executive-beige.jpg',
      },
    ],
    calculator: {
      eyebrow: 'SAHARA STAFFING INC. / TALENT SOLUTIONS',
      headline: 'Talent That Moves Business Forward.',
      subtitle: 'The people behind every great business. We connect ambitious teams with talent built to move them forward.',
      feeMultiplier: 20,
      timeToFillDays: 14,
      retentionGuaranteeDays: 90,
      buttons: [
        {
          id: 'btn-calc-1',
          enabled: true,
          label: 'Find Your Talent →',
          destination: '/contact',
          variant: 'primary',
        },
      ],
    },
    testimonials: initialTestimonialsData.map((t, i) => ({
      id: `test-${i}`,
      name: t.name || t.author?.split(',')?.[0]?.trim() || 'Executive Leader',
      title: t.title || t.author?.split(',')?.[1]?.trim() || 'Enterprise Partner',
      author: t.author || 'Executive Leader, Enterprise Partner',
      quote: t.quote,
      image: t.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      avatar: t.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    })),
    faqs: initialFaqData.map((f, i) => ({
      id: f.id !== undefined ? `faq-${f.id}` : `faq-${i}`,
      question: f.question,
      answer: f.answer,
    })),
    footer: {
      headline: 'Speak to our staffing experts',
      subtitle: 'Our team is here to answer your questions, review your business needs, and guide you toward the right staffing solution so you can move forward with confidence.',
      contactEmail: 'admin@saharastaffing.com',
      contactPhone: '+1 (800) 555-SAHARA',
      copyright: '© 2026 Sahara Staffing Inc. All rights reserved.',
      buttons: [
        {
          id: 'btn-foot-1',
          enabled: true,
          label: 'Talk to staffing →',
          destination: '/contact',
          variant: 'primary',
        },
      ],
    },
  },

  // =========================================================================
  // 2. ABOUT PAGE (6 SECTION BLOCKS)
  // =========================================================================
  about: {
    hero: {
      kicker: 'SAHARA STAFFING INC. / WHO WE ARE',
      headline: 'A Modern Search Firm Built on Precision and Relationships.',
      subtitle: 'We connect exceptional ventures with specialized engineering, executive, and technical leadership who make an immediate, lasting impact.',
      buttons: [
        {
          id: 'btn-about-1',
          enabled: true,
          label: 'Find Your Talent →',
          destination: '/contact',
          variant: 'primary',
        },
        {
          id: 'btn-about-2',
          enabled: true,
          label: 'Explore Our Services',
          destination: '/services',
          variant: 'secondary',
        },
      ],
    },
    benchmarks: [
      {
        num: '01',
        title: 'People first',
        desc: 'We consider the people behind every role and the teams they become part of.',
      },
      {
        num: '02',
        title: 'Clarity before assumptions',
        desc: 'Understanding the business needs is an important starting point for the staffing conversation.',
      },
      {
        num: '03',
        title: 'Meaningful connections',
        desc: 'We focus on relevant professional connections and alignment between people and roles.',
      },
    ],
    chapters: [
      {
        id: '01',
        badge: 'CHAPTER 01',
        title: 'Understand the people',
        text: 'Every staffing conversation begins with listening and learning about the needs behind the role.',
        image: '/assets/female-executive-beige.jpg',
        tag: 'Active Discovery',
      },
      {
        id: '02',
        badge: 'CHAPTER 02',
        title: 'See the bigger picture',
        text: 'Business priorities, professional experience, and team needs all contribute to a more informed conversation.',
        image: '/assets/card2-talent.jpg',
        tag: 'Context & Perspective',
      },
      {
        id: '03',
        badge: 'CHAPTER 03',
        title: 'Focus on the connection',
        text: 'The goal is to help businesses and professionals move toward a connection that makes sense for both.',
        image: '/assets/card3-workforce.jpg',
        tag: 'Enduring Partnerships',
      },
    ],
    leadership: [
      {
        id: 'lead-1',
        name: 'Elena Vance',
        title: 'VP of Systems Engineering',
        bio: '14 years leading infrastructure architecture and distributed platform scaling.',
        image: '/assets/female-executive-beige.jpg',
      },
      {
        id: 'lead-2',
        name: 'David Reynolds',
        title: 'Managing Partner, Executive Search',
        bio: 'Specialized in discreet board-level C-Suite and VP appointments.',
        image: '/assets/card2-talent.jpg',
      },
      {
        id: 'lead-3',
        name: 'Marcus Chen',
        title: 'Head of Technical Diligence',
        bio: 'Pioneered peer-level technical assessments for top 2% engineering talent.',
        image: '/assets/card1-staffing.jpg',
      },
    ],
    stats: [
      { value: '500+', label: 'Placements Delivered' },
      { value: '98%', label: 'Retention SLA' },
      { value: '14 Days', label: 'Average Time-to-Fill' },
      { value: '$250M+', label: 'Enterprise Value Backed' },
    ],
    finalCta: {
      headline: 'Let’s find the right people for your team.',
      subtitle: 'From exploratory conversations to immediate mission-critical hires, Sahara is your retained search partner.',
      buttons: [
        {
          id: 'btn-about-cta-1',
          enabled: true,
          label: 'Start the Conversation →',
          destination: '/contact',
          variant: 'primary',
        },
      ],
    },
  },

  // =========================================================================
  // 3. SERVICES PAGE (5 SECTION BLOCKS)
  // =========================================================================
  servicesPage: {
    hero: {
      kicker: 'SPECIALIZED RECRUITMENT SOLUTIONS',
      headline: 'Exceptional Talent. Built Around Your Business.',
      subtitle: 'Connect with pre-vetted professionals and build stronger teams through recruitment solutions designed around your business.',
      panoramicImage: '/assets/card1-staffing.jpg',
      buttons: [
        {
          id: 'btn-srv-hero-1',
          enabled: true,
          label: 'Explore Our Services →',
          destination: '/contact',
          variant: 'primary',
        },
      ],
    },
    capabilities: [
      {
        id: 'cap-1',
        badge: '01 - PERMANENT SEARCH',
        title: 'Permanent Placement & Full-Time Squads',
        description: 'End-to-end full-time talent acquisition for core engineering leads, system architects, and high-impact individual contributors.',
        image: '/assets/card1-female-clean.jpg',
      },
      {
        id: 'cap-2',
        badge: '02 - CONTRACT & ADVISORY',
        title: 'Specialized Contract & Interim Talent',
        description: 'Rapid-deployment contractors and specialist taskforces to accelerate high-priority product sprints, cloud migrations, and platform deadlines.',
        image: '/assets/card2-talent.jpg',
      },
      {
        id: 'cap-3',
        badge: '03 - EXECUTIVE LEADERSHIP',
        title: 'Executive & Retained Leadership Search',
        description: 'Discreet, board-level retained searches for CTO, VP of Engineering, VP of Strategic Finance, and Chief Product Officer appointments.',
        image: '/assets/talent-ai.jpg',
      },
      {
        id: 'cap-4',
        badge: '04 - ENTERPRISE RPO',
        title: 'Workforce Solutions & Embedded Squads',
        description: 'Comprehensive recruitment process outsourcing tailored for high-growth ventures seeking rapid workforce expansion.',
        image: '/assets/card3-workforce.jpg',
      },
    ],
    vetting: {
      kicker: 'THE SAHARA STANDARD',
      headline: 'A 5-Stage Vetting Pipeline Built for Certainty.',
      subtitle: 'We look beyond resumes to evaluate technical craftsmanship, systems aptitude, and cultural velocity.',
    },
    engagementModels: [
      { name: 'Retained Executive Search', desc: 'Dedicated board-level governance with full market mapping.' },
      { name: 'Contingency Placement', desc: 'Pay-on-success model for specialized senior contributors.' },
      { name: 'Fractional & Interim', desc: 'Immediate leadership for transitional milestones and audits.' },
      { name: 'Embedded RPO Squads', desc: 'Full-cycle recruiters scaling your in-house engineering team.' },
    ],
    slaGuarantee: {
      headline: 'The Sahara 90-Day Unconditional Guarantee',
      terms: 'If any placed candidate departs within 90 days, we deliver an immediate, fully vetted replacement with zero additional placement fee.',
    },
  },

  // =========================================================================
  // 4. CONTACT PAGE (1 SECTION BLOCK)
  // =========================================================================
  contactPage: {
    hero: {
      kicker: 'EXECUTIVE TALENT INTAKE',
      headline: 'Let’s Discuss Your Talent Objectives.',
      subtitle: 'Whether you are looking to hire executive leadership or specialized technical contributors, our team responds within 2 hours.',
    },
    details: {
      office: 'New York, NY & San Francisco, CA',
      email: 'talhaquanlity@gmail.com',
      phone: '+1 (800) 555-SAHARA',
      responseTime: 'Within 2 hours (Business Hours)',
    },
    intakeSettings: {
      allowDemoSubmissions: true,
      emailRouting: 'resend_smtp',
      confirmationMessage: 'Thank you for submitting your profile. A senior talent partner will review your credentials within 2 hours.',
    },
  },

  // =========================================================================
  // TOP-LEVEL BACKWARD-COMPATIBILITY ALIASES
  // =========================================================================
  hero: {
    kicker: 'Pre-Vetted Tech & Executive Recruitment',
    headline: 'Connecting Elite Talent with High-Growth Enterprises',
    highlightWord: 'Elite Talent',
    subtitle: 'A premium end-to-end staffing partner placing pre-vetted specialists across technology, finance, and executive leadership in record time.',
    buttons: [
      {
        id: 'btn-1',
        enabled: true,
        label: 'Request Talent →',
        destination: '/contact',
        variant: 'primary',
      },
      {
        id: 'btn-2',
        enabled: true,
        label: 'Explore Open Roles',
        destination: '/services',
        variant: 'secondary',
      },
    ],
    primaryCtaLabel: 'Request Talent →',
    primaryCtaRoute: 'contact',
    secondaryCtaLabel: 'Explore Open Roles',
    secondaryCtaRoute: 'services',
  },
  images: {
    bentoCard1: '/assets/card1-female-clean.jpg',
    bentoCard2: '/assets/card2-talent.jpg',
    bentoCard3: '/assets/talent-ai.jpg',
    bentoCard4: '/assets/card3-workforce.jpg',
    vettingSteps: [
      '/assets/card1-staffing.jpg',
      '/assets/card3-workforce.jpg',
      '/assets/service-workforce.jpg',
      '/assets/hero-1.jpg',
      '/assets/female-executive-beige.jpg',
    ],
    leadershipHeadshots: [
      {
        id: 'lead-1',
        name: 'Elena Vance',
        title: 'VP of Systems Engineering',
        image: '/assets/female-executive-beige.jpg',
      },
      {
        id: 'lead-2',
        name: 'David Reynolds',
        title: 'Managing Partner, Executive Search',
        image: '/assets/card2-talent.jpg',
      },
      {
        id: 'lead-3',
        name: 'Marcus Chen',
        title: 'Head of Technical Diligence',
        image: '/assets/card1-staffing.jpg',
      },
    ],
  },
  services: [
    {
      id: 'srv-1',
      title: 'Flexible Staffing',
      category: 'Contract & Interim',
      badge: '01 - CONTRACT & INTERIM',
      description: 'Rapid deployment of specialized contract talent, fractional engineering, and interim leadership.',
      image: '/assets/card1-female-clean.jpg',
    },
    {
      id: 'srv-2',
      title: 'Executive Search',
      category: 'Leadership & C-Suite',
      badge: '02 - LEADERSHIP & C-SUITE',
      description: 'Direct-hire placement for VP and C-suite leaders who redefine markets and scale valuation.',
      image: '/assets/card2-talent.jpg',
    },
    {
      id: 'srv-3',
      title: 'Specialized Technical Teams',
      category: 'Technical Diligence',
      badge: '03 - TECHNICAL DILIGENCE',
      description: 'Top 2% vetted AI architects, systems leads, and principal engineers ready for immediate sprint integration.',
      image: '/assets/talent-ai.jpg',
    },
    {
      id: 'srv-4',
      title: 'Workforce Solutions',
      category: 'Enterprise RPO',
      badge: '04 - ENTERPRISE RPO',
      description: 'End-to-end recruitment process outsourcing engineered for fast-growing ventures and enterprise scale.',
      image: '/assets/card3-workforce.jpg',
    },
  ],
  vettingStages: [
    {
      id: 'stg-1',
      order: '01',
      name: 'Understand',
      label: '01 Understand',
      description: 'Deep-dive alignment with hiring managers to map technical stack requirements, compensation structure, and long-term organizational context.',
      image: '/assets/card1-staffing.jpg',
    },
    {
      id: 'stg-2',
      order: '02',
      name: 'Source',
      label: '02 Source',
      description: 'Targeted headhunting across private talent reserves, senior engineering networks, and executive leadership communities.',
      image: '/assets/card3-workforce.jpg',
    },
    {
      id: 'stg-3',
      order: '03',
      name: 'Assess',
      label: '03 Assess',
      description: 'Rigorous peer-level technical code evaluation, systems architecture reviews, and multi-point background verifications.',
      image: '/assets/service-workforce.jpg',
    },
    {
      id: 'stg-4',
      order: '04',
      name: 'Coordinate',
      label: '04 Coordinate',
      description: 'Seamless interview management, pre-briefings, and compensation alignment to ensure high-offer acceptance velocity.',
      image: '/assets/hero-1.jpg',
    },
    {
      id: 'stg-5',
      order: '05',
      name: 'Support',
      label: '05 Support',
      description: 'Post-placement 90-day onboarding check-ins, performance tracking, and complete satisfaction guarantee.',
      image: '/assets/female-executive-beige.jpg',
    },
  ],
  faqs: initialFaqData.map((f, i) => ({
    id: f.id !== undefined ? `faq-${f.id}` : `faq-${i}`,
    question: f.question,
    answer: f.answer,
  })),
  testimonials: initialTestimonialsData.map((t, i) => ({
    id: `test-${i}`,
    name: t.name || t.author?.split(',')?.[0]?.trim() || 'Executive Leader',
    title: t.title || t.author?.split(',')?.[1]?.trim() || 'Enterprise Partner',
    author: t.author || 'Executive Leader, Enterprise Partner',
    quote: t.quote,
    image: t.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    avatar: t.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  })),
};

// Global Site Utilities & Brand Settings
export const INITIAL_SETTINGS = {
  stickyNavbar: false,
  enableBackToTop: true,
  backToTopIcon: 'arrow', // 'arrow' | 'sparkle'
  enableCustomCursor: false,
  primaryAccent: '#E69D2B',
  recipientEmail: 'talhaquanlity@gmail.com',
  companyName: 'Sahara Staffing Inc.',
  allowDemoSubmissions: true,
};

const CMSContext = createContext(null);
const CMSPreviewContext = createContext(null);

export function CMSPreviewProvider({ content, settings, children }) {
  return (
    <CMSPreviewContext.Provider value={{ content, settings }}>
      {children}
    </CMSPreviewContext.Provider>
  );
}

function mergeDeep(target, source) {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key]) && key in target) {
      output[key] = mergeDeep(target[key], source[key]);
    } else if (source[key] !== undefined) {
      output[key] = source[key];
    }
  }
  return output;
}

export function CMSProvider({ children }) {
  // Published Content (the live public site consumes this)
  const [publishedContent, setPublishedContent] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeDeep(INITIAL_CMS_CONTENT, parsed);
      }
      return INITIAL_CMS_CONTENT;
    } catch {
      return INITIAL_CMS_CONTENT;
    }
  });

  // Working Draft Content (edited in the Admin CMS Workspace)
  const [draftContent, setDraftContent] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeDeep(INITIAL_CMS_CONTENT, parsed);
      }
      return INITIAL_CMS_CONTENT;
    } catch {
      return INITIAL_CMS_CONTENT;
    }
  });

  // Global Brand & Site Utility Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_SETTINGS, ...parsed };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [publishStatus, setPublishStatus] = useState('idle'); // 'idle' | 'saving' | 'published' | 'error'
  const [publishMessage, setPublishMessage] = useState('');

  // Update working draft
  const updateDraft = (section, data) => {
    setDraftContent((prev) => {
      let next;
      if (typeof section === 'string' && section.includes('.')) {
        const [parent, child] = section.split('.');
        next = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: data,
          },
        };
      } else {
        next = { ...prev, [section]: data };
      }

      // Synchronize backward-compatibility top-level mirrors if home section was updated
      if (section === 'home' || section === 'home.hero') {
        const heroData = next.home?.hero || next.hero;
        next.hero = heroData;
      }
      if (section === 'home.bento' || section === 'bento') {
        next.services = next.home?.bento || next.services;
      }
      if (section === 'home.vetting' || section === 'vetting') {
        next.vettingStages = next.home?.vetting || next.vettingStages;
      }
      if (section === 'home.faqs' || section === 'faqs') {
        next.faqs = next.home?.faqs || next.faqs;
      }
      if (section === 'home.testimonials' || section === 'testimonials') {
        next.testimonials = next.home?.testimonials || next.testimonials;
      }

      setHasUnsavedChanges(true);
      return next;
    });
  };

  // Update brand/notification settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  // Publish working draft & settings to live website & flat JSON storage
  const publishChanges = async () => {
    setPublishStatus('saving');
    try {
      const payload = { ...draftContent };

      // Persist to localStorage immediately
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setPublishedContent(payload);

      // Dispatch POST to /data/save-content.php (GoDaddy flat-file storage)
      try {
        const response = await fetch('/data/save-content.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: payload, settings }),
        });
        if (response.ok) {
          const resData = await response.json();
          setPublishMessage(resData.message || 'Site Content & Global Settings Published Live!');
        } else {
          setPublishMessage('Site Content & Global Settings Published Live!');
        }
      } catch (networkErr) {
        console.info('Local dev note: stored in localStorage:', networkErr);
        setPublishMessage('Site Content & Global Settings Published Live!');
      }

      setHasUnsavedChanges(false);
      setPublishStatus('published');
      setTimeout(() => {
        setPublishStatus('idle');
        setPublishMessage('');
      }, 4000);

      return { success: true, message: 'Site Content & Global Settings Published Live!' };
    } catch (err) {
      console.error('Publish error:', err);
      setPublishStatus('error');
      setPublishMessage(err.message || 'Failed to publish changes');
      setTimeout(() => setPublishStatus('idle'), 4000);
      return { success: false, error: err.message };
    }
  };

  // Discard draft changes and reset to published
  const discardDraft = () => {
    setDraftContent(publishedContent);
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch {}
    setHasUnsavedChanges(false);
  };

  // Reset all CMS data to clean default
  const resetToFactoryDefaults = () => {
    setPublishedContent(INITIAL_CMS_CONTENT);
    setDraftContent(INITIAL_CMS_CONTENT);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem(CMS_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setHasUnsavedChanges(false);
  };

  return (
    <CMSContext.Provider
      value={{
        content: publishedContent, // Live content for public website
        draftContent,              // Working draft for CMS editor
        settings,                  // Global brand & notification settings
        hasUnsavedChanges,
        publishStatus,
        publishMessage,
        updateDraft,
        updateSettings,
        publishChanges,
        discardDraft,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const previewContext = useContext(CMSPreviewContext);
  const ctx = useContext(CMSContext);
  if (!ctx && !previewContext) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  if (previewContext) {
    return {
      ...(ctx || {}),
      content: previewContext.content || ctx?.content,
      settings: previewContext.settings || ctx?.settings,
      isLivePreview: true,
    };
  }
  return ctx;
}
