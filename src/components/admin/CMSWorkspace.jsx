import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Edit3,
  LayoutGrid,
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


// ---------------------------------------------------------------------------
// INTERACTIVE SECTION WRAPPER WITH HOVER HIGHLIGHTS & CLICK-TO-EDIT
// ---------------------------------------------------------------------------
function EditableSection({
  blockId,
  blockNumber,
  blockTitle,
  children,
  activeBlock,
  isDrawerOpen,
  onSelectBlock,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = isDrawerOpen && activeBlock === blockId;

  return (
    <div
      id={blockId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectBlock(blockId);
      }}
      className={`relative transition-all duration-150 cursor-pointer group ${
        isSelected
          ? 'outline outline-2 outline-[#E69D2B] outline-offset-[-2px] shadow-[0_0_30px_rgba(230,157,43,0.3)] z-20'
          : isHovered
          ? 'outline outline-2 outline-[#E69D2B] outline-offset-[-2px] shadow-[0_0_20px_rgba(230,157,43,0.2)] z-10'
          : ''
      }`}
    >
      <AnimatePresence>
        {(isHovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-4 left-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B0F17]/95 border border-[#E69D2B] text-white shadow-2xl pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#E69D2B] animate-pulse" />
            <span className="text-xs font-bold font-mono text-[#E69D2B]">
              ✏️ Edit Block {blockNumber}: {blockTitle}
            </span>
            <span className="text-[10px] text-white/70 font-sans hidden sm:inline">
              (Click to edit)
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TRUE 375PX MOBILE PREVIEW IFRAME ENGINE (React Portal & Isolated Head CSS)
// ---------------------------------------------------------------------------
function MobilePreviewIframe({ children }) {
  const iframeRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupIframe = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const syncStyles = () => {
        doc.head.innerHTML = '';

        // Inject base mobile reset styles & disable button navigation
        const baseStyle = doc.createElement('style');
        baseStyle.textContent = `
          *, *::before, *::after {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            background-color: #0B0F17;
            overflow-x: hidden;
            width: 100%;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 4px;
          }
          ::-webkit-scrollbar-track {
            background: #0B0F17;
          }
          ::-webkit-scrollbar-thumb {
            background: #E69D2B;
            border-radius: 9999px;
          }
          /* Disable live preview button & link navigation */
          button, a, [role="button"] {
            pointer-events: none !important;
            cursor: pointer !important;
          }
        `;
        doc.head.appendChild(baseStyle);

        // Copy parent styles & link stylesheets
        const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"], link[rel="preconnect"]');
        parentStyles.forEach((el) => {
          doc.head.appendChild(el.cloneNode(true));
        });
      };

      syncStyles();

      const observer = new MutationObserver(() => syncStyles());
      observer.observe(document.head, { childList: true, subtree: true });

      setMountNode(doc.body);

      return () => observer.disconnect();
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      setupIframe();
    } else {
      iframe.addEventListener('load', setupIframe);
      return () => iframe.removeEventListener('load', setupIframe);
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Sahara Staffing Mobile Live Viewport"
      className="w-full h-full border-0 block bg-[#0B0F17] rounded-[38px] overflow-y-auto"
      style={{ border: 'none' }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}

// ---------------------------------------------------------------------------
// SECTION PILLS CONFIGURATION (FOR BOTTOM QUICK-JUMP BAR)
// ---------------------------------------------------------------------------
const SECTION_PILLS = {
  home: [
    { id: 'home-block-01', num: '01', label: 'Hero', anchor: '#hero-section' },
    { id: 'home-block-02', num: '02', label: 'Partners & Metrics', anchor: '#metrics-section' },
    { id: 'home-block-03', num: '03', label: 'Bento Solutions', anchor: '#capital-section' },
    { id: 'home-block-04', num: '04', label: 'Kinetic Pipeline', anchor: '#process-story' },
    { id: 'home-block-05', num: '05', label: 'Hiring Estimator', anchor: '#staffing-momentum' },
    { id: 'home-block-06', num: '06', label: 'Testimonials', anchor: '#testimonials-section' },
    { id: 'home-block-07', num: '07', label: 'FAQ', anchor: '#faq-section' },
    { id: 'home-block-08', num: '08', label: 'CTA & Footer', anchor: '#footer-section' },
  ],
  about: [
    { id: 'about-block-01', num: '01', label: 'About Hero', anchor: '#about-hero' },
    { id: 'about-block-02', num: '02', label: 'Benchmarks', anchor: '#about-benchmarks' },
    { id: 'about-block-03', num: '03', label: 'Discipline Matrix', anchor: '#about-mindset' },
    { id: 'about-block-04', num: '04', label: 'Leadership', anchor: '#about-leadership' },
    { id: 'about-block-05', num: '05', label: 'Scale Stats', anchor: '#about-stats' },
    { id: 'about-block-06', num: '06', label: 'Final CTA', anchor: '#about-final-cta' },
  ],
  services: [
    { id: 'services-block-01', num: '01', label: 'Services Hero', anchor: '#services-hero' },
    { id: 'services-block-02', num: '02', label: 'Capabilities', anchor: '#services-capabilities' },
    { id: 'services-block-03', num: '03', label: 'Vetting', anchor: '#services-vetting' },
    { id: 'services-block-04', num: '04', label: 'Engagement', anchor: '#services-models' },
    { id: 'services-block-05', num: '05', label: 'SLA Guarantee', anchor: '#services-sla' },
  ],
  contact: [
    { id: 'contact-block-01', num: '01', label: 'Contact Intake', anchor: '#contact-workspace' },
  ],
  settings: [
    { id: 'global-settings', num: '⚙️', label: 'Site Utilities', anchor: '#global-settings' },
  ],
};

export default function CMSWorkspace({ onToggleSidebar, sidebarCollapsed }) {
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

  // Set of currently expanded block IDs inside the drawer
  const [expandedBlocks, setExpandedBlocks] = useState(() => new Set(['home-block-01']));

  // Active focused section block (for outline highlight in preview canvas)
  const [activeBlock, setActiveBlock] = useState('home-block-01');

  // Right Section Block Editor Drawer state (docked open by default on desktop)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Preview viewport mode: 'desktop' (True 1440px Scaled) | 'mobile' (Phone 375px)
  const [viewportMode, setViewportMode] = useState('desktop');

  // Center Stage & Preview Sizing Refs
  const stageRef = useRef(null);
  const previewScrollRef = useRef(null);
  const contentRef = useRef(null);
  const drawerScrollRef = useRef(null);
  const [stageWidth, setStageWidth] = useState(1100);
  const [contentHeight, setContentHeight] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [dragOverKey, setDragOverKey] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Track Center Stage width for dynamic 1440px desktop scaling math
  useEffect(() => {
    if (!stageRef.current) return;
    const updateWidth = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setStageWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [isDrawerOpen]);

  // Scaled desktop math: Fits true 1440px desktop frame neatly into stage
  const desktopScale = Math.min(1, Math.max(0.42, (stageWidth - 36) / 1440));

  // Track rendered content height
  useEffect(() => {
    if (!contentRef.current) return;
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight || contentRef.current.offsetHeight);
      }
    };
    updateHeight();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setContentHeight(entry.contentRect.height);
        }
      }
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [activePageTab, previewKey, draftContent]);

  const isBlockExpanded = (blockId) => expandedBlocks.has(blockId);

  const getBlocksForPage = (pageTab) => {
    switch (pageTab) {
      case 'home':
        return [
          'home-block-01',
          'home-block-02',
          'home-block-03',
          'home-block-04',
          'home-block-05',
          'home-block-06',
          'home-block-07',
          'home-block-08',
        ];
      case 'about':
        return [
          'about-block-01',
          'about-block-02',
          'about-block-03',
          'about-block-04',
          'about-block-05',
          'about-block-06',
        ];
      case 'services':
        return [
          'services-block-01',
          'services-block-02',
          'services-block-03',
          'services-block-04',
          'services-block-05',
        ];
      case 'contact':
        return ['contact-block-01'];
      case 'settings':
        return ['global-settings'];
      default:
        return [];
    }
  };

  const expandAllBlocks = () => {
    const blocks = getBlocksForPage(activePageTab);
    setExpandedBlocks(new Set(blocks));
  };

  const collapseAllBlocks = () => {
    setExpandedBlocks(new Set());
  };

  // Smooth scroll center preview canvas to element anchor with transform math
  const scrollToPreviewAnchor = (domAnchorId) => {
    if (!domAnchorId || !previewScrollRef.current) return;
    setTimeout(() => {
      try {
        const container = previewScrollRef.current;
        const el = container.querySelector(domAnchorId);
        if (el) {
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const delta = elRect.top - containerRect.top;
          const targetScrollTop = container.scrollTop + delta - 20;
          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth',
          });
        }
      } catch (err) {
        console.warn('Scroll anchor calculation error:', err);
      }
    }, 80);
  };

  const openBlockDrawer = (blockId, domAnchorId) => {
    setActiveBlock(blockId);
    setExpandedBlocks((prev) => new Set(prev).add(blockId));
    if (!isDrawerOpen) setIsDrawerOpen(true);
    scrollToPreviewAnchor(domAnchorId);
    setTimeout(() => {
      const editorEl = document.getElementById(`editor-${blockId}`);
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handlePillClick = (pill) => {
    setActiveBlock(pill.id);
    setExpandedBlocks((prev) => new Set(prev).add(pill.id));
    if (!isDrawerOpen) setIsDrawerOpen(true);
    scrollToPreviewAnchor(pill.anchor);
    setTimeout(() => {
      const editorEl = document.getElementById(`editor-${pill.id}`);
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleBlockToggle = (blockId, domAnchorId) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
    setActiveBlock(blockId);
    scrollToPreviewAnchor(domAnchorId);
  };

  const noOp = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
  };

  const getBlockTitle = (blockId) => {
    switch (blockId) {
      case 'home-block-01': return 'Block 01: Hero Section';
      case 'home-block-02': return 'Block 02: Partners & Metrics Strip';
      case 'home-block-03': return 'Block 03: Bento Solutions Grid';
      case 'home-block-04': return 'Block 04: Kinetic Vetting Pipeline';
      case 'home-block-05': return 'Block 05: Executive Hiring Estimator';
      case 'home-block-06': return 'Block 06: Testimonials Carousel';
      case 'home-block-07': return 'Block 07: Frequently Asked Questions';
      case 'home-block-08': return 'Block 08: Bottom CTA & Footer';
      case 'about-block-01': return 'Block 01: About Hero Section';
      case 'about-block-02': return 'Block 02: Operating Benchmarks';
      case 'about-block-03': return 'Block 03: Discipline Matrix';
      case 'about-block-04': return 'Block 04: Leadership Council';
      case 'about-block-05': return 'Block 05: Hard Scale Stats';
      case 'about-block-06': return 'Block 06: Final CTA';
      case 'services-block-01': return 'Block 01: Services Hero Section';
      case 'services-block-02': return 'Block 02: Service Capabilities Grid';
      case 'services-block-03': return 'Block 03: Vetting Process';
      case 'services-block-04': return 'Block 04: Engagement Models';
      case 'services-block-05': return 'Block 05: SLA Guarantee';
      case 'contact-block-01': return 'Block 01: Contact Form & Intake';
      case 'global-settings': return 'Global Site Utility Toggles';
      default: return 'Section Settings';
    }
  };

  // Scroll to top of preview when switching page tabs
  useEffect(() => {
    if (previewScrollRef.current) {
      previewScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Set default active block for selected page
    let defaultBlock = 'home-block-01';
    if (activePageTab === 'home') defaultBlock = 'home-block-01';
    else if (activePageTab === 'about') defaultBlock = 'about-block-01';
    else if (activePageTab === 'services') defaultBlock = 'services-block-01';
    else if (activePageTab === 'contact') defaultBlock = 'contact-block-01';
    else if (activePageTab === 'settings') {
      defaultBlock = 'global-settings';
      setIsDrawerOpen(true);
    }
    setActiveBlock(defaultBlock);
    setExpandedBlocks(new Set([defaultBlock]));
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

  // =========================================================================
  // LIVE SITE PREVIEW CANVAS CONTENT (EXACT 1:1 REPLICA OF THE REAL SITE)
  // Replicates exact architectural Bento Canvas, warm stone #EBE7DE gutter,
  // detached rounded cards, and non-interactive preview action buttons.
  // =========================================================================
  const renderPreviewContent = () => (
    <div className="preview-site-content w-full relative min-h-screen bg-[#EBE7DE] text-[#0B0F17] selection:bg-[#E69D2B] selection:text-[#0B0F17]">
      {/* Scoped CSS rule: Disables link navigation and button hijacking in live preview */}
      <style>{`
        .preview-site-content button,
        .preview-site-content a,
        .preview-site-content [role="button"] {
          pointer-events: none !important;
          cursor: pointer !important;
        }
      `}</style>

      {/* ===================================================================== */}
      {/* 1. HOMEPAGE VIEWPORT (EXACT MATCH OF REAL SITE DOM & ARCHITECTURE)   */}
      {/* ===================================================================== */}
      {(activePageTab === 'home' || activePageTab === 'settings') && (
        <>
          {/* Block 01: Hero Section (Embeds 3-Part Glassmorphic Header) */}
          <EditableSection
            blockId="home-block-01"
            blockNumber="01"
            blockTitle="Hero Section"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="hero-section">
              <Hero
                onNavigate={noOp}
                onNavigateContact={noOp}
                onNavigateServices={noOp}
                currentRoute="home"
              />
            </div>
          </EditableSection>

          {/* Architectural Bento Canvas (Warm Stone Gutter with Rounded Cards) */}
          <main className="relative z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-3.5 sm:gap-5 lg:gap-6 bg-[#EBE7DE]">
            {/* Block 02: Partners & Metrics Strip (White Detached Rounded Card) */}
            <EditableSection
              blockId="home-block-02"
              blockNumber="02"
              blockTitle="Partners & Metrics Strip"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="metrics-section">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <SocialProofMarquee />
                </section>
              </div>
            </EditableSection>

            {/* Block 03: Bento Solutions Grid (Warm Cream Detached Rounded Card) */}
            <EditableSection
              blockId="home-block-03"
              blockNumber="03"
              blockTitle="Bento Solutions Grid"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="capital-section">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#FAF9F6] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <BentoGrowthCapital onNavigateService={noOp} />
                </section>
              </div>
            </EditableSection>
          </main>

          {/* Block 04: Kinetic Vetting Pipeline (Full-Width Cinematic Stage) */}
          <EditableSection
            blockId="home-block-04"
            blockNumber="04"
            blockTitle="Kinetic Vetting Pipeline"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="process-story">
              <VettingProcess
                onNavigateContact={noOp}
                onNavigateServices={noOp}
              />
            </div>
          </EditableSection>

          {/* Architectural Bento Canvas — Lower Block */}
          <main className="relative z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-3.5 sm:gap-5 lg:gap-6 bg-[#EBE7DE]">
            {/* Block 05: Executive Hiring Estimator */}
            <EditableSection
              blockId="home-block-05"
              blockNumber="05"
              blockTitle="Executive Hiring Estimator"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="staffing-momentum">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <Calculator
                    onNavigateContact={noOp}
                    onProceedToContact={noOp}
                  />
                </section>
              </div>
            </EditableSection>

            {/* Block 06: Testimonials Carousel */}
            <EditableSection
              blockId="home-block-06"
              blockNumber="06"
              blockTitle="Testimonials Carousel"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="testimonials-section">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#FAF9F6] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <Testimonials />
                </section>
              </div>
            </EditableSection>

            {/* Block 07: Frequently Asked Questions */}
            <EditableSection
              blockId="home-block-07"
              blockNumber="07"
              blockTitle="Frequently Asked Questions"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="faq-section">
                <section className="rounded-2xl sm:rounded-[20px] overflow-hidden bg-white border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)]">
                  <FAQ />
                </section>
              </div>
            </EditableSection>

            {/* Block 08: Bottom CTA & Global Footer */}
            <EditableSection
              blockId="home-block-08"
              blockNumber="08"
              blockTitle="Bottom CTA & Footer"
              activeBlock={activeBlock}
              isDrawerOpen={isDrawerOpen}
              onSelectBlock={openBlockDrawer}
            >
              <div id="footer-section">
                <section className="relative rounded-2xl sm:rounded-[20px] overflow-hidden bg-gradient-to-b from-white via-white to-[#FCEFD2] border border-[#DDD7CC] shadow-[0_4px_24px_rgba(11,15,23,0.03)] mb-4 sm:mb-6">
                  <div className="animate-breathe absolute bottom-0 inset-x-0 h-[720px] bg-gradient-to-t from-[#E69D2B]/30 via-[#E69D2B]/10 to-transparent pointer-events-none" />
                  <SpeakToExperts onNavigateContact={noOp} />
                </section>
                <Footer onNavigate={noOp} />
              </div>
            </EditableSection>
          </main>
        </>
      )}

      {/* ===================================================================== */}
      {/* 2. ABOUT PAGE VIEWPORT                                                 */}
      {/* ===================================================================== */}
      {activePageTab === 'about' && (
        <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-between">
          <Header onNavigate={noOp} currentRoute="about" />
          <EditableSection
            blockId="about-block-01"
            blockNumber="01"
            blockTitle="About Narrative & Benchmarks"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="about-hero">
              <AboutPage
                onNavigateContact={noOp}
                onNavigateServices={noOp}
              />
            </div>
          </EditableSection>
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={noOp} />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. SERVICES PAGE VIEWPORT                                              */}
      {/* ===================================================================== */}
      {activePageTab === 'services' && (
        <div className="min-h-screen bg-[#F8F6F1] flex flex-col justify-between">
          <Header onNavigate={noOp} currentRoute="services" />
          <EditableSection
            blockId="services-block-01"
            blockNumber="01"
            blockTitle="Services Capabilities & Practice"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="services-hero">
              <ServicesPage
                onNavigateContact={noOp}
                onNavigate={noOp}
              />
            </div>
          </EditableSection>
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={noOp} />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. CONTACT PAGE VIEWPORT                                               */}
      {/* ===================================================================== */}
      {activePageTab === 'contact' && (
        <div className="min-h-screen bg-[#F8F6F1] flex flex-col justify-between">
          <Header onNavigate={noOp} currentRoute="contact" />
          <EditableSection
            blockId="contact-block-01"
            blockNumber="01"
            blockTitle="Contact Form & Intake Portal"
            activeBlock={activeBlock}
            isDrawerOpen={isDrawerOpen}
            onSelectBlock={openBlockDrawer}
          >
            <div id="contact-workspace">
              <ContactPage />
            </div>
          </EditableSection>
          <div className="px-3 sm:px-5 lg:px-7 py-4 sm:py-6 bg-[#EBE7DE]">
            <Footer onNavigate={noOp} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col min-h-screen bg-[#0B0F17] overflow-hidden">
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
            className="fixed top-20 right-8 z-[60] p-4 rounded-xl bg-gradient-to-r from-emerald-950/95 via-[#064e3b]/95 to-emerald-950/95 border border-emerald-500/50 text-white shadow-2xl flex items-center justify-between gap-4 max-w-md"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 1. FLOATING TOP CONTROL BAR (FIXED OVERLAY AT TOP CENTER)              */}
      {/* ===================================================================== */}
      <header className="sticky top-3 z-40 mx-auto w-[calc(100%-2rem)] max-w-6xl px-4 py-2.5 bg-[#0E131F]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 shrink-0">
        {/* Left: Sidebar Toggle + Page Route Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#E69D2B] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title={sidebarCollapsed ? "Expand sidebar (260px)" : "Collapse sidebar (68px)"}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          )}

          {/* Minimal Animated Page Route Tabs */}
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'about', label: 'About', icon: Info },
            { id: 'services', label: 'Services', icon: Briefcase },
            { id: 'contact', label: 'Contact', icon: PhoneCall },
            { id: 'settings', label: 'Global Settings', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activePageTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActivePageTab(tab.id);
                  if (tab.id === 'settings') {
                    setActiveBlock('global-settings');
                    setIsDrawerOpen(true);
                  }
                }}
                className={`relative px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold transition-colors cursor-pointer select-none flex items-center gap-1.5 shrink-0 ${
                  isActive ? 'text-[#0B0F17]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCmsTab"
                    className="absolute inset-0 bg-[#E69D2B] rounded-xl shadow-md z-0"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-[#0B0F17]' : 'text-[#E69D2B]'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center / Right: Viewport Mode + Drawer Trigger + Save & Publish */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Device Viewport Switcher */}
          <div className="flex items-center gap-1 bg-[#131926] p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewportMode === 'desktop'
                  ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm font-bold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="Desktop True 100% Dimensions"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>

            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewportMode === 'mobile'
                  ? 'bg-[#E69D2B] text-[#0B0F17] shadow-sm font-bold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="Mobile 375px Chassis"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile (375px)</span>
            </button>
          </div>

          {/* Quick Edit Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDrawerOpen
                ? 'bg-[#E69D2B]/20 text-[#E69D2B] border-[#E69D2B]/40'
                : 'bg-[#131926] text-white border-white/10 hover:border-[#E69D2B]/40'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#E69D2B]" />
            <span className="hidden md:inline">
              {isDrawerOpen ? 'Close Drawer' : 'Edit Block'}
            </span>
          </button>

          {/* Save & Publish Changes Gold CTA */}
          <button
            type="button"
            onClick={publishChanges}
            disabled={publishStatus === 'saving' || !hasUnsavedChanges}
            className="bg-[#E69D2B] text-[#0B0F17] font-bold px-4 py-1.5 rounded-xl text-xs hover:bg-amber-400 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95"
          >
            {publishStatus === 'saving' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0B0F17]" />
                <span className="hidden sm:inline">Publishing...</span>
              </>
            ) : publishStatus === 'published' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#0B0F17] stroke-[3]" />
                <span className="hidden sm:inline">Published Live</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#0B0F17]" />
                <span className="hidden sm:inline">Save &amp; Publish</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. MAIN 4-ZONE STAGE: ZONE B (CENTER STAGE) + ZONE C (RIGHT DRAWER)   */}
      {/* ===================================================================== */}
      <div className="flex-1 min-h-0 w-full flex overflow-hidden relative">
        {/* =================================================================== */}
        {/* ZONE B: CENTER STAGE (SCALED TRUE-DESKTOP PREVIEW CANVAS)            */}
        {/* =================================================================== */}
        <div
          ref={stageRef}
          className="flex-1 h-full min-h-0 flex flex-col relative overflow-hidden bg-[#070A10]"
        >
          {/* Top Browser Chrome Bar */}
          <div className="h-10 px-4 bg-[#0E131F] border-b border-white/10 flex items-center justify-between gap-3 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 inline-block" />
              </div>
              <div className="h-4 w-[1px] bg-white/10 mx-1" />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#131926] border border-white/5 text-[11px] font-mono text-[#94A3B8]">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-white/60">saharastaffing.com</span>
                <span className="text-[#E69D2B] font-semibold">
                  {activePageTab === 'home' ? '/preview' : `/preview/${activePageTab}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRefreshing(true);
                  setPreviewKey((k) => k + 1);
                  setTimeout(() => setIsRefreshing(false), 400);
                }}
                className="p-1 rounded hover:bg-white/5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title="Reload Preview Canvas"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#E69D2B]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SYNCHRONIZED</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 hidden md:inline">
                {viewportMode === 'desktop'
                  ? `Scale: ${Math.round(desktopScale * 100)}% (1440px True Canvas)`
                  : '375px Mobile Frame'}
              </span>
            </div>
          </div>

          {/* Independent Vertical Scroll Viewport */}
          <div
            ref={previewScrollRef}
            data-lenis-prevent
            className="flex-1 h-full overflow-y-auto overflow-x-hidden overscroll-contain relative custom-scrollbar p-3 sm:p-5"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E69D2B #131926' }}
          >
            <CMSPreviewProvider content={draftContent} settings={settings} key={previewKey}>
              {viewportMode === 'desktop' ? (
                /* SCALED TRUE-DESKTOP PREVIEW (1440px True Dimensions) */
                <div
                  className="mx-auto relative"
                  style={{
                    width: `${1440 * desktopScale}px`,
                    height: contentHeight > 0 ? `${contentHeight * desktopScale + 80}px` : 'auto',
                    minHeight: '100%',
                  }}
                >
                  <div
                    ref={contentRef}
                    style={{
                      width: '1440px',
                      transform: `scale(${desktopScale})`,
                      transformOrigin: 'top left',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#0B0F17',
                    }}
                  >
                    {renderPreviewContent()}
                  </div>
                </div>
              ) : (
                /* AUTHENTIC 375PX MOBILE PHONE CHASSIS */
                <div className="py-6 px-4 flex justify-center items-start min-h-full">
                  <div className="w-[390px] h-[812px] max-h-[calc(100vh-170px)] mx-auto rounded-[48px] border-[10px] border-[#1E293B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] bg-[#0B0F17] relative flex flex-col overflow-hidden">
                    <div className="absolute top-2.5 inset-x-0 z-30 flex justify-center pointer-events-none">
                      <div className="w-24 h-4 bg-[#0B0F17] border border-white/10 rounded-full flex items-center justify-center gap-1.5 shadow-md">
                        <div className="w-2 h-2 rounded-full bg-[#1E293B]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#131926] border border-white/5" />
                      </div>
                    </div>
                    <div className="w-full h-full flex-1 pt-1 pb-1">
                      <MobilePreviewIframe>
                        <CMSPreviewProvider content={draftContent} settings={settings}>
                          {renderPreviewContent()}
                        </CMSPreviewProvider>
                      </MobilePreviewIframe>
                    </div>
                    <div className="absolute bottom-1.5 inset-x-0 z-30 flex justify-center pointer-events-none">
                      <div className="w-32 h-1 bg-white/30 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </CMSPreviewProvider>
          </div>

          {/* ================================================================= */}
          {/* ZONE D: BOTTOM FLOATING SECTION PILLS BAR                          */}
          {/* ================================================================= */}
          <div className="absolute bottom-4 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
            <div className="pointer-events-auto bg-[#0E131F]/90 backdrop-blur-xl border border-white/15 rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-1.5 max-w-[95vw] overflow-x-auto no-scrollbar">
              {(SECTION_PILLS[activePageTab] || []).map((pill) => {
                const isCurrent = activeBlock === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handlePillClick(pill)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isCurrent
                        ? 'bg-[#E69D2B] text-[#0B0F17] font-bold shadow-md'
                        : 'text-[#94A3B8] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className={`text-[10px] ${isCurrent ? 'text-[#0B0F17]' : 'text-[#E69D2B]'}`}>
                      {pill.num}
                    </span>
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* ZONE C: DOCKED RIGHT SECTION BLOCK EDITOR DRAWER                    */}
        {/* =================================================================== */}
        <aside
          data-lenis-prevent
          className={`${
            isDrawerOpen ? 'w-full sm:w-[380px] lg:w-[410px]' : 'w-0 hidden'
          } shrink-0 h-full bg-[#0B0F17] border-l border-white/10 flex flex-col z-20 transition-all duration-300 relative`}
        >
          {/* Drawer Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0E131F]/90">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E69D2B] animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-[#E69D2B] uppercase tracking-wider font-semibold block">
                  Section Block Editor
                </span>
                <h2 className="text-xs font-bold text-white font-sans capitalize">
                  {activePageTab} Page ({getBlocksForPage(activePageTab).length} Blocks)
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={expandAllBlocks}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer font-mono"
                title="Expand all section blocks"
              >
                Expand
              </button>
              <button
                type="button"
                onClick={collapseAllBlocks}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer font-mono"
                title="Collapse all section blocks"
              >
                Collapse
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Hide Editor Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Quick Section Switcher */}
          <div className="px-5 pt-3 pb-2 border-b border-white/5 bg-[#0B0F17]/60 shrink-0">
            <label className="text-[9.5px] font-mono text-[#64748B] uppercase tracking-wider mb-1 block">
                  Quick Switch Block:
                </label>
                <select
                  value={activeBlock}
                  onChange={(e) => {
                    const val = e.target.value;
                    setActiveBlock(val);
                    setExpandedBlocks((prev) => new Set(prev).add(val));
                    if (val.startsWith('home-')) setActivePageTab('home');
                    else if (val.startsWith('about-')) setActivePageTab('about');
                    else if (val.startsWith('services-')) setActivePageTab('services');
                    else if (val.startsWith('contact-')) setActivePageTab('contact');
                    else if (val === 'global-settings') setActivePageTab('settings');
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#131926] border border-white/10 text-white text-xs font-sans focus:border-[#E69D2B] focus:outline-none cursor-pointer"
                >
                  <optgroup label="Home Page">
                    <option value="home-block-01">Block 01: Hero Section</option>
                    <option value="home-block-02">Block 02: Partners &amp; Metrics Strip</option>
                    <option value="home-block-03">Block 03: Bento Solutions Grid</option>
                    <option value="home-block-04">Block 04: Kinetic Vetting Pipeline</option>
                    <option value="home-block-05">Block 05: Executive Hiring Estimator</option>
                    <option value="home-block-06">Block 06: Testimonials Carousel</option>
                    <option value="home-block-07">Block 07: Frequently Asked Questions</option>
                    <option value="home-block-08">Block 08: Bottom CTA &amp; Footer</option>
                  </optgroup>
                  <optgroup label="About Page">
                    <option value="about-block-01">Block 01: About Hero Section</option>
                    <option value="about-block-02">Block 02: Operating Benchmarks</option>
                    <option value="about-block-03">Block 03: Discipline Matrix</option>
                    <option value="about-block-04">Block 04: Leadership Council</option>
                    <option value="about-block-05">Block 05: Hard Scale Stats</option>
                    <option value="about-block-06">Block 06: Final CTA</option>
                  </optgroup>
                  <optgroup label="Services Page">
                    <option value="services-block-01">Block 01: Services Hero Section</option>
                    <option value="services-block-02">Block 02: Service Capabilities Grid</option>
                    <option value="services-block-03">Block 03: Vetting Process</option>
                    <option value="services-block-04">Block 04: Engagement Models</option>
                    <option value="services-block-05">Block 05: SLA Guarantee</option>
                  </optgroup>
                  <optgroup label="Contact Page">
                    <option value="contact-block-01">Block 01: Contact Form &amp; Intake</option>
                  </optgroup>
                  <optgroup label="Global Settings">
                    <option value="global-settings">Global Site Utilities &amp; Cursor</option>
                  </optgroup>
                </select>
              </div>

              {/* Drawer Body: Form Inputs for all blocks */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">


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
                  {isBlockExpanded('home-block-01') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-01') && (
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
                  {isBlockExpanded('home-block-02') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-02') && (
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
                  {isBlockExpanded('home-block-03') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-03') && (
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
                  {isBlockExpanded('home-block-04') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-04') && (
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
                  {isBlockExpanded('home-block-05') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-05') && (
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
                  {isBlockExpanded('home-block-06') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-06') && (
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
                  {isBlockExpanded('home-block-07') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-07') && (
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
                  {isBlockExpanded('home-block-08') ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </button>

                {isBlockExpanded('home-block-08') && (
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
                  {isBlockExpanded('about-block-01') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-01') && (
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
                  {isBlockExpanded('about-block-02') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-02') && (
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
              <div id="editor-about-block-03" className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg scroll-mt-4">
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
                  {isBlockExpanded('about-block-03') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-03') && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-xs">
                    {/* Block 03 Layout Switcher Engine */}
                    <div className="p-3 rounded-xl bg-[#131926] border border-[#1E293B] space-y-2">
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase font-mono">
                        Mindset Narrative Layout Engine
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-[#0B0F17] p-1 rounded-lg border border-white/10">
                        <button
                          type="button"
                          onClick={() => updateDraft('about.chaptersLayout', 'sticky')}
                          className={`px-2 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            (draftContent.about?.chaptersLayout || 'sticky') === 'sticky'
                              ? 'bg-[#E69D2B] text-[#0B0F17] font-bold shadow'
                              : 'text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          <span>⚡ Sticky Hijack</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDraft('about.chaptersLayout', 'grid')}
                          className={`px-2 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            draftContent.about?.chaptersLayout === 'grid'
                              ? 'bg-[#E69D2B] text-[#0B0F17] font-bold shadow'
                              : 'text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          <span>📇 Static Cards</span>
                        </button>
                      </div>
                    </div>

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
                          title: `${ch.badge} (${ch.tag}) Imagery`,
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
              <div id="editor-about-block-04" className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg scroll-mt-4">
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
                  {isBlockExpanded('about-block-04') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-04') && (
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
                          title: `${lead.name} Headshot Portrait`,
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
              <div id="editor-about-block-05" className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg scroll-mt-4">
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
                  {isBlockExpanded('about-block-05') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-05') && (
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
              <div id="editor-about-block-06" className="bg-[#1E293B]/60 rounded-2xl p-5 mb-4 border-0 shadow-lg scroll-mt-4">
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
                  {isBlockExpanded('about-block-06') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('about-block-06') && (
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
                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] uppercase mb-1 font-mono">Closing Subtitle</label>
                      <textarea
                        rows={2}
                        value={draftContent.about?.finalCta?.subtitle || "Tell us about your business and your hiring needs. Let's start a conversation."}
                        onChange={(e) => updateDraft('about.finalCta', { ...draftContent.about?.finalCta, subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white"
                      />
                    </div>
                    {renderImageDropzone({
                      title: 'Final CTA Background Image Override',
                      currentValue: draftContent.about?.finalCta?.backgroundImage || '/assets/card1-staffing.jpg',
                      defaultValue: '/assets/card1-staffing.jpg',
                      fieldKey: 'about-final-cta-bg',
                      onReset: () => {
                        updateDraft('about.finalCta', {
                          ...draftContent.about?.finalCta,
                          backgroundImage: '/assets/card1-staffing.jpg',
                        });
                      },
                      onUpdate: (newUrl) => {
                        updateDraft('about.finalCta', {
                          ...draftContent.about?.finalCta,
                          backgroundImage: newUrl,
                        });
                      },
                    })}
                    {renderStrictButtonManager({
                      buttons: draftContent.about?.finalCta?.buttons || [],
                      sectionName: 'About Closing CTA',
                      onAdd: () => {
                        const current = draftContent.about?.finalCta?.buttons || [];
                        if (current.length >= 2) return;
                        updateDraft('about.finalCta', {
                          ...draftContent.about?.finalCta,
                          buttons: [...current, { id: 'cta-' + Date.now(), enabled: true, label: 'Discuss Your Hiring Needs →', destination: '/contact', variant: 'primary' }],
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
                  {isBlockExpanded('services-block-01') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-01') && (
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
                  {isBlockExpanded('services-block-02') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-02') && (
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
                  {isBlockExpanded('services-block-03') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-03') && (
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
                  {isBlockExpanded('services-block-04') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-04') && (
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
                  {isBlockExpanded('services-block-05') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('services-block-05') && (
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
                  {isBlockExpanded('contact-block-01') ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                </button>

                {isBlockExpanded('contact-block-01') && (
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

              {/* Utility Toggle 3: Sticky Navbar */}
              <div className="p-4 rounded-xl bg-[#0B0F17]/80 flex items-start justify-between gap-4 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E69D2B]" />
                    <span className="text-xs font-bold text-white font-sans">
                      Sticky Navigation Bar
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    Fixes the glassmorphic navbar to the top during scroll. Non-sticky by default.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ stickyNavbar: !settings.stickyNavbar })}
                  className="cursor-pointer text-[#E69D2B] mt-1 shrink-0 transition-transform active:scale-95"
                  title="Toggle sticky navigation bar"
                >
                  {settings.stickyNavbar ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-[#64748B]" />
                  )}
                </button>
              </div>
            </div>
          )}

              </div>

          {/* Drawer Footer Actions */}
          <div className="p-3.5 border-t border-white/10 bg-[#0E131F]/90 shrink-0 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="text-xs text-[#94A3B8] hover:text-white py-1.5 px-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
            >
              Hide Panel
            </button>
            <button
              type="button"
              onClick={publishChanges}
              disabled={publishStatus === 'saving' || !hasUnsavedChanges}
              className="bg-[#E69D2B] text-[#0B0F17] font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-400 transition-all shadow-md disabled:opacity-50 cursor-pointer select-none active:scale-95 flex items-center gap-1.5"
            >
              {publishStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save &amp; Publish Changes</span>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
