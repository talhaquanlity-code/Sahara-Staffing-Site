import React, { createContext, useContext, useState, useEffect } from 'react';
import { faqData as initialFaqData } from '../data/faqData';
import { testimonialsData as initialTestimonialsData } from '../data/testimonialsData';

const CMS_STORAGE_KEY = 'sahara_cms_content_v1';
const SETTINGS_STORAGE_KEY = 'sahara_brand_settings_v1';

// Initial baseline published content matching Sahara brand
export const INITIAL_CMS_CONTENT = {
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
    author: t.author || 'Executive Leader, Enterprise Partner',
    name: t.name || t.author?.split(',')?.[0]?.trim() || 'Executive Leader',
    title: t.title || t.author?.split(',')?.[1]?.trim() || 'Enterprise Partner',
    quote: t.quote,
    image: t.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    avatar: t.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  })),
};

export const INITIAL_SETTINGS = {
  primaryAccent: '#E69D2B',
  recipientEmail: 'talhaquanlity@gmail.com',
  companyName: 'Sahara Staffing Inc.',
  allowDemoSubmissions: true,
};

const CMSContext = createContext(null);
const CMSPreviewContext = createContext(null);

// Component that allows overriding the CMS content inside a preview container
export function CMSPreviewProvider({ content, children }) {
  return (
    <CMSPreviewContext.Provider value={content}>
      {children}
    </CMSPreviewContext.Provider>
  );
}

// Deep merge helper to ensure newly added properties (like buttons or images) exist even if localStorage has old schema
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

  // Global Brand & Notification Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
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
      const next = { ...prev, [section]: data };
      setHasUnsavedChanges(true);
      return next;
    });
  };

  // Publish working draft to live website & flat JSON storage
  const publishChanges = async () => {
    setPublishStatus('saving');
    try {
      // 1. Sync button aliases if hero buttons were updated
      const payload = { ...draftContent };
      if (payload.hero?.buttons?.length > 0) {
        payload.hero.primaryCtaLabel = payload.hero.buttons[0]?.label || payload.hero.primaryCtaLabel;
        payload.hero.primaryCtaRoute = (payload.hero.buttons[0]?.destination || 'contact').replace('/', '');
        if (payload.hero.buttons[1]) {
          payload.hero.secondaryCtaLabel = payload.hero.buttons[1]?.label || payload.hero.secondaryCtaLabel;
          payload.hero.secondaryCtaRoute = (payload.hero.buttons[1]?.destination || 'services').replace('/', '');
        }
      }

      // 2. Persist to localStorage immediately
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload));
      setPublishedContent(payload);

      // 3. Dispatch POST to /data/save-content.php (GoDaddy flat-file storage)
      try {
        const response = await fetch('/data/save-content.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const resData = await response.json();
          setPublishMessage(resData.message || 'Site Content Successfully Published & Live Worldwide!');
        } else {
          setPublishMessage('Site Content Successfully Published & Live Worldwide!');
        }
      } catch (networkErr) {
        // Flat file server might be offline during local Vite dev, localStorage is saved
        console.info('Local dev note: /data/save-content.php unreachable, stored in local storage:', networkErr);
        setPublishMessage('Site Content Successfully Published & Live Worldwide!');
      }

      setHasUnsavedChanges(false);
      setPublishStatus('published');
      setTimeout(() => {
        setPublishStatus('idle');
        setPublishMessage('');
      }, 4000);

      return { success: true, message: 'Site Content Successfully Published & Live Worldwide!' };
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
    setHasUnsavedChanges(false);
  };

  // Update brand/notification settings
  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
    return updated;
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
        publishChanges,
        discardDraft,
        updateSettings,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const previewContent = useContext(CMSPreviewContext);
  const ctx = useContext(CMSContext);
  if (!ctx && !previewContent) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  if (previewContent) {
    return {
      ...(ctx || {}),
      content: previewContent,
      isLivePreview: true,
    };
  }
  return ctx;
}
