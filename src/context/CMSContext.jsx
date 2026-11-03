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
    primaryCtaLabel: 'Get Staffed Now',
    primaryCtaRoute: 'contact',
    secondaryCtaLabel: 'Explore All Services',
    secondaryCtaRoute: 'services',
  },
  services: [
    {
      id: 'srv-1',
      title: 'Permanent Placement & Full-Time Squads',
      category: 'Permanent Search',
      description: 'End-to-end full-time talent acquisition for core engineering leads, system architects, and high-impact individual contributors with full 90-day retention backing.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      badge: 'Tier-1 Direct Hire',
    },
    {
      id: 'srv-2',
      title: 'Specialized Contract & Project Talent',
      category: 'Contract & Advisory',
      description: 'Rapid-deployment contractors and specialist taskforces to accelerate high-priority product sprints, cloud migrations, and critical platform deadlines.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      badge: 'Rapid 14-Day Deployment',
    },
    {
      id: 'srv-3',
      title: 'Executive & Retained Leadership Search',
      category: 'Executive Search',
      description: 'Discreet, board-level retained searches for CTO, VP of Engineering, VP of Strategic Finance, and Chief Product Officer appointments.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      badge: 'Retained Governance',
    },
  ],
  vettingStages: [
    {
      id: 'stg-1',
      order: '01',
      name: 'Understand',
      label: '01 Understand',
      description: 'Deep-dive alignment with hiring managers to map technical stack requirements, compensation structure, and long-term organizational context.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'stg-2',
      order: '02',
      name: 'Source',
      label: '02 Source',
      description: 'Targeted headhunting across private talent reserves, senior engineering networks, and executive leadership communities.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'stg-3',
      order: '03',
      name: 'Assess',
      label: '03 Assess',
      description: 'Rigorous peer-level technical code evaluation, systems architecture reviews, and multi-point background verifications.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'stg-4',
      order: '04',
      name: 'Coordinate',
      label: '04 Coordinate',
      description: 'Seamless interview management, pre-briefings, and compensation alignment to ensure high-offer acceptance velocity.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'stg-5',
      order: '05',
      name: 'Support',
      label: '05 Support',
      description: 'Post-placement 90-day onboarding check-ins, performance tracking, and complete satisfaction guarantee.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    },
  ],
  faqs: initialFaqData.map((f, i) => ({
    id: f.id !== undefined ? `faq-${f.id}` : `faq-${i}`,
    question: f.question,
    answer: f.answer,
  })),
  testimonials: initialTestimonialsData.map((t, i) => ({
    id: `test-${i}`,
    quote: t.quote,
    author: t.author,
    image: t.image,
    isSampleDraft: true, // Marked as sample/draft in accordance with Section 09
  })),
};

export const INITIAL_SETTINGS = {
  primaryAccent: '#E69D2B',
  recipientEmail: 'talhaquanlity@gmail.com',
  companyName: 'Sahara Staffing Inc.',
  allowDemoSubmissions: true,
};

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  // Published Content (the live public site consumes this)
  const [publishedContent, setPublishedContent] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CMS_CONTENT;
    } catch {
      return INITIAL_CMS_CONTENT;
    }
  });

  // Working Draft Content (edited in the Admin CMS Workspace)
  const [draftContent, setDraftContent] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CMS_CONTENT;
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

  // Update working draft
  const updateDraft = (section, data) => {
    setDraftContent((prev) => {
      const next = { ...prev, [section]: data };
      setHasUnsavedChanges(true);
      return next;
    });
  };

  // Publish working draft to live website
  const publishChanges = async () => {
    setPublishStatus('saving');
    try {
      // Simulate network / Supabase persist
      await new Promise((resolve) => setTimeout(resolve, 400));
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(draftContent));
      setPublishedContent(draftContent);
      setHasUnsavedChanges(false);
      setPublishStatus('published');
      setTimeout(() => setPublishStatus('idle'), 3000);
      return { success: true };
    } catch (err) {
      setPublishStatus('error');
      setTimeout(() => setPublishStatus('idle'), 3000);
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
  const ctx = useContext(CMSContext);
  if (!ctx) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return ctx;
}

