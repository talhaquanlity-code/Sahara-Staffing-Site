import React, { useState } from 'react';
import {
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export default function CMSWorkspace() {
  const {
    draftContent,
    content: publishedContent,
    updateDraft,
    publishChanges,
    discardDraft,
    hasUnsavedChanges,
    publishStatus,
  } = useCMS();

  // Active accordion section: 'hero' | 'services' | 'vetting' | 'faqs' | 'testimonials'
  const [activeAccordion, setActiveAccordion] = useState('hero');

  // Confirm delete modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // HERO HANDLERS
  const handleHeroChange = (field, value) => {
    updateDraft('hero', { ...draftContent.hero, [field]: value });
  };

  // SERVICES HANDLERS
  const handleServiceChange = (index, field, value) => {
    const updated = [...draftContent.services];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft('services', updated);
  };

  const handleAddService = () => {
    const newService = {
      id: 'srv_' + Date.now(),
      title: 'New Specialized Staffing Practice',
      category: 'Specialized Practice',
      description: 'Describe this staffing practice and engagement framework here.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      badge: 'Bespoke Advisory',
    };
    updateDraft('services', [...draftContent.services, newService]);
  };

  const handleDeleteService = (index) => {
    const updated = draftContent.services.filter((_, i) => i !== index);
    updateDraft('services', updated);
    setDeleteConfirmation(null);
  };

  // VETTING STAGES HANDLERS
  const handleVettingChange = (index, field, value) => {
    const updated = [...draftContent.vettingStages];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft('vettingStages', updated);
  };

  // FAQS HANDLERS
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

  // TESTIMONIALS HANDLERS
  const handleTestimonialChange = (index, field, value) => {
    const updated = [...draftContent.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft('testimonials', updated);
  };

  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: 'test_' + Date.now(),
      author: 'Executive Name, Title at Organization',
      quote: '“Verified placement perspective detailing the efficiency and caliber of Sahara Staffing Inc.”',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      isSampleDraft: true,
    };
    updateDraft('testimonials', [...draftContent.testimonials, newTestimonial]);
  };

  const handleDeleteTestimonial = (index) => {
    const updated = draftContent.testimonials.filter((_, i) => i !== index);
    updateDraft('testimonials', updated);
    setDeleteConfirmation(null);
  };

  return (
    <div className="space-y-8">
      {/* Workspace Header: Clean Editorial Hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1E293B]/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Site Content CMS &amp; Live Customizer
            </h1>
            <span className="text-[10.5px] font-mono tracking-wider uppercase text-[#64748B]">
              {hasUnsavedChanges ? (
                <span className="text-[#E69D2B]">[Draft Changes Pending]</span>
              ) : (
                <span className="text-emerald-400">[Synchronized With Site]</span>
              )}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage approved website copy, core service practices, vetting stages, and FAQ content.
          </p>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={discardDraft}
              className="text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer py-1.5 px-2"
            >
              Discard Changes
            </button>
          )}

          <button
            type="button"
            onClick={publishChanges}
            disabled={publishStatus === 'saving' || !hasUnsavedChanges}
            className="px-5 py-2 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishStatus === 'saving' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : publishStatus === 'published' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Published</span>
              </>
            ) : (
              <span>Save &amp; Publish Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Sections (7 Cols) */}
        <div className="lg:col-span-7 divide-y divide-[#1E293B]/60">
          {/* SECTION 1: HERO COPY & CTAS */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === 'hero' ? '' : 'hero')}
              className="w-full flex items-center justify-between text-left py-2 hover:text-[#E69D2B] transition-colors cursor-pointer group"
            >
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#E69D2B] transition-colors">
                  01. Hero Copy &amp; Primary CTAs
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Main homepage headline, kicker phrase, and button labels
                </p>
              </div>
              {activeAccordion === 'hero' ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>

            {activeAccordion === 'hero' && (
              <div className="pt-4 pb-2 space-y-4 text-xs">
                <div>
                  <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Kicker / Eyebrow Text
                  </label>
                  <input
                    type="text"
                    value={draftContent.hero.kicker}
                    onChange={(e) => handleHeroChange('kicker', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={draftContent.hero.headline}
                    onChange={(e) => handleHeroChange('headline', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Gold Highlight Word / Phrase
                  </label>
                  <input
                    type="text"
                    value={draftContent.hero.highlightWord}
                    onChange={(e) => handleHeroChange('highlightWord', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-[#E69D2B] font-medium focus:border-[#E69D2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Supporting Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.hero.subtitle}
                    onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                      Primary CTA Label
                    </label>
                    <input
                      type="text"
                      value={draftContent.hero.primaryCtaLabel}
                      onChange={(e) => handleHeroChange('primaryCtaLabel', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                      Secondary CTA Label
                    </label>
                    <input
                      type="text"
                      value={draftContent.hero.secondaryCtaLabel}
                      onChange={(e) => handleHeroChange('secondaryCtaLabel', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: SERVICES CONTENT */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === 'services' ? '' : 'services')}
              className="w-full flex items-center justify-between text-left py-2 hover:text-[#E69D2B] transition-colors cursor-pointer group"
            >
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#E69D2B] transition-colors">
                  02. Core Staffing Practices
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  {draftContent.services.length} active service chapters
                </p>
              </div>
              {activeAccordion === 'services' ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>

            {activeAccordion === 'services' && (
              <div className="pt-4 pb-2 space-y-4 text-xs">
                {draftContent.services.map((service, idx) => (
                  <div
                    key={service.id || idx}
                    className="p-3.5 rounded-lg bg-[#131926] border border-[#1E293B]/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-medium text-[#E69D2B]">
                        Practice 0{idx + 1}
                      </span>
                      {draftContent.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmation({ type: 'service', index: idx })}
                          className="text-[#64748B] hover:text-red-400 p-1 cursor-pointer"
                          title="Delete service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1 uppercase">
                          Practice Title
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1 uppercase">
                          Category Label
                        </label>
                        <input
                          type="text"
                          value={service.category}
                          onChange={(e) => handleServiceChange(idx, 'category', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1 uppercase">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={service.description}
                        onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddService}
                  className="w-full py-2 border border-dashed border-[#1E293B] hover:border-[#E69D2B] text-[#94A3B8] hover:text-white text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Practice</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: 5-STAGE VETTING */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === 'vetting' ? '' : 'vetting')}
              className="w-full flex items-center justify-between text-left py-2 hover:text-[#E69D2B] transition-colors cursor-pointer group"
            >
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#E69D2B] transition-colors">
                  03. Five-Stage Vetting Milestones
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Editorial titles and descriptions for the vetting framework
                </p>
              </div>
              {activeAccordion === 'vetting' ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>

            {activeAccordion === 'vetting' && (
              <div className="pt-4 pb-2 space-y-3 text-xs">
                {draftContent.vettingStages.map((stage, idx) => (
                  <div
                    key={stage.id || idx}
                    className="p-3 rounded-lg bg-[#131926] border border-[#1E293B]/60 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#E69D2B] text-xs">
                        {stage.order}
                      </span>
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) => handleVettingChange(idx, 'name', e.target.value)}
                        className="px-2 py-1 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium text-xs focus:border-[#E69D2B] focus:outline-none"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={stage.description}
                      onChange={(e) => handleVettingChange(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white text-xs focus:border-[#E69D2B] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: FAQS */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === 'faqs' ? '' : 'faqs')}
              className="w-full flex items-center justify-between text-left py-2 hover:text-[#E69D2B] transition-colors cursor-pointer group"
            >
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#E69D2B] transition-colors">
                  04. Frequently Asked Questions
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  {draftContent.faqs.length} questions and answers
                </p>
              </div>
              {activeAccordion === 'faqs' ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>

            {activeAccordion === 'faqs' && (
              <div className="pt-4 pb-2 space-y-3 text-xs">
                {draftContent.faqs.map((faq, idx) => (
                  <div
                    key={faq.id || idx}
                    className="p-3 rounded-lg bg-[#131926] border border-[#1E293B]/60 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                        placeholder="Question..."
                        className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-white font-medium text-xs focus:border-[#E69D2B] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmation({ type: 'faq', index: idx })}
                        className="text-[#64748B] hover:text-red-400 p-1 flex-shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                      placeholder="Answer..."
                      className="w-full px-2.5 py-1.5 rounded bg-[#0E131F] border border-[#1E293B] text-[#CBD5E1] text-xs focus:border-[#E69D2B] focus:outline-none"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="w-full py-2 border border-dashed border-[#1E293B] hover:border-[#E69D2B] text-[#94A3B8] hover:text-white text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ Item</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Preview Viewport (5 Cols, Unboxed) */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]/60">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[#E69D2B]" />
              <span className="text-xs font-semibold text-white">Live Site Preview</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              {hasUnsavedChanges ? 'Draft' : 'Synchronized'}
            </span>
          </div>

          {/* Natural Preview Canvas */}
          <div className="p-4 bg-[#080B12] rounded-xl border border-[#1E293B]/60 space-y-5 text-xs max-h-[580px] overflow-y-auto custom-scrollbar">
            {/* Hero Copy Preview */}
            <div className="space-y-2 pb-4 border-b border-white/[0.06]">
              <div className="text-[10px] uppercase tracking-wider text-[#E69D2B] font-mono">
                {draftContent.hero.kicker}
              </div>
              <div className="text-sm font-bold text-white leading-snug">
                {draftContent.hero.headline}
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {draftContent.hero.subtitle}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-[#E69D2B] text-[#0B0F17] font-semibold text-[10.5px]">
                  {draftContent.hero.primaryCtaLabel}
                </span>
                <span className="px-3 py-1 rounded border border-white/20 text-white text-[10.5px]">
                  {draftContent.hero.secondaryCtaLabel}
                </span>
              </div>
            </div>

            {/* Services Preview */}
            <div className="space-y-2 pb-4 border-b border-white/[0.06]">
              <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                Services ({draftContent.services.length})
              </div>
              {draftContent.services.slice(0, 3).map((s, i) => (
                <div key={i} className="flex justify-between items-baseline py-1">
                  <span className="text-white font-medium truncate max-w-[220px]">{s.title}</span>
                  <span className="text-[10px] font-mono text-[#E69D2B]">0{i + 1}</span>
                </div>
              ))}
            </div>

            {/* Vetting Milestones Preview */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                5-Stage Framework
              </div>
              <div className="grid grid-cols-5 gap-1 text-center">
                {draftContent.vettingStages.map((st, i) => (
                  <div key={i} className="py-1 px-0.5 rounded bg-white/[0.03] text-[9.5px]">
                    <div className="font-mono text-[#E69D2B] font-semibold">{st.order}</div>
                    <div className="text-white truncate mt-0.5">{st.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-[#0E131F] border border-[#1E293B] p-6 text-white space-y-4">
            <h4 className="text-sm font-bold text-white">Confirm Removal</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Are you sure you want to remove this entry? This change will be applied once you publish your changes.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-3 py-1.5 text-xs text-[#94A3B8] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmation.type === 'service') {
                    handleDeleteService(deleteConfirmation.index);
                  } else if (deleteConfirmation.type === 'faq') {
                    handleDeleteFaq(deleteConfirmation.index);
                  } else if (deleteConfirmation.type === 'testimonial') {
                    handleDeleteTestimonial(deleteConfirmation.index);
                  }
                }}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium text-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
