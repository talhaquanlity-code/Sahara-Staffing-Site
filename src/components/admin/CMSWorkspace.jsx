import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { useCMS, CMSPreviewProvider } from '../../context/CMSContext';

// Import public site components for real-time live preview rendering
import Header from '../Header';
import Hero from '../Hero';
import SocialProofMarquee from '../SocialProofMarquee';
import BentoGrowthCapital from '../BentoGrowthCapital';
import VettingProcess from '../VettingProcess';
import Testimonials from '../Testimonials';
import FAQ from '../FAQ';
import Footer from '../Footer';

export default function CMSWorkspace() {
  const {
    draftContent,
    content: publishedContent,
    updateDraft,
    publishChanges,
    discardDraft,
    hasUnsavedChanges,
    publishStatus,
    publishMessage,
  } = useCMS();

  // Active accordion section: 'hero' | 'images' | 'services' | 'faqs'
  const [activeAccordion, setActiveAccordion] = useState('hero');

  // Image replacement tabs: 'bento' | 'vetting' | 'leadership'
  const [activeImageTab, setActiveImageTab] = useState('bento');

  // Preview viewport mode: 'desktop' | 'mobile'
  const [viewportMode, setViewportMode] = useState('desktop');

  // Preview reload key to force re-render when clicking browser refresh
  const [previewKey, setPreviewKey] = useState(0);

  // Drag over states for file dropzones
  const [dragOverKey, setDragOverKey] = useState(null);

  // Confirm delete modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Ref to the live preview container for smooth section jumping
  const previewScrollRef = useRef(null);

  // ---------------------------------------------------------------------------
  // SECTION JUMP HANDLER IN PREVIEW CANVAS
  // ---------------------------------------------------------------------------
  const handleScrollToSection = (sectionId) => {
    if (!previewScrollRef.current) return;
    const targetElement = previewScrollRef.current.querySelector(`#${sectionId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ---------------------------------------------------------------------------
  // 1. HERO COPY & DYNAMIC CTA BUTTON MANAGER (STRICT MAX 2 BUTTONS)
  // ---------------------------------------------------------------------------
  const handleHeroChange = (field, value) => {
    updateDraft('hero', { ...draftContent.hero, [field]: value });
  };

  // Ensure buttons array always exists
  const heroButtons = Array.isArray(draftContent.hero?.buttons)
    ? draftContent.hero.buttons
    : [
        {
          id: 'btn-1',
          enabled: true,
          label: draftContent.hero?.primaryCtaLabel || 'Request Talent →',
          destination: '/contact',
          variant: 'primary',
        },
        {
          id: 'btn-2',
          enabled: true,
          label: draftContent.hero?.secondaryCtaLabel || 'Explore Open Roles',
          destination: '/services',
          variant: 'secondary',
        },
      ];

  const handleAddButton = () => {
    if (heroButtons.length >= 2) return;
    const isFirst = heroButtons.length === 0;
    const newBtn = {
      id: 'btn-' + Date.now(),
      enabled: true,
      label: isFirst ? 'Request Talent →' : 'Explore Open Roles',
      destination: isFirst ? '/contact' : '/services',
      variant: isFirst ? 'primary' : 'secondary',
    };
    const updated = [...heroButtons, newBtn];
    updateDraft('hero', {
      ...draftContent.hero,
      buttons: updated,
    });
  };

  const handleRemoveButton = (index) => {
    const updated = heroButtons.filter((_, i) => i !== index);
    updateDraft('hero', {
      ...draftContent.hero,
      buttons: updated,
    });
  };

  const handleUpdateButton = (index, field, value) => {
    const updated = [...heroButtons];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft('hero', {
      ...draftContent.hero,
      buttons: updated,
    });
  };

  const handleToggleButton = (index) => {
    const updated = [...heroButtons];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    updateDraft('hero', {
      ...draftContent.hero,
      buttons: updated,
    });
  };

  // ---------------------------------------------------------------------------
  // 2. IMAGE ASSET REPLACEMENT & DRAG-AND-DROP FILE UPLOADER
  // ---------------------------------------------------------------------------
  const handleImageUpdate = (key, value, nestedIndex = null, type = 'bento') => {
    if (type === 'bento') {
      // Update in images object & sync to service card
      const newImages = { ...(draftContent.images || {}), [key]: value };
      updateDraft('images', newImages);

      // Also mirror to services array
      const serviceIdxMap = { bentoCard1: 0, bentoCard2: 1, bentoCard3: 2, bentoCard4: 3 };
      const sIdx = serviceIdxMap[key];
      if (sIdx !== undefined && draftContent.services?.[sIdx]) {
        const updatedServices = [...draftContent.services];
        updatedServices[sIdx] = { ...updatedServices[sIdx], image: value };
        updateDraft('services', updatedServices);
      }
    } else if (type === 'vetting' && nestedIndex !== null) {
      // Update vetting step image in array
      const currentVettingImages = [...(draftContent.images?.vettingSteps || [])];
      currentVettingImages[nestedIndex] = value;
      const newImages = { ...(draftContent.images || {}), vettingSteps: currentVettingImages };
      updateDraft('images', newImages);

      // Also mirror to vettingStages array if stage exists
      if (draftContent.vettingStages?.[nestedIndex]) {
        const updatedStages = [...draftContent.vettingStages];
        updatedStages[nestedIndex] = { ...updatedStages[nestedIndex], image: value };
        updateDraft('vettingStages', updatedStages);
      }
    } else if (type === 'leadership' && nestedIndex !== null) {
      const currentLeadership = [...(draftContent.images?.leadershipHeadshots || [])];
      if (currentLeadership[nestedIndex]) {
        currentLeadership[nestedIndex] = { ...currentLeadership[nestedIndex], image: value };
        const newImages = { ...(draftContent.images || {}), leadershipHeadshots: currentLeadership };
        updateDraft('images', newImages);
      }
    }
  };

  // Convert uploaded local file to base64 Data URL
  const handleFileUpload = (file, key, nestedIndex = null, type = 'bento') => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      handleImageUpdate(key, dataUrl, nestedIndex, type);
    };
    reader.readAsDataURL(file);
  };

  // ---------------------------------------------------------------------------
  // 3. CORE STAFFING PRACTICES (BENTO SERVICES) HANDLERS
  // ---------------------------------------------------------------------------
  const handleServiceChange = (index, field, value) => {
    const updated = [...draftContent.services];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft('services', updated);
  };

  // ---------------------------------------------------------------------------
  // 4. FIVE-STAGE VETTING MILESTONES HANDLERS
  // ---------------------------------------------------------------------------
  const handleVettingChange = (index, field, value) => {
    const updated = [...draftContent.vettingStages];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft('vettingStages', updated);
  };

  // ---------------------------------------------------------------------------
  // 5. FAQS HANDLERS
  // ---------------------------------------------------------------------------
  const handleFaqChange = (index, field, value) => {
    const updated = [...draftContent.faqs];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft('faqs', updated);
  };

  const handleAddFaq = () => {
    const newFaq = {
      id: 'faq_' + Date.now(),
      question: 'New Question regarding Sahara Staffing services?',
      answer: 'Provide clear, factual answers for enterprise hiring managers and prospective candidates.',
    };
    updateDraft('faqs', [...draftContent.faqs, newFaq]);
  };

  const handleDeleteFaq = (index) => {
    const updated = draftContent.faqs.filter((_, i) => i !== index);
    updateDraft('faqs', updated);
    setDeleteConfirmation(null);
  };

  // ---------------------------------------------------------------------------
  // 6. TESTIMONIALS HANDLERS
  // ---------------------------------------------------------------------------
  const handleTestimonialChange = (index, field, value) => {
    const updated = [...draftContent.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft('testimonials', updated);
  };

  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: 'test_' + Date.now(),
      name: 'Executive Partner',
      title: 'VP of Technology at High-Growth Enterprise',
      author: 'Executive Partner, VP of Technology at High-Growth Enterprise',
      quote: '“Sahara Staffing transformed our hiring velocity with exceptionally vetted candidates.”',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    };
    updateDraft('testimonials', [...draftContent.testimonials, newTestimonial]);
  };

  const handleDeleteTestimonial = (index) => {
    const updated = draftContent.testimonials.filter((_, i) => i !== index);
    updateDraft('testimonials', updated);
    setDeleteConfirmation(null);
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
                  {publishMessage || 'Site Content Successfully Published & Live Worldwide!'}
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  Changes synchronized with public website runtime and flat-file storage (/data/save-content.php).
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
            Enterprise split-screen workspace with real-time site preview, asset replacement dropzones, and strict CTA button governance.
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
      {/* 1. MASTER SPLIT-SCREEN LAYOUT STRUCTURE                               */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =================================================================== */}
        {/* LEFT COLUMN: EDITORS & CONTROL ACCORDIONS (SPAN 6 COLUMNS)          */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* ----------------------------------------------------------------- */}
          {/* ACCORDION 01: HERO COPY & BUTTON MANAGER (MAX 2 BUTTONS)           */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-xl bg-[#0E131F] border border-[#1E293B] overflow-hidden transition-all duration-200">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === 'hero' ? '' : 'hero')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 border border-[#E69D2B]/30 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                  01
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Hero Copy &amp; Button Manager
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-inter">
                    Main headline, kicker badge, highlight phrase, and strict 2-button CTA manager
                  </p>
                </div>
              </div>
              {activeAccordion === 'hero' ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>

            {activeAccordion === 'hero' && (
              <div className="p-4 pt-2 border-t border-[#1E293B]/70 space-y-4 text-xs">
                {/* Kicker Badge */}
                <div>
                  <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 font-mono">
                    Kicker Badge / Eyebrow Text
                  </label>
                  <input
                    type="text"
                    value={draftContent.hero.kicker}
                    onChange={(e) => handleHeroChange('kicker', e.target.value)}
                    placeholder="Pre-Vetted Tech & Executive Recruitment"
                    className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none transition-colors font-inter"
                  />
                </div>

                {/* Main Headline */}
                <div>
                  <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 font-mono">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={draftContent.hero.headline}
                    onChange={(e) => handleHeroChange('headline', e.target.value)}
                    placeholder="Connecting Elite Talent with High-Growth Enterprises"
                    className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none transition-colors font-inter font-medium"
                  />
                </div>

                {/* Gold Highlight Word */}
                <div>
                  <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 font-mono">
                    Gold Highlight Word / Phrase (Embedded in Headline)
                  </label>
                  <input
                    type="text"
                    value={draftContent.hero.highlightWord}
                    onChange={(e) => handleHeroChange('highlightWord', e.target.value)}
                    placeholder="Elite Talent"
                    className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-semibold focus:border-[#E69D2B] focus:outline-none transition-colors font-inter"
                  />
                </div>

                {/* Subtext Paragraph */}
                <div>
                  <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 font-mono">
                    Supporting Subtext Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={draftContent.hero.subtitle}
                    onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none transition-colors font-inter leading-relaxed"
                  />
                </div>

                {/* ============================================================= */}
                {/* DYNAMIC CTA BUTTON MANAGER (STRICT MAX 2 BUTTONS)             */}
                {/* ============================================================= */}
                <div className="pt-3 border-t border-[#1E293B]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                        Dynamic CTA Button Manager
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-[#E69D2B]">
                          {heroButtons.length}/2 Configured
                        </span>
                      </span>
                      <p className="text-[10.5px] text-[#64748B] mt-0.5">
                        The public Hero dynamically renders 0, 1, or 2 buttons based on this list.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddButton}
                      disabled={heroButtons.length >= 2}
                      className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[11px] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      title={heroButtons.length >= 2 ? 'Strict maximum of 2 buttons allowed' : 'Add CTA Button'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Button</span>
                    </button>
                  </div>

                  {/* Empty state when 0 buttons are active */}
                  {heroButtons.length === 0 && (
                    <div className="p-4 rounded-lg bg-[#131926] border border-dashed border-[#1E293B] text-center space-y-2">
                      <p className="text-[11px] text-[#94A3B8]">
                        Zero buttons currently configured. The hero section will render without action pills.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddButton}
                        className="text-xs text-[#E69D2B] font-semibold hover:underline"
                      >
                        + Add Primary CTA Button
                      </button>
                    </div>
                  )}

                  {/* Button Cards List (Up to 2) */}
                  <div className="space-y-3">
                    {heroButtons.map((btn, idx) => {
                      const isPrimary = idx === 0;
                      return (
                        <div
                          key={btn.id || idx}
                          className={`p-3.5 rounded-xl border transition-all ${
                            btn.enabled
                              ? 'bg-[#131926] border-[#1E293B]'
                              : 'bg-[#131926]/50 border-[#1E293B]/40 opacity-70'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#1E293B]/60">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                                  isPrimary
                                    ? 'bg-[#E69D2B]/20 text-[#E69D2B] border border-[#E69D2B]/30'
                                    : 'bg-white/10 text-white border border-white/20'
                                }`}
                              >
                                {isPrimary ? 'Button 1: Primary Gold Pill' : 'Button 2: Secondary Outline Pill'}
                              </span>

                              {/* Enable/Disable Toggle */}
                              <button
                                type="button"
                                onClick={() => handleToggleButton(idx)}
                                className={`text-[10.5px] font-medium flex items-center gap-1 transition-colors ${
                                  btn.enabled ? 'text-emerald-400' : 'text-[#64748B]'
                                }`}
                              >
                                {btn.enabled ? (
                                  <>
                                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <ToggleLeft className="w-4 h-4 text-[#64748B]" />
                                    <span>Disabled</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveButton(idx)}
                              className="text-[#64748B] hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                              title="Delete this CTA button"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                                Button Label
                              </label>
                              <input
                                type="text"
                                value={btn.label || ''}
                                onChange={(e) => handleUpdateButton(idx, 'label', e.target.value)}
                                placeholder={isPrimary ? 'Request Talent →' : 'Explore Open Roles'}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none transition-colors text-xs font-inter"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                                Link Destination
                              </label>
                              <select
                                value={btn.destination || '/contact'}
                                onChange={(e) => handleUpdateButton(idx, 'destination', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none transition-colors text-xs font-inter cursor-pointer"
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

                          {/* Live Micro-Pill Visual Feedback */}
                          <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10.5px]">
                            <span className="text-[#64748B]">Preview Rendering:</span>
                            <div className="inline-block">
                              {isPrimary ? (
                                <span className="px-3 py-1 rounded-full bg-[#E69D2B] text-[#0B0F17] font-semibold text-[10px] shadow-sm">
                                  {btn.label || 'Button 1'}
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/20 text-white font-medium text-[10px]">
                                  {btn.label || 'Button 2'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* ACCORDION 02: IMAGE ASSET REPLACEMENT CENTER                      */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-xl bg-[#0E131F] border border-[#1E293B] overflow-hidden transition-all duration-200">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === 'images' ? '' : 'images')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 border border-[#E69D2B]/30 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                  02
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Image Asset Replacement Center
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-inter">
                    Direct URL inputs &amp; drag-and-drop file uploaders for Bento cards, vetting steps, and executive headshots
                  </p>
                </div>
              </div>
              {activeAccordion === 'images' ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>

            {activeAccordion === 'images' && (
              <div className="p-4 pt-2 border-t border-[#1E293B]/70 space-y-4 text-xs">
                {/* Sub-tabs for Image Groups */}
                <div className="flex items-center gap-1.5 p-1 bg-[#131926] rounded-lg border border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setActiveImageTab('bento')}
                    className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeImageTab === 'bento'
                        ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    Bento Service Cards (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageTab('vetting')}
                    className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeImageTab === 'vetting'
                        ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    5-Stage Vetting (5)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageTab('leadership')}
                    className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeImageTab === 'leadership'
                        ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    Leadership Team (3)
                  </button>
                </div>

                {/* TAB 1: BENTO SERVICE CARDS IMAGES */}
                {activeImageTab === 'bento' && (
                  <div className="space-y-3">
                    {[
                      { key: 'bentoCard1', title: 'Bento Card 1: Flexible Staffing Portrait', defaultSrc: '/assets/card1-female-clean.jpg' },
                      { key: 'bentoCard2', title: 'Bento Card 2: Executive Search & Leadership', defaultSrc: '/assets/card2-talent.jpg' },
                      { key: 'bentoCard3', title: 'Bento Card 3: Specialized Technical Teams', defaultSrc: '/assets/talent-ai.jpg' },
                      { key: 'bentoCard4', title: 'Bento Card 4: Workforce Solutions (Enterprise RPO)', defaultSrc: '/assets/card3-workforce.jpg' },
                    ].map((slot) => {
                      const currentVal = draftContent.images?.[slot.key] || slot.defaultSrc;
                      return (
                        <div
                          key={slot.key}
                          className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-white font-mono">{slot.title}</span>
                            {currentVal !== slot.defaultSrc && (
                              <button
                                type="button"
                                onClick={() => handleImageUpdate(slot.key, slot.defaultSrc, null, 'bento')}
                                className="text-[10px] text-[#E69D2B] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reset Default</span>
                              </button>
                            )}
                          </div>

                          <div className="flex gap-3 items-center">
                            {/* Visual Thumbnail */}
                            <div className="w-20 h-14 rounded-lg overflow-hidden border border-[#1E293B] bg-black/40 shrink-0 relative group">
                              <img
                                src={currentVal}
                                alt={slot.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Direct URL Input */}
                            <div className="flex-1 space-y-1">
                              <div className="relative">
                                <LinkIcon className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={currentVal}
                                  onChange={(e) => handleImageUpdate(slot.key, e.target.value, null, 'bento')}
                                  placeholder="https://... or /assets/..."
                                  className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white text-[11px] focus:border-[#E69D2B] focus:outline-none font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Drag & Drop Local File Upload Dropzone */}
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverKey(slot.key);
                            }}
                            onDragLeave={() => setDragOverKey(null)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOverKey(null);
                              if (e.dataTransfer.files?.[0]) {
                                handleFileUpload(e.dataTransfer.files[0], slot.key, null, 'bento');
                              }
                            }}
                            className={`p-2.5 rounded-lg border border-dashed transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                              dragOverKey === slot.key
                                ? 'border-[#E69D2B] bg-[#E69D2B]/10 text-white'
                                : 'border-[#1E293B] hover:border-[#E69D2B]/60 text-[#64748B] hover:text-[#94A3B8]'
                            }`}
                            onClick={() => {
                              const el = document.getElementById(`upload-${slot.key}`);
                              if (el) el.click();
                            }}
                          >
                            <input
                              type="file"
                              id={`upload-${slot.key}`}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], slot.key, null, 'bento');
                                }
                              }}
                            />
                            <Upload className="w-3.5 h-3.5" />
                            <span className="text-[10.5px]">
                              Drag &amp; Drop local image or <strong className="text-[#E69D2B]">browse</strong>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 2: 5-STAGE VETTING STEP IMAGES */}
                {activeImageTab === 'vetting' && (
                  <div className="space-y-3">
                    {[
                      { step: '01', name: 'Understand (Leadership Context)', defaultSrc: '/assets/card1-staffing.jpg' },
                      { step: '02', name: 'Source (Market Search)', defaultSrc: '/assets/card3-workforce.jpg' },
                      { step: '03', name: 'Assess (Technical Diligence)', defaultSrc: '/assets/service-workforce.jpg' },
                      { step: '04', name: 'Coordinate (Executive Alignment)', defaultSrc: '/assets/hero-1.jpg' },
                      { step: '05', name: 'Support (Profile & Onboarding)', defaultSrc: '/assets/female-executive-beige.jpg' },
                    ].map((slot, idx) => {
                      const currentVal = draftContent.images?.vettingSteps?.[idx] || slot.defaultSrc;
                      const fieldKey = `vettingStep-${idx}`;
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-white font-mono">
                              Step {slot.step}: {slot.name}
                            </span>
                            {currentVal !== slot.defaultSrc && (
                              <button
                                type="button"
                                onClick={() => handleImageUpdate(fieldKey, slot.defaultSrc, idx, 'vetting')}
                                className="text-[10px] text-[#E69D2B] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reset Default</span>
                              </button>
                            )}
                          </div>

                          <div className="flex gap-3 items-center">
                            <div className="w-20 h-14 rounded-lg overflow-hidden border border-[#1E293B] bg-black/40 shrink-0">
                              <img src={currentVal} alt={slot.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 relative">
                              <LinkIcon className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => handleImageUpdate(fieldKey, e.target.value, idx, 'vetting')}
                                placeholder="Image URL..."
                                className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white text-[11px] focus:border-[#E69D2B] focus:outline-none font-mono"
                              />
                            </div>
                          </div>

                          {/* Dropzone */}
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
                                handleFileUpload(e.dataTransfer.files[0], fieldKey, idx, 'vetting');
                              }
                            }}
                            className={`p-2.5 rounded-lg border border-dashed transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                              dragOverKey === fieldKey
                                ? 'border-[#E69D2B] bg-[#E69D2B]/10 text-white'
                                : 'border-[#1E293B] hover:border-[#E69D2B]/60 text-[#64748B]'
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
                                  handleFileUpload(e.target.files[0], fieldKey, idx, 'vetting');
                                }
                              }}
                            />
                            <Upload className="w-3.5 h-3.5" />
                            <span className="text-[10.5px]">Upload Step {slot.step} image</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 3: EXECUTIVE LEADERSHIP HEADSHOTS */}
                {activeImageTab === 'leadership' && (
                  <div className="space-y-3">
                    {(draftContent.images?.leadershipHeadshots || []).map((lead, idx) => {
                      const fieldKey = `lead-${idx}`;
                      return (
                        <div
                          key={lead.id || idx}
                          className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-white font-mono">
                              {lead.name} — <span className="text-[#E69D2B]">{lead.title}</span>
                            </span>
                          </div>

                          <div className="flex gap-3 items-center">
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#E69D2B]/40 bg-black/40 shrink-0">
                              <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 relative">
                              <LinkIcon className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={lead.image}
                                onChange={(e) => handleImageUpdate(fieldKey, e.target.value, idx, 'leadership')}
                                placeholder="Headshot URL..."
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
                                handleFileUpload(e.dataTransfer.files[0], fieldKey, idx, 'leadership');
                              }
                            }}
                            className="p-2 rounded-lg border border-dashed border-[#1E293B] hover:border-[#E69D2B]/60 text-[#64748B] text-center flex items-center justify-center gap-2 cursor-pointer"
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
                                  handleFileUpload(e.target.files[0], fieldKey, idx, 'leadership');
                                }
                              }}
                            />
                            <Upload className="w-3.5 h-3.5" />
                            <span className="text-[10.5px]">Upload portrait for {lead.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* ACCORDION 03: CORE STAFFING PRACTICES & VETTING CONTENT           */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-xl bg-[#0E131F] border border-[#1E293B] overflow-hidden transition-all duration-200">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === 'services' ? '' : 'services')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 border border-[#E69D2B]/30 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                  03
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Core Staffing Practices &amp; Vetting Content
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-inter">
                    Editable copy for the 4 Bento solution cards and 5-stage vetting narrative
                  </p>
                </div>
              </div>
              {activeAccordion === 'services' ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>

            {activeAccordion === 'services' && (
              <div className="p-4 pt-2 border-t border-[#1E293B]/70 space-y-4 text-xs">
                <div className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                  Bento Staffing Solutions ({draftContent.services.length})
                </div>

                {draftContent.services.map((service, idx) => (
                  <div
                    key={service.id || idx}
                    className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-[#E69D2B]">
                        Practice 0{idx + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Practice Title
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none font-inter text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                          Badge / Tag Label
                        </label>
                        <input
                          type="text"
                          value={service.badge || service.category}
                          onChange={(e) => {
                            handleServiceChange(idx, 'badge', e.target.value);
                            handleServiceChange(idx, 'category', e.target.value);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 font-mono">
                        Summary Description
                      </label>
                      <textarea
                        rows={2}
                        value={service.description}
                        onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none font-inter text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-[#1E293B]/70">
                  <div className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono mb-3">
                    5-Stage Vetting Milestones
                  </div>

                  <div className="space-y-3">
                    {draftContent.vettingStages.map((stage, idx) => (
                      <div
                        key={stage.id || idx}
                        className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#E69D2B] text-xs">
                            {stage.order}
                          </span>
                          <input
                            type="text"
                            value={stage.name}
                            onChange={(e) => handleVettingChange(idx, 'name', e.target.value)}
                            className="px-2.5 py-1 rounded-md bg-[#0E131F] border border-[#1E293B] text-white font-medium text-xs focus:border-[#E69D2B] focus:outline-none font-inter flex-1"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={stage.description}
                          onChange={(e) => handleVettingChange(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-md bg-[#0E131F] border border-[#1E293B] text-white text-xs focus:border-[#E69D2B] focus:outline-none font-inter leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* ACCORDION 04: FAQS & TESTIMONIALS EDITOR                          */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-xl bg-[#0E131F] border border-[#1E293B] overflow-hidden transition-all duration-200">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === 'faqs' ? '' : 'faqs')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#E69D2B]/15 border border-[#E69D2B]/30 flex items-center justify-center font-mono text-xs font-bold text-[#E69D2B]">
                  04
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    FAQs &amp; Testimonials Editor
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-inter">
                    Manage client reviews, executive quotes, and public FAQ accordions
                  </p>
                </div>
              </div>
              {activeAccordion === 'faqs' ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>

            {activeAccordion === 'faqs' && (
              <div className="p-4 pt-2 border-t border-[#1E293B]/70 space-y-5 text-xs">
                {/* Part A: FAQs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                      FAQ Items ({draftContent.faqs.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[10.5px] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {draftContent.faqs.map((faq, idx) => (
                    <div
                      key={faq.id || idx}
                      className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                          placeholder="Question..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-white font-medium text-xs focus:border-[#E69D2B] focus:outline-none font-inter"
                        />
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmation({ type: 'faq', index: idx, title: faq.question })}
                          className="text-[#64748B] hover:text-red-400 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                        placeholder="Answer..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E131F] border border-[#1E293B] text-[#CBD5E1] text-xs focus:border-[#E69D2B] focus:outline-none font-inter leading-relaxed"
                      />
                    </div>
                  ))}
                </div>

                {/* Part B: Testimonials */}
                <div className="pt-4 border-t border-[#1E293B]/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-[#E69D2B] uppercase tracking-wider font-mono">
                      Client Reviews ({draftContent.testimonials.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTestimonial}
                      className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-[10.5px] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  {draftContent.testimonials.map((test, idx) => (
                    <div
                      key={test.id || idx}
                      className="p-3.5 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-mono text-[#E69D2B] font-semibold">
                          Review 0{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmation({ type: 'testimonial', index: idx, title: test.name || test.author })}
                          className="text-[#64748B] hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={test.name || ''}
                          onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)}
                          placeholder="Reviewer Name (e.g. Elena Rostova)"
                          className="px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs font-inter focus:border-[#E69D2B] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={test.title || test.role || ''}
                          onChange={(e) => {
                            handleTestimonialChange(idx, 'title', e.target.value);
                            handleTestimonialChange(idx, 'role', e.target.value);
                          }}
                          placeholder="Title / Company (e.g. CFO at GreenFlag)"
                          className="px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs font-inter focus:border-[#E69D2B] focus:outline-none"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={test.quote}
                        onChange={(e) => handleTestimonialChange(idx, 'quote', e.target.value)}
                        placeholder="Quote text..."
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-[#CBD5E1] text-xs font-inter leading-relaxed focus:border-[#E69D2B] focus:outline-none"
                      />

                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-[#1E293B] shrink-0">
                          <img src={test.avatar || test.image} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={test.avatar || test.image || ''}
                          onChange={(e) => {
                            handleTestimonialChange(idx, 'avatar', e.target.value);
                            handleTestimonialChange(idx, 'image', e.target.value);
                          }}
                          placeholder="Avatar Image URL..."
                          className="flex-1 px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white text-[10.5px] font-mono focus:border-[#E69D2B] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: REAL INTERACTIVE SITE PREVIEW CANVAS (SPAN 6 COLUMNS) */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 sticky top-6 h-[calc(100vh-140px)] bg-[#0B0F17] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          
          {/* ----------------------------------------------------------------- */}
          {/* BROWSER TOP CHROME BAR                                            */}
          {/* ----------------------------------------------------------------- */}
          <div className="h-12 bg-[#0E131F] border-b border-white/10 px-4 flex items-center justify-between shrink-0 select-none z-20">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/40" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/40" />
            </div>

            {/* URL bar & SSL badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#131926] border border-white/5 text-[11px] text-[#94A3B8] font-mono max-w-[280px]">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate text-white/90">saharastaffing.com/preview</span>
              <button
                type="button"
                onClick={() => setPreviewKey((k) => k + 1)}
                className="text-[#64748B] hover:text-white transition-colors ml-auto cursor-pointer"
                title="Reload preview components"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Viewport Switcher Pills (Desktop | Mobile) */}
            <div className="flex items-center gap-1 bg-[#131926] p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewportMode === 'desktop'
                    ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Desktop 💻</span>
              </button>

              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewportMode === 'mobile'
                    ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mobile 📱</span>
              </button>
            </div>
          </div>

          {/* Quick Section Jump Pills */}
          <div className="bg-[#0B0F17] px-4 py-1.5 border-b border-white/[0.06] flex items-center gap-1.5 text-[10px] overflow-x-auto no-scrollbar shrink-0 select-none">
            <span className="text-[#64748B] font-mono uppercase font-semibold mr-1">Jump to:</span>
            {[
              { id: 'hero-section', label: 'Hero' },
              { id: 'capital-section', label: 'Bento' },
              { id: 'process-story', label: 'Vetting' },
              { id: 'testimonials-section', label: 'Reviews' },
              { id: 'faq-section', label: 'FAQ' },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleScrollToSection(sec.id)}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-[#E69D2B]/20 text-[#94A3B8] hover:text-[#E69D2B] transition-colors cursor-pointer whitespace-nowrap"
              >
                {sec.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Sync</span>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SCALED LIVE RENDER CANVAS                                         */}
          {/* ----------------------------------------------------------------- */}
          <div
            ref={previewScrollRef}
            className="flex-1 overflow-y-auto custom-scrollbar bg-[#080B12] relative"
          >
            {/* Wrap preview canvas with draft content override context */}
            <CMSPreviewProvider content={draftContent} key={previewKey}>
              {viewportMode === 'desktop' ? (
                /* DESKTOP VIEWPORT: Full width smooth scroll */
                <div className="w-full min-h-full bg-[#0B0F17] text-white">
                  <div id="hero-section">
                    <Hero />
                  </div>
                  <SocialProofMarquee />
                  <div id="capital-section">
                    <BentoGrowthCapital />
                  </div>
                  <div id="process-story">
                    <VettingProcess />
                  </div>
                  <div id="testimonials-section">
                    <Testimonials />
                  </div>
                  <div id="faq-section">
                    <FAQ />
                  </div>
                  <Footer />
                </div>
              ) : (
                /* MOBILE VIEWPORT: Authentically scaled 375px phone frame */
                <div className="py-6 px-3 flex justify-center items-start min-h-full bg-black/50">
                  <div className="w-[375px] max-w-full rounded-[40px] border-[8px] border-[#1E293B] bg-[#0B0F17] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative text-white">
                    {/* Phone Top Speaker/Sensor Notch */}
                    <div className="w-full h-6 bg-[#0B0F17] flex justify-center items-center shrink-0 border-b border-white/[0.04]">
                      <div className="w-20 h-3 bg-[#1E293B] rounded-full" />
                    </div>

                    {/* Mobile Frame Content Scroll */}
                    <div className="w-full overflow-y-auto custom-scrollbar">
                      <div id="hero-section">
                        <Hero />
                      </div>
                      <SocialProofMarquee />
                      <div id="capital-section">
                        <BentoGrowthCapital />
                      </div>
                      <div id="process-story">
                        <VettingProcess />
                      </div>
                      <div id="testimonials-section">
                        <Testimonials />
                      </div>
                      <div id="faq-section">
                        <FAQ />
                      </div>
                      <Footer />
                    </div>
                  </div>
                </div>
              )}
            </CMSPreviewProvider>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                             */}
      {/* ===================================================================== */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0E131F] border border-[#1E293B] p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Confirm Removal</h4>
                <p className="text-[11px] text-[#64748B]">Permanent action upon publishing</p>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Are you sure you want to remove &ldquo;<strong className="text-white">{deleteConfirmation.title}</strong>&rdquo;? This will be applied to the working draft immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-3.5 py-1.5 text-xs text-[#94A3B8] hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmation.type === 'faq') {
                    handleDeleteFaq(deleteConfirmation.index);
                  } else if (deleteConfirmation.type === 'testimonial') {
                    handleDeleteTestimonial(deleteConfirmation.index);
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
