import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  RotateCcw,
  Monitor,
  Smartphone,
  Lock,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  X,
  Home,
  Info,
  Briefcase,
  PhoneCall,
  Settings as SettingsIcon,
  MousePointer,
  ArrowUpCircle,
  Layers,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { useCMS, CMSPreviewProvider } from '../../context/CMSContext';

// Import public site components for real-time live preview rendering
import Header from '../Header';
import Hero from '../Hero';
import SocialProofMarquee from '../SocialProofMarquee';
import BentoGrowthCapital from '../BentoGrowthCapital';
import VettingProcess from '../VettingProcess';
import Calculator from '../Calculator';
import Testimonials from '../Testimonials';
import FAQ from '../FAQ';
import SpeakToExperts from '../SpeakToExperts';
import Footer from '../Footer';

// Import subpages for preview navigation
import AboutPage from '../../pages/AboutPage';
import ServicesPage from '../../pages/ServicesPage';
import ContactPage from '../../pages/ContactPage';

export default function CMSWorkspace() {
  const {
    draftContent,
    content: publishedContent,
    settings,
    updateDraft,
    updateSettings,
    publishChanges,
    discardDraft,
    hasUnsavedChanges,
    publishStatus,
    publishMessage,
  } = useCMS();

  // =========================================================================
  // 1. TOP PAGE TAB SWITCHER STATE
  // 'home' | 'about' | 'services' | 'contact' | 'settings'
  // =========================================================================
  const [activePageTab, setActivePageTab] = useState('home');

  // Active expanded section block per page
  const [activeBlock, setActiveBlock] = useState('home-block-01');

  // Preview viewport mode: 'desktop' (Laptop 1280px) | 'mobile' (Phone 375px)
  const [viewportMode, setViewportMode] = useState('desktop');

  // Preview reload key to force re-render when clicking browser refresh
  const [previewKey, setPreviewKey] = useState(0);

  // Drag over states for file dropzones
  const [dragOverKey, setDragOverKey] = useState(null);

  // Confirm delete modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Ref to the live preview container for smooth section jumping
  const previewScrollRef = useRef(null);
  const mobileChassisRef = useRef(null);

  // ---------------------------------------------------------------------------
  // AUTO-SCROLL TO SECTION SYNC
  // When a section block is expanded or clicked, scroll preview to that section
  // ---------------------------------------------------------------------------
  const handleBlockToggle = (blockId, domAnchorId) => {
    setActiveBlock((prev) => (prev === blockId ? null : blockId));
    if (domAnchorId) {
      setTimeout(() => {
        const targetContainer = viewportMode === 'desktop' ? previewScrollRef.current : mobileChassisRef.current;
        const el = targetContainer?.querySelector(domAnchorId) || document.querySelector(domAnchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    }
  };

  // Scroll to top of preview when switching page tabs
  useEffect(() => {
    if (previewScrollRef.current) {
      previewScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (mobileChassisRef.current) {
      mobileChassisRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Set default active block for selected page
    if (activePageTab === 'home') setActiveBlock('home-block-01');
    else if (activePageTab === 'about') setActiveBlock('about-block-01');
    else if (activePageTab === 'services') setActiveBlock('services-block-01');
    else if (activePageTab === 'contact') setActiveBlock('contact-block-01');
    else if (activePageTab === 'settings') setActiveBlock('global-settings');
  }, [activePageTab]);

  // ---------------------------------------------------------------------------
  // GENERIC DRAG-AND-DROP FILE UPLOAD TO BASE64
  // ---------------------------------------------------------------------------
  const handleFileUpload = (file, callback) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ---------------------------------------------------------------------------
  // STRICT 2-BUTTON MANAGER HELPER COMPONENT
  // ---------------------------------------------------------------------------
  const renderStrictButtonManager = ({
    buttons = [],
    onAdd,
    onRemove,
    onToggle,
    onUpdate,
    sectionName = 'Section',
  }) => {
    const btnCount = buttons.length;
    return (
      <div className="pt-3 border-t border-[#1E293B]/70 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              CTA Button Manager
              <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-[#E69D2B]">
                {btnCount}/2 Configured
              </span>
            </span>
            <p className="text-[10px] text-[#64748B] mt-0.5 font-inter">
              Strict max 2 buttons. Renders 0, 1, or 2 buttons on {sectionName}.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdd}
            disabled={btnCount >= 2}
            className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[11px] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title={btnCount >= 2 ? 'Strict maximum of 2 buttons reached' : 'Add Button'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Button</span>
          </button>
        </div>

        {btnCount === 0 && (
          <div className="p-3 rounded-lg bg-[#131926] border border-dashed border-[#1E293B] text-center">
            <span className="text-[11px] text-[#94A3B8]">
              No CTA buttons configured for this section.
            </span>
          </div>
        )}

        <div className="space-y-2.5">
          {buttons.map((btn, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={btn.id || idx}
                className={`p-3 rounded-xl border transition-all ${
                  btn.enabled ? 'bg-[#131926] border-[#1E293B]' : 'bg-[#131926]/50 border-[#1E293B]/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E293B]/60">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider font-mono ${
                        isPrimary
                          ? 'bg-[#E69D2B]/20 text-[#E69D2B] border border-[#E69D2B]/30'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}
                    >
                      {isPrimary ? 'Button 1: Primary Gold Pill' : 'Button 2: Secondary Outline Pill'}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggle(idx)}
                      className={`text-[10px] font-medium flex items-center gap-1 transition-colors ${
                        btn.enabled ? 'text-emerald-400' : 'text-[#64748B]'
                      }`}
                    >
                      {btn.enabled ? (
                        <>
                          <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5 text-[#64748B]" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="text-[#64748B] hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                    title="Remove button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={btn.label || ''}
                      onChange={(e) => onUpdate(idx, 'label', e.target.value)}
                      placeholder={isPrimary ? 'Request Talent →' : 'Explore Open Roles'}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white text-xs font-inter focus:border-[#E69D2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                      Link Destination
                    </label>
                    <select
                      value={btn.destination || '/contact'}
                      onChange={(e) => onUpdate(idx, 'destination', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white text-xs font-inter focus:border-[#E69D2B] focus:outline-none cursor-pointer"
                    >
                      <option value="/contact">/contact — Talent Request &amp; Contact</option>
                      <option value="/services">/services — Practice Chapters</option>
                      <option value="/about">/about — Company &amp; Mindset</option>
                      <option value="#calculator">#calculator — Retainer Calculator</option>
                      <option value="#vetting">#vetting — 5-Stage Diligence</option>
                      <option value="#testimonials">#testimonials — Client Success</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // GENERIC IMAGE UPLOAD & URL FIELD HELPER
  // ---------------------------------------------------------------------------
  const renderImageDropzone = ({
    title,
    currentValue,
    defaultValue,
    onUpdate,
    onReset,
    fieldKey,
  }) => {
    return (
      <div className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white font-mono">{title}</span>
          {defaultValue && currentValue !== defaultValue && (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] text-[#E69D2B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Default</span>
            </button>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-20 h-14 rounded-lg overflow-hidden border border-[#1E293B] bg-black/40 shrink-0">
            <img src={currentValue} alt={title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 relative">
            <LinkIcon className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={currentValue || ''}
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="https://... or /assets/..."
              className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white text-[11px] focus:border-[#E69D2B] focus:outline-none font-mono"
            />
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverKey(fieldKey);
          }}
          onDragLeave={() => setDragOverKey(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverKey(null);
            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0], onUpdate);
            }
          }}
          className={`p-2 rounded-lg border border-dashed transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
            dragOverKey === fieldKey
              ? 'border-[#E69D2B] bg-[#E69D2B]/10 text-white'
              : 'border-[#1E293B] hover:border-[#E69D2B]/60 text-[#64748B] hover:text-[#94A3B8]'
          }`}
          onClick={() => {
            const el = document.getElementById(`upload-${fieldKey}`);
            if (el) el.click();
          }}
        >
          <input
            type="file"
            id={`upload-${fieldKey}`}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], onUpdate);
              }
            }}
          />
          <Upload className="w-3.5 h-3.5" />
          <span className="text-[10.5px]">Drag &amp; Drop local image or <strong className="text-[#E69D2B]">browse</strong></span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* GLOBAL GREEN SUCCESS TOAST BANNER                                     */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {publishStatus === 'published' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 via-[#064e3b]/90 to-emerald-950/90 border border-emerald-500/50 text-white shadow-2xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-wide">
                  {publishMessage || 'Site Content & Global Settings Published Live!'}
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  Published to GoDaddy flat-file storage (/data/save-content.php) and synchronized worldwide.
                </p>
              </div>
            </div>
            <button
              onClick={() => {}}
              className="text-emerald-300 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* WORKSPACE TOP ACTION BAR                                              */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1E293B]/70">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
              Site Content CMS &amp; Live Customizer
            </h1>
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
              {hasUnsavedChanges ? (
                <span className="text-[#E69D2B] bg-[#E69D2B]/10 px-2 py-0.5 rounded border border-[#E69D2B]/30 animate-pulse">
                  [Draft Changes Pending]
                </span>
              ) : (
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  [Synchronized With Site]
                </span>
              )}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 font-inter">
            Multi-page CMS editor with auto-scrolling live preview canvas, image replacement dropzones, and global site utility toggles.
          </p>
        </div>

        {/* Global Save & Discard Actions */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={discardDraft}
              className="text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer py-2 px-3 rounded-lg border border-white/10 hover:border-white/25"
            >
              Discard Changes
            </button>
          )}

          <button
            type="button"
            onClick={publishChanges}
            disabled={publishStatus === 'saving' || !hasUnsavedChanges}
            className="bg-[#E69D2B] text-[#0B0F17] font-bold px-6 py-2.5 rounded-xl hover:bg-amber-400 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95"
          >
            {publishStatus === 'saving' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0B0F17]" />
                <span className="text-xs">Publishing Globally...</span>
              </>
            ) : publishStatus === 'published' ? (
              <>
                <Check className="w-4 h-4 text-[#0B0F17] stroke-[3]" />
                <span className="text-xs">Published Live</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#0B0F17]" />
                <span className="text-xs">Save &amp; Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. TOP PAGE TAB NAVIGATION STRIP (MINIMAL & ANIMATED)                 */}
      {/* ===================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'home', label: 'Home Page', icon: Home },
          { id: 'about', label: 'About Page', icon: Info },
          { id: 'services', label: 'Services Page', icon: Briefcase },
          { id: 'contact', label: 'Contact Page', icon: PhoneCall },
          { id: 'settings', label: 'Global Settings', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePageTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePageTab(tab.id)}
              className={`relative px-5 py-2.5 rounded-xl font-sans text-xs font-bold transition-colors cursor-pointer select-none flex items-center gap-2 shrink-0 ${
                isActive ? 'text-[#0B0F17]' : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCmsTab"
                  className="absolute inset-0 bg-[#E69D2B] rounded-xl shadow-md z-0"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
                />
              )}
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-[#0B0F17]' : 'text-[#E69D2B]'}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* MASTER SPLIT-SCREEN WORKSPACE                                         */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =================================================================== */}
        {/* LEFT COLUMN: PAGE-SPECIFIC SECTION BLOCKS (6 COLUMNS)               */}
        {/* =================================================================== */}
        <div
          data-lenis-prevent
          className="lg:col-span-6 h-[calc(100vh-210px)] min-h-[520px] overflow-y-auto overscroll-contain pr-3 custom-scrollbar"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#E69D2B #131926' }}
        >

          {/* ================================================================= */}
          {/* TAB A: HOME PAGE (8 SECTION BLOCKS)                               */}
          {/* ================================================================= */}
          {activePageTab === 'home' && (
            <div className="space-y-3">
              {/* BLOCK 01: HERO SECTION */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-01', '#hero-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 01: Hero Section
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Headline, Subtitle, Kicker, and Strict Max 2 Buttons Manager
                      </p>
                    </div>
                  </div>
                  {activeBlock === 'home-block-01' ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {activeBlock === 'home-block-01' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Kicker Eyebrow Badge
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.hero?.kicker || draftContent.hero?.kicker || ''}
                        onChange={(e) => {
                          const updated = { ...(draftContent.home?.hero || draftContent.hero), kicker: e.target.value };
                          updateDraft('home.hero', updated);
                          updateDraft('hero', updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.hero?.headline || draftContent.hero?.headline || ''}
                        onChange={(e) => {
                          const updated = { ...(draftContent.home?.hero || draftContent.hero), headline: e.target.value };
                          updateDraft('home.hero', updated);
                          updateDraft('hero', updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Gold Highlight Word (Inline Accent)
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.hero?.highlightWord || draftContent.hero?.highlightWord || ''}
                        onChange={(e) => {
                          const updated = { ...(draftContent.home?.hero || draftContent.hero), highlightWord: e.target.value };
                          updateDraft('home.hero', updated);
                          updateDraft('hero', updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-semibold focus:border-[#E69D2B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Supporting Subtitle Paragraph
                      </label>
                      <textarea
                        rows={2}
                        value={draftContent.home?.hero?.subtitle || draftContent.hero?.subtitle || ''}
                        onChange={(e) => {
                          const updated = { ...(draftContent.home?.hero || draftContent.hero), subtitle: e.target.value };
                          updateDraft('home.hero', updated);
                          updateDraft('hero', updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Button Manager */}
                    {renderStrictButtonManager({
                      buttons: draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [],
                      sectionName: 'Hero Section',
                      onAdd: () => {
                        const current = draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [];
                        if (current.length >= 2) return;
                        const isFirst = current.length === 0;
                        const newBtn = {
                          id: 'btn-' + Date.now(),
                          enabled: true,
                          label: isFirst ? 'Request Talent →' : 'Explore Open Roles',
                          destination: isFirst ? '/contact' : '/services',
                          variant: isFirst ? 'primary' : 'secondary',
                        };
                        const updated = [...current, newBtn];
                        updateDraft('home.hero', { ...(draftContent.home?.hero || draftContent.hero), buttons: updated });
                        updateDraft('hero', { ...draftContent.hero, buttons: updated });
                      },
                      onRemove: (idx) => {
                        const current = draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [];
                        const updated = current.filter((_, i) => i !== idx);
                        updateDraft('home.hero', { ...(draftContent.home?.hero || draftContent.hero), buttons: updated });
                        updateDraft('hero', { ...draftContent.hero, buttons: updated });
                      },
                      onToggle: (idx) => {
                        const current = [...(draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('home.hero', { ...(draftContent.home?.hero || draftContent.hero), buttons: current });
                        updateDraft('hero', { ...draftContent.hero, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.home?.hero?.buttons || draftContent.hero?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('home.hero', { ...(draftContent.home?.hero || draftContent.hero), buttons: current });
                        updateDraft('hero', { ...draftContent.hero, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>

              {/* BLOCK 02: PARTNERS & METRICS STRIP */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-02', '#metrics-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      02
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 02: Partners &amp; Metrics Strip
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        3 Core Metrics, SLA counts, and Enterprise Marquee Header
                      </p>
                    </div>
                  </div>
                  {activeBlock === 'home-block-02' ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {activeBlock === 'home-block-02' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Partner Ticker Kicker Label
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.metrics?.marqueeBadge || 'TRUSTED BY ENTERPRISE LEADERS'}
                        onChange={(e) => updateDraft('home.metrics', { ...draftContent.home?.metrics, marqueeBadge: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Stat 1 (Placements)
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.metrics?.stat1Value || 500}
                          onChange={(e) => updateDraft('home.metrics', { ...draftContent.home?.metrics, stat1Value: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-bold"
                        />
                        <span className="text-[10px] text-[#64748B] block mt-0.5">500+ Placements</span>
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Stat 2 (Retention %)
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.metrics?.stat2Value || 98}
                          onChange={(e) => updateDraft('home.metrics', { ...draftContent.home?.metrics, stat2Value: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#131926] border border-[#1E293B] text-white font-bold"
                        />
                        <span className="text-[10px] text-[#64748B] block mt-0.5">98% Retention</span>
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Stat 3 (Days to Fill)
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.metrics?.stat3Value || 14}
                          onChange={(e) => updateDraft('home.metrics', { ...draftContent.home?.metrics, stat3Value: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-bold"
                        />
                        <span className="text-[10px] text-[#64748B] block mt-0.5">14 Days Avg</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BLOCK 03: BENTO SOLUTIONS GRID */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-03', '#capital-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      03
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 03: Bento Solutions Grid (4 Cards)
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Titles, Badges, Descriptions, and Replaceable Images
                      </p>
                    </div>
                  </div>
                  {activeBlock === 'home-block-03' ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {activeBlock === 'home-block-03' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    {(draftContent.home?.bento || draftContent.services || []).map((card, idx) => (
                      <div key={card.id || idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#E69D2B] font-mono">
                            Card 0{idx + 1}: {card.title}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                              Title
                            </label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const list = [...(draftContent.home?.bento || draftContent.services)];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateDraft('home.bento', list);
                                updateDraft('services', list);
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                              Badge
                            </label>
                            <input
                              type="text"
                              value={card.badge || card.category}
                              onChange={(e) => {
                                const list = [...(draftContent.home?.bento || draftContent.services)];
                                list[idx] = { ...list[idx], badge: e.target.value, category: e.target.value };
                                updateDraft('home.bento', list);
                                updateDraft('services', list);
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={card.description}
                            onChange={(e) => {
                              const list = [...(draftContent.home?.bento || draftContent.services)];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateDraft('home.bento', list);
                              updateDraft('services', list);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                          />
                        </div>

                        {/* Image Dropzone */}
                        {renderImageDropzone({
                          title: `Card 0${idx + 1} Portrait Image`,
                          currentValue: card.image,
                          fieldKey: `bento-${idx}`,
                          onUpdate: (newUrl) => {
                            const list = [...(draftContent.home?.bento || draftContent.services)];
                            list[idx] = { ...list[idx], image: newUrl };
                            updateDraft('home.bento', list);
                            updateDraft('services', list);

                            const keyMap = ['bentoCard1', 'bentoCard2', 'bentoCard3', 'bentoCard4'];
                            if (keyMap[idx]) {
                              updateDraft('images', { ...(draftContent.images || {}), [keyMap[idx]]: newUrl });
                            }
                          },
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 04: KINETIC VETTING PIPELINE */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-04', '#process-story')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      04
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 04: Kinetic Vetting Pipeline (5 Stages)
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        5-Stage Diligence Milestones, Narrative Descriptions, and Step Photos
                      </p>
                    </div>
                  </div>
                  {activeBlock === 'home-block-04' ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {activeBlock === 'home-block-04' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    {(draftContent.home?.vetting || draftContent.vettingStages || []).map((stage, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#E69D2B] text-xs">
                            {stage.order || `0${idx + 1}`}
                          </span>
                          <input
                            type="text"
                            value={stage.name}
                            onChange={(e) => {
                              const list = [...(draftContent.home?.vetting || draftContent.vettingStages)];
                              list[idx] = { ...list[idx], name: e.target.value };
                              updateDraft('home.vetting', list);
                              updateDraft('vettingStages', list);
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-semibold text-xs"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={stage.description}
                          onChange={(e) => {
                            const list = [...(draftContent.home?.vetting || draftContent.vettingStages)];
                            list[idx] = { ...list[idx], description: e.target.value };
                            updateDraft('home.vetting', list);
                            updateDraft('vettingStages', list);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs leading-relaxed"
                        />

                        {renderImageDropzone({
                          title: `Stage ${stage.order || `0${idx + 1}`} Photography`,
                          currentValue: stage.image || draftContent.images?.vettingSteps?.[idx],
                          fieldKey: `vetting-${idx}`,
                          onUpdate: (newUrl) => {
                            const list = [...(draftContent.home?.vetting || draftContent.vettingStages)];
                            list[idx] = { ...list[idx], image: newUrl };
                            updateDraft('home.vetting', list);
                            updateDraft('vettingStages', list);

                            const steps = [...(draftContent.images?.vettingSteps || [])];
                            steps[idx] = newUrl;
                            updateDraft('images', { ...(draftContent.images || {}), vettingSteps: steps });
                          },
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 05: EXECUTIVE HIRING ESTIMATOR */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-05', '#staffing-momentum')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      05
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 05: Executive Hiring Estimator (Orbit &amp; Multipliers)
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Talent Solutions Copy, Orbit Heading, and SLA Multipliers
                      </p>
                    </div>
                  </div>
                  {activeBlock === 'home-block-05' ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {activeBlock === 'home-block-05' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Estimator Eyebrow
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.calculator?.eyebrow || 'SAHARA STAFFING INC. / TALENT SOLUTIONS'}
                        onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, eyebrow: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.calculator?.headline || 'Talent That Moves Business Forward.'}
                        onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, headline: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Direct Hire Fee %
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.calculator?.feeMultiplier || 20}
                          onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, feeMultiplier: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          SLA Days
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.calculator?.timeToFillDays || 14}
                          onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, timeToFillDays: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Guarantee Days
                        </label>
                        <input
                          type="number"
                          value={draftContent.home?.calculator?.retentionGuaranteeDays || 90}
                          onChange={(e) => updateDraft('home.calculator', { ...draftContent.home?.calculator, retentionGuaranteeDays: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-bold"
                        />
                      </div>
                    </div>

                    {renderStrictButtonManager({
                      buttons: draftContent.home?.calculator?.buttons || [
                        { id: 'btn-calc-1', enabled: true, label: 'Find Your Talent →', destination: '/contact', variant: 'primary' },
                      ],
                      sectionName: 'Estimator Section',
                      onAdd: () => {
                        const current = draftContent.home?.calculator?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('home.calculator', {
                          ...draftContent.home?.calculator,
                          buttons: [...current, { id: 'calc-' + Date.now(), enabled: true, label: 'Contact Advisory', destination: '/contact', variant: 'secondary' }],
                        });
                      },
                      onRemove: (idx) => {
                        const current = (draftContent.home?.calculator?.buttons || []).filter((_, i) => i !== idx);
                        updateDraft('home.calculator', { ...draftContent.home?.calculator, buttons: current });
                      },
                      onToggle: (idx) => {
                        const current = [...(draftContent.home?.calculator?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('home.calculator', { ...draftContent.home?.calculator, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.home?.calculator?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('home.calculator', { ...draftContent.home?.calculator, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>

              {/* BLOCK 06: TESTIMONIALS CAROUSEL */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-06', '#testimonials-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      06
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 06: Testimonials Carousel
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Enterprise Partner Quotes, Reviewer Names, and Avatars
                      </p>
                    </div>
                  </div>
                  {activeBlock === 'home-block-06' ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {activeBlock === 'home-block-06' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                        Active Reviews ({draftContent.testimonials?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newTest = {
                            id: 'test-' + Date.now(),
                            name: 'Executive Partner',
                            title: 'VP of Technology at High-Growth Enterprise',
                            quote: '“Sahara Staffing transformed our hiring velocity with exceptionally vetted candidates.”',
                            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                          };
                          const updated = [...(draftContent.testimonials || []), newTest];
                          updateDraft('testimonials', updated);
                          updateDraft('home.testimonials', updated);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[10.5px] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Testimonial</span>
                      </button>
                    </div>

                    {(draftContent.testimonials || []).map((t, idx) => (
                      <div key={t.id || idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#E69D2B] font-semibold">Review 0{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = draftContent.testimonials.filter((_, i) => i !== idx);
                              updateDraft('testimonials', updated);
                              updateDraft('home.testimonials', updated);
                            }}
                            className="text-[#64748B] hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={t.name || ''}
                            onChange={(e) => {
                              const list = [...draftContent.testimonials];
                              list[idx] = { ...list[idx], name: e.target.value };
                              updateDraft('testimonials', list);
                              updateDraft('home.testimonials', list);
                            }}
                            placeholder="Name..."
                            className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                          />
                          <input
                            type="text"
                            value={t.title || t.role || ''}
                            onChange={(e) => {
                              const list = [...draftContent.testimonials];
                              list[idx] = { ...list[idx], title: e.target.value, role: e.target.value };
                              updateDraft('testimonials', list);
                              updateDraft('home.testimonials', list);
                            }}
                            placeholder="Company Title..."
                            className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={t.quote || ''}
                          onChange={(e) => {
                            const list = [...draftContent.testimonials];
                            list[idx] = { ...list[idx], quote: e.target.value };
                            updateDraft('testimonials', list);
                            updateDraft('home.testimonials', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                        />

                        <div className="flex items-center gap-2">
                          <img src={t.avatar || t.image} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                          <input
                            type="text"
                            value={t.avatar || t.image || ''}
                            onChange={(e) => {
                              const list = [...draftContent.testimonials];
                              list[idx] = { ...list[idx], avatar: e.target.value, image: e.target.value };
                              updateDraft('testimonials', list);
                              updateDraft('home.testimonials', list);
                            }}
                            placeholder="Avatar URL..."
                            className="flex-1 px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-[10px] font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 07: FAQS */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-07', '#faq-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      07
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 07: Frequently Asked Questions
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Accordion Q&amp;A pairs for client clarity and SLA guidance
                      </p>
                    </div>
                  </div>
                  {activeBlock === 'home-block-07' ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {activeBlock === 'home-block-07' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                        Questions ({draftContent.faqs?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFaq = {
                            id: 'faq-' + Date.now(),
                            question: 'What is the Sahara 90-day retention guarantee?',
                            answer: 'If any placed candidate departs within 90 days, we deliver an immediate, fully vetted replacement with zero additional placement fee.',
                          };
                          const updated = [...(draftContent.faqs || []), newFaq];
                          updateDraft('faqs', updated);
                          updateDraft('home.faqs', updated);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[10.5px] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    {(draftContent.faqs || []).map((faq, idx) => (
                      <div key={faq.id || idx} className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const list = [...draftContent.faqs];
                              list[idx] = { ...list[idx], question: e.target.value };
                              updateDraft('faqs', list);
                              updateDraft('home.faqs', list);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = draftContent.faqs.filter((_, i) => i !== idx);
                              updateDraft('faqs', updated);
                              updateDraft('home.faqs', updated);
                            }}
                            className="text-[#64748B] hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const list = [...draftContent.faqs];
                            list[idx] = { ...list[idx], answer: e.target.value };
                            updateDraft('faqs', list);
                            updateDraft('home.faqs', list);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-[#CBD5E1] text-xs leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 08: BOTTOM CTA & FOOTER */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('home-block-08', '#footer-section')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      08
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 08: Bottom CTA &amp; Footer
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Speak to Experts Headline, Contact Info, and Copyright
                      </p>
                    </div>
                  </div>
                  {activeBlock === 'home-block-08' ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {activeBlock === 'home-block-08' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Closing Banner Headline
                      </label>
                      <input
                        type="text"
                        value={draftContent.home?.footer?.headline || 'Speak to our staffing experts'}
                        onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, headline: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Contact Email
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.footer?.contactEmail || 'admin@saharastaffing.com'}
                          onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, contactEmail: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Direct Phone
                        </label>
                        <input
                          type="text"
                          value={draftContent.home?.footer?.contactPhone || '+1 (800) 555-SAHARA'}
                          onChange={(e) => updateDraft('home.footer', { ...draftContent.home?.footer, contactPhone: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-mono"
                        />
                      </div>
                    </div>

                    {renderStrictButtonManager({
                      buttons: draftContent.home?.footer?.buttons || [
                        { id: 'btn-foot-1', enabled: true, label: 'Talk to staffing →', destination: '/contact', variant: 'primary' },
                      ],
                      sectionName: 'Footer CTA',
                      onAdd: () => {
                        const current = draftContent.home?.footer?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('home.footer', {
                          ...draftContent.home?.footer,
                          buttons: [...current, { id: 'btn-foot-2', enabled: true, label: 'Explore Services', destination: '/services', variant: 'secondary' }],
                        });
                      },
                      onRemove: (idx) => {
                        const current = (draftContent.home?.footer?.buttons || []).filter((_, i) => i !== idx);
                        updateDraft('home.footer', { ...draftContent.home?.footer, buttons: current });
                      },
                      onToggle: (idx) => {
                        const current = [...(draftContent.home?.footer?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('home.footer', { ...draftContent.home?.footer, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.home?.footer?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('home.footer', { ...draftContent.home?.footer, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB B: ABOUT PAGE (6 SECTION BLOCKS)                              */}
          {/* ================================================================= */}
          {activePageTab === 'about' && (
            <div className="space-y-3">
              {/* BLOCK 01: HERO SECTION */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-01', '#about-hero')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 01: About Hero Section
                      </h3>
                      <p className="text-[11px] text-[#64748B]">Kicker, Headline, Narrative, and CTAs</p>
                    </div>
                  </div>
                  {activeBlock === 'about-block-01' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'about-block-01' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Kicker Eyebrow</label>
                      <input
                        type="text"
                        value={draftContent.about?.hero?.kicker || 'SAHARA STAFFING INC. / WHO WE ARE'}
                        onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, kicker: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Headline</label>
                      <input
                        type="text"
                        value={draftContent.about?.hero?.headline || 'A Modern Search Firm Built on Precision and Relationships.'}
                        onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, headline: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Subtitle</label>
                      <textarea
                        rows={2}
                        value={draftContent.about?.hero?.subtitle || ''}
                        onChange={(e) => updateDraft('about.hero', { ...draftContent.about?.hero, subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    {renderStrictButtonManager({
                      buttons: draftContent.about?.hero?.buttons || [],
                      sectionName: 'About Hero',
                      onAdd: () => {
                        const current = draftContent.about?.hero?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('about.hero', {
                          ...draftContent.about?.hero,
                          buttons: [...current, { id: 'about-' + Date.now(), enabled: true, label: 'Get In Touch →', destination: '/contact', variant: 'primary' }],
                        });
                      },
                      onRemove: (idx) => updateDraft('about.hero', { ...draftContent.about?.hero, buttons: (draftContent.about?.hero?.buttons || []).filter((_, i) => i !== idx) }),
                      onToggle: (idx) => {
                        const current = [...(draftContent.about?.hero?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('about.hero', { ...draftContent.about?.hero, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.about?.hero?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('about.hero', { ...draftContent.about?.hero, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>

              {/* BLOCK 02: OPERATING BENCHMARKS */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-02', '#about-benchmarks')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      02
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 02: Operating Benchmarks</h3>
                      <p className="text-[11px] text-[#64748B]">Our Principles: People First, Clarity, Connections</p>
                    </div>
                  </div>
                  {activeBlock === 'about-block-02' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'about-block-02' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    {(draftContent.about?.benchmarks || []).map((b, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#131926] border border-[#1E293B] space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#E69D2B] font-bold">{b.num}</span>
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => {
                              const list = [...(draftContent.about?.benchmarks || [])];
                              list[idx] = { ...list[idx], title: e.target.value };
                              updateDraft('about.benchmarks', list);
                            }}
                            className="flex-1 px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-semibold"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={b.desc}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.benchmarks || [])];
                            list[idx] = { ...list[idx], desc: e.target.value };
                            updateDraft('about.benchmarks', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 03: DISCIPLINE MATRIX */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-03', '#about-mindset')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      03
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 03: Discipline Matrix (Mindset Chapters)</h3>
                      <p className="text-[11px] text-[#64748B]">Story chapters with full-resolution replaceable imagery</p>
                    </div>
                  </div>
                  {activeBlock === 'about-block-03' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'about-block-03' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    {(draftContent.about?.chapters || []).map((ch, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[#E69D2B] font-bold">{ch.badge}</span>
                          <span className="text-[10px] text-white/50">{ch.tag}</span>
                        </div>
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.chapters || [])];
                            list[idx] = { ...list[idx], title: e.target.value };
                            updateDraft('about.chapters', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium"
                        />
                        <textarea
                          rows={2}
                          value={ch.text}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.chapters || [])];
                            list[idx] = { ...list[idx], text: e.target.value };
                            updateDraft('about.chapters', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                        />
                        {renderImageDropzone({
                          title: `${ch.badge} Image`,
                          currentValue: ch.image,
                          fieldKey: `about-ch-${idx}`,
                          onUpdate: (newUrl) => {
                            const list = [...(draftContent.about?.chapters || [])];
                            list[idx] = { ...list[idx], image: newUrl };
                            updateDraft('about.chapters', list);
                          },
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 04: LEADERSHIP COUNCIL */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-04', '#about-leadership')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      04
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 04: Leadership Council</h3>
                      <p className="text-[11px] text-[#64748B]">Executive profiles and headshot uploaders</p>
                    </div>
                  </div>
                  {activeBlock === 'about-block-04' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'about-block-04' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    {(draftContent.about?.leadership || []).map((lead, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={lead.name}
                            onChange={(e) => {
                              const list = [...(draftContent.about?.leadership || [])];
                              list[idx] = { ...list[idx], name: e.target.value };
                              updateDraft('about.leadership', list);
                            }}
                            className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-bold"
                          />
                          <input
                            type="text"
                            value={lead.title}
                            onChange={(e) => {
                              const list = [...(draftContent.about?.leadership || [])];
                              list[idx] = { ...list[idx], title: e.target.value };
                              updateDraft('about.leadership', list);
                            }}
                            className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B]"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={lead.bio}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.leadership || [])];
                            list[idx] = { ...list[idx], bio: e.target.value };
                            updateDraft('about.leadership', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                        />
                        {renderImageDropzone({
                          title: `${lead.name} Portrait`,
                          currentValue: lead.image,
                          fieldKey: `lead-about-${idx}`,
                          onUpdate: (newUrl) => {
                            const list = [...(draftContent.about?.leadership || [])];
                            list[idx] = { ...list[idx], image: newUrl };
                            updateDraft('about.leadership', list);
                          },
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 05: HARD SCALE STATS */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-05', '#about-stats')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      05
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 05: Hard Scale Stats</h3>
                      <p className="text-[11px] text-[#64748B]">Enterprise proof points and placement volume</p>
                    </div>
                  </div>
                  {activeBlock === 'about-block-05' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'about-block-05' && (
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
                    {(draftContent.about?.stats || []).map((s, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#131926] border border-[#1E293B] space-y-1">
                        <input
                          type="text"
                          value={s.value}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.stats || [])];
                            list[idx] = { ...list[idx], value: e.target.value };
                            updateDraft('about.stats', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B] font-bold text-sm"
                        />
                        <input
                          type="text"
                          value={s.label}
                          onChange={(e) => {
                            const list = [...(draftContent.about?.stats || [])];
                            list[idx] = { ...list[idx], label: e.target.value };
                            updateDraft('about.stats', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 06: FINAL CTA */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('about-block-06', '#about-final-cta')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      06
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 06: Final CTA</h3>
                      <p className="text-[11px] text-[#64748B]">About Page closing banner and actions</p>
                    </div>
                  </div>
                  {activeBlock === 'about-block-06' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'about-block-06' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Closing Headline</label>
                      <input
                        type="text"
                        value={draftContent.about?.finalCta?.headline || 'Let’s find the right people for your team.'}
                        onChange={(e) => updateDraft('about.finalCta', { ...draftContent.about?.finalCta, headline: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    {renderStrictButtonManager({
                      buttons: draftContent.about?.finalCta?.buttons || [],
                      sectionName: 'About Closing CTA',
                      onAdd: () => {
                        const current = draftContent.about?.finalCta?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('about.finalCta', {
                          ...draftContent.about?.finalCta,
                          buttons: [...current, { id: 'cta-' + Date.now(), enabled: true, label: 'Start the Conversation →', destination: '/contact', variant: 'primary' }],
                        });
                      },
                      onRemove: (idx) => updateDraft('about.finalCta', { ...draftContent.about?.finalCta, buttons: (draftContent.about?.finalCta?.buttons || []).filter((_, i) => i !== idx) }),
                      onToggle: (idx) => {
                        const current = [...(draftContent.about?.finalCta?.buttons || [])];
                        current[idx] = { ...current[idx], enabled: !current[idx].enabled };
                        updateDraft('about.finalCta', { ...draftContent.about?.finalCta, buttons: current });
                      },
                      onUpdate: (idx, field, value) => {
                        const current = [...(draftContent.about?.finalCta?.buttons || [])];
                        current[idx] = { ...current[idx], [field]: value };
                        updateDraft('about.finalCta', { ...draftContent.about?.finalCta, buttons: current });
                      },
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB C: SERVICES PAGE (5 SECTION BLOCKS)                           */}
          {/* ================================================================= */}
          {activePageTab === 'services' && (
            <div className="space-y-3">
              {/* BLOCK 01: HERO */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-01', '#services-hero')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 01: Services Hero</h3>
                      <p className="text-[11px] text-[#64748B]">Panoramic Banner, Kicker, and Headline</p>
                    </div>
                  </div>
                  {activeBlock === 'services-block-01' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'services-block-01' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Kicker Eyebrow</label>
                      <input
                        type="text"
                        value={draftContent.servicesPage?.hero?.kicker || 'SPECIALIZED RECRUITMENT SOLUTIONS'}
                        onChange={(e) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, kicker: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Headline</label>
                      <input
                        type="text"
                        value={draftContent.servicesPage?.hero?.headline || 'Exceptional Talent. Built Around Your Business.'}
                        onChange={(e) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, headline: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                      />
                    </div>
                    {renderImageDropzone({
                      title: 'Panoramic Hero Header Banner',
                      currentValue: draftContent.servicesPage?.hero?.panoramicImage || '/assets/card1-staffing.jpg',
                      fieldKey: 'services-panoramic',
                      onUpdate: (newUrl) => updateDraft('servicesPage.hero', { ...draftContent.servicesPage?.hero, panoramicImage: newUrl }),
                    })}
                  </div>
                )}
              </div>

              {/* BLOCK 02: SERVICE CAPABILITIES GRID */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-02', '#services-capabilities')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      02
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 02: Service Capabilities Grid</h3>
                      <p className="text-[11px] text-[#64748B]">Permanent, Contract, Retained, and RPO</p>
                    </div>
                  </div>
                  {activeBlock === 'services-block-02' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'services-block-02' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    {(draftContent.servicesPage?.capabilities || []).map((cap, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5">
                        <span className="font-mono text-[#E69D2B] font-bold">{cap.badge}</span>
                        <input
                          type="text"
                          value={cap.title}
                          onChange={(e) => {
                            const list = [...(draftContent.servicesPage?.capabilities || [])];
                            list[idx] = { ...list[idx], title: e.target.value };
                            updateDraft('servicesPage.capabilities', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium"
                        />
                        <textarea
                          rows={2}
                          value={cap.description}
                          onChange={(e) => {
                            const list = [...(draftContent.servicesPage?.capabilities || [])];
                            list[idx] = { ...list[idx], description: e.target.value };
                            updateDraft('servicesPage.capabilities', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 03: VETTING PROCESS */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-03', '#services-vetting')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      03
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 03: Vetting Process Benchmarks</h3>
                      <p className="text-[11px] text-[#64748B]">Assurance Kicker, Headline, and Criteria</p>
                    </div>
                  </div>
                  {activeBlock === 'services-block-03' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'services-block-03' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    <input
                      type="text"
                      value={draftContent.servicesPage?.vetting?.headline || 'A 5-Stage Vetting Pipeline Built for Certainty.'}
                      onChange={(e) => updateDraft('servicesPage.vetting', { ...draftContent.servicesPage?.vetting, headline: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                    />
                  </div>
                )}
              </div>

              {/* BLOCK 04: ENGAGEMENT MODELS */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-04', '#services-models')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      04
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 04: Engagement Models</h3>
                      <p className="text-[11px] text-[#64748B]">Retained, Contingency, Fractional, and RPO</p>
                    </div>
                  </div>
                  {activeBlock === 'services-block-04' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'services-block-04' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    {(draftContent.servicesPage?.engagementModels || []).map((m, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#131926] border border-[#1E293B]">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => {
                            const list = [...(draftContent.servicesPage?.engagementModels || [])];
                            list[idx] = { ...list[idx], name: e.target.value };
                            updateDraft('servicesPage.engagementModels', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-[#E69D2B] font-semibold text-xs mb-1"
                        />
                        <input
                          type="text"
                          value={m.desc}
                          onChange={(e) => {
                            const list = [...(draftContent.servicesPage?.engagementModels || [])];
                            list[idx] = { ...list[idx], desc: e.target.value };
                            updateDraft('servicesPage.engagementModels', list);
                          }}
                          className="w-full px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCK 05: SLA GUARANTEE */}
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('services-block-05', '#services-sla')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      05
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Block 05: SLA Guarantee</h3>
                      <p className="text-[11px] text-[#64748B]">90-Day Unconditional Replacement Terms</p>
                    </div>
                  </div>
                  {activeBlock === 'services-block-05' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'services-block-05' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs">
                    <input
                      type="text"
                      value={draftContent.servicesPage?.slaGuarantee?.headline || 'The Sahara 90-Day Unconditional Guarantee'}
                      onChange={(e) => updateDraft('servicesPage.slaGuarantee', { ...draftContent.servicesPage?.slaGuarantee, headline: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                    />
                    <textarea
                      rows={2}
                      value={draftContent.servicesPage?.slaGuarantee?.terms || ''}
                      onChange={(e) => updateDraft('servicesPage.slaGuarantee', { ...draftContent.servicesPage?.slaGuarantee, terms: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB D: CONTACT PAGE (1 SECTION BLOCK)                             */}
          {/* ================================================================= */}
          {activePageTab === 'contact' && (
            <div className="space-y-3">
              <div className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleBlockToggle('contact-block-01', '#contact-workspace')}
                  className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">
                        Block 01: Contact Form &amp; Candidate Intake Manager
                      </h3>
                      <p className="text-[11px] text-[#64748B]">Intake routing, Direct Contact info, and SLAs</p>
                    </div>
                  </div>
                  {activeBlock === 'contact-block-01' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {activeBlock === 'contact-block-01' && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Headline</label>
                      <input
                        type="text"
                        value={draftContent.contactPage?.hero?.headline || 'Let’s Discuss Your Talent Objectives.'}
                        onChange={(e) => updateDraft('contactPage.hero', { ...draftContent.contactPage?.hero, headline: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Subtitle</label>
                      <textarea
                        rows={2}
                        value={draftContent.contactPage?.hero?.subtitle || ''}
                        onChange={(e) => updateDraft('contactPage.hero', { ...draftContent.contactPage?.hero, subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Routing Email</label>
                        <input
                          type="email"
                          value={draftContent.contactPage?.details?.email || 'talhaquanlity@gmail.com'}
                          onChange={(e) => updateDraft('contactPage.details', { ...draftContent.contactPage?.details, email: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Response Time SLA</label>
                        <input
                          type="text"
                          value={draftContent.contactPage?.details?.responseTime || 'Within 2 hours'}
                          onChange={(e) => updateDraft('contactPage.details', { ...draftContent.contactPage?.details, responseTime: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB E: GLOBAL SITE SETTINGS                                       */}
          {/* ================================================================= */}
          {activePageTab === 'settings' && (
            <div className="bg-[#1E293B]/60 rounded-2xl p-6 mb-4 border-0 shadow-lg space-y-5 text-xs">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-[#E69D2B]" />
                  <span>Global Site Utility Toggles</span>
                </h3>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 font-inter">
                  Manage the smooth fluid animated cursor pointer and the floating back-to-top button.
                </p>
              </div>

              {/* Utility Toggle 1: Custom Luxury Cursor */}
              <div className="p-4 rounded-xl bg-[#0B0F17]/80 flex items-start justify-between gap-4 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-[#E69D2B]" />
                    <span className="text-xs font-bold text-white font-sans">
                      Smooth Fluid Animated Cursor Pointer
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    Activates a fluid LERP-animated trailing gold cursor with velocity stretch, organic glow, and magnetic hover expansion.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ enableCustomCursor: !settings.enableCustomCursor })}
                  className="cursor-pointer text-[#E69D2B] mt-1 shrink-0 transition-transform active:scale-95"
                  title="Toggle animated cursor pointer"
                >
                  {settings.enableCustomCursor ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-[#64748B]" />
                  )}
                </button>
              </div>

              {/* Utility Toggle 2: Back-to-Top Button */}
              <div className="p-4 rounded-xl bg-[#0B0F17]/80 flex items-start justify-between gap-4 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="w-4 h-4 text-[#E69D2B]" />
                    <span className="text-xs font-bold text-white font-sans">
                      Floating &lsquo;Back to Top&rsquo; Button
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    Displays the circular SVG progress ring and one-click back-to-top return button in the bottom-right corner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ enableBackToTop: !settings.enableBackToTop })}
                  className="cursor-pointer text-[#E69D2B] mt-1 shrink-0 transition-transform active:scale-95"
                  title="Toggle back to top button"
                >
                  {settings.enableBackToTop ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-[#64748B]" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: AUTO-SYNCED LAPTOP & PHONE LIVE PREVIEW (6 COLUMNS)   */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 sticky top-2 h-[calc(100vh-210px)] min-h-[520px] bg-[#0B0F17] rounded-2xl overflow-hidden flex flex-col shadow-2xl border-0">
          
          {/* BROWSER TOP CHROME BAR (MINIMAL & ULTRA-CLEAN) */}
          <div className="h-12 bg-[#0E131F] border-b border-white/5 px-4 flex items-center justify-between shrink-0 select-none z-20">
            {/* Minimalist URL path tag */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131926] text-[11px] text-[#94A3B8] font-mono">
              <Lock className="w-3 h-3 text-[#E69D2B] shrink-0" />
              <span className="text-white/90 font-medium">saharastaffing.com/preview</span>
              <button
                type="button"
                onClick={() => setPreviewKey((k) => k + 1)}
                className="text-[#64748B] hover:text-[#E69D2B] transition-colors ml-1 cursor-pointer"
                title="Reload preview components"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Viewport Switcher Pills (💻 Desktop | 📱 Mobile) */}
            <div className="flex items-center gap-1 bg-[#131926] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewportMode === 'desktop'
                    ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span>💻</span>
                <span>Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewportMode === 'mobile'
                    ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span>📱</span>
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* SCALED LIVE RENDER CANVAS (SMOOTH OVERFLOW CONTAINER) */}
          <div
            ref={previewScrollRef}
            data-lenis-prevent
            className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain scroll-smooth custom-scrollbar bg-[#080B12] relative"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E69D2B #131926' }}
          >
            <CMSPreviewProvider content={draftContent} settings={settings} key={previewKey}>
              {viewportMode === 'desktop' ? (
                /* LAPTOP / DESKTOP VIEWPORT (Scaled 1280px view) */
                <div className="w-full overflow-x-hidden min-h-full py-4 flex justify-center">
                  <div className="w-[1280px] origin-top scale-[0.65] sm:scale-[0.75] lg:scale-[0.82] mx-auto shrink-0 bg-[#0B0F17] text-white rounded-xl shadow-2xl overflow-hidden">
                    {/* HOME PAGE RENDERING */}
                    {(activePageTab === 'home' || activePageTab === 'settings') && (
                      <>
                        <div id="hero-section">
                          <Hero />
                        </div>
                        <div id="metrics-section">
                          <SocialProofMarquee />
                        </div>
                        <div id="capital-section">
                          <BentoGrowthCapital />
                        </div>
                        <div id="process-story">
                          <VettingProcess />
                        </div>
                        <div id="staffing-momentum">
                          <Calculator />
                        </div>
                        <div id="testimonials-section">
                          <Testimonials />
                        </div>
                        <div id="faq-section">
                          <FAQ />
                        </div>
                        <div id="footer-section">
                          <SpeakToExperts />
                          <Footer />
                        </div>
                      </>
                    )}

                    {/* ABOUT PAGE RENDERING */}
                    {activePageTab === 'about' && (
                      <div className="min-h-full bg-[#0B0F17]">
                        <Header currentRoute="about" />
                        <div id="about-hero">
                          <AboutPage />
                        </div>
                        <Footer />
                      </div>
                    )}

                    {/* SERVICES PAGE RENDERING */}
                    {activePageTab === 'services' && (
                      <div className="min-h-full bg-[#F8F6F1] text-[#0B0F17]">
                        <Header currentRoute="services" />
                        <div id="services-hero">
                          <ServicesPage />
                        </div>
                        <Footer />
                      </div>
                    )}

                    {/* CONTACT PAGE RENDERING */}
                    {activePageTab === 'contact' && (
                      <div className="min-h-full bg-[#F8F6F1] text-[#0B0F17]">
                        <Header currentRoute="contact" />
                        <div id="contact-workspace">
                          <ContactPage />
                        </div>
                        <Footer />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* PHONE VIEWPORT (Centered 375px phone chassis) */
                <div className="w-full min-h-full flex justify-center items-center py-6 px-3">
                  <div
                    ref={mobileChassisRef}
                    data-lenis-prevent
                    className="w-[375px] h-[720px] max-h-[calc(100vh-280px)] mx-auto rounded-[36px] border-4 border-[#1E293B] overflow-y-auto overscroll-contain shadow-2xl my-auto bg-[#0B0F17] custom-scrollbar text-white relative flex flex-col"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#E69D2B #131926' }}
                  >
                    {/* Top phone speaker notch */}
                    <div className="sticky top-0 z-30 w-full h-6 bg-[#0B0F17]/95 backdrop-blur-sm flex justify-center items-center shrink-0 border-b border-white/5">
                      <div className="w-20 h-3 bg-[#1E293B] rounded-full" />
                    </div>

                    <div className="w-full flex-1">
                      {(activePageTab === 'home' || activePageTab === 'settings') && (
                        <>
                          <div id="hero-section"><Hero /></div>
                          <div id="metrics-section"><SocialProofMarquee /></div>
                          <div id="capital-section"><BentoGrowthCapital /></div>
                          <div id="process-story"><VettingProcess /></div>
                          <div id="staffing-momentum"><Calculator /></div>
                          <div id="testimonials-section"><Testimonials /></div>
                          <div id="faq-section"><FAQ /></div>
                          <div id="footer-section"><SpeakToExperts /><Footer /></div>
                        </>
                      )}
                      {activePageTab === 'about' && (
                        <div>
                          <Header currentRoute="about" />
                          <div id="about-hero"><AboutPage /></div>
                          <Footer />
                        </div>
                      )}
                      {activePageTab === 'services' && (
                        <div className="bg-[#F8F6F1] text-[#0B0F17]">
                          <Header currentRoute="services" />
                          <ServicesPage />
                          <Footer />
                        </div>
                      )}
                      {activePageTab === 'contact' && (
                        <div className="bg-[#F8F6F1] text-[#0B0F17]">
                          <Header currentRoute="contact" />
                          <ContactPage />
                          <Footer />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CMSPreviewProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
