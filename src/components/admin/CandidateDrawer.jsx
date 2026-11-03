import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Mail,
  Phone,
  Linkedin,
  Download,
  Calendar,
  Save,
  Check,
  Loader2,
  ExternalLink,
  Eye,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { CandidateService } from '../../lib/supabase';

const STATUS_OPTIONS = ['New', 'Under Review', 'Shortlisted', 'Placed', 'Archived'];

export default function CandidateDrawer({
  candidate,
  isOpen,
  initialOpenCv = false,
  onClose,
  onCandidateUpdated,
}) {
  const [currentStatus, setCurrentStatus] = useState(candidate?.status || 'New');
  const [notes, setNotes] = useState(candidate?.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Full-size CV Viewer Modal State
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (candidate) {
      setCurrentStatus(candidate.status || 'New');
      setNotes(candidate.notes || '');
      setNotesSavedSuccess(false);
    }
  }, [candidate]);

  useEffect(() => {
    if (isOpen) {
      setIsCvModalOpen(Boolean(initialOpenCv));
      setIsMaximized(false);
    } else {
      setIsCvModalOpen(false);
      setIsMaximized(false);
    }
  }, [isOpen, initialOpenCv]);

  // Handle ESC key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (isCvModalOpen) {
          setIsCvModalOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCvModalOpen, onClose]);

  if (!isOpen || !candidate) return null;

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true);
    setCurrentStatus(newStatus);
    try {
      const updated = await CandidateService.updateStatus(candidate.id, newStatus);
      if (onCandidateUpdated) onCandidateUpdated(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handle saving internal admin notes
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const updated = await CandidateService.updateNotes(candidate.id, notes);
      if (onCandidateUpdated) onCandidateUpdated(updated);
      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 2600);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const isPdf =
    candidate.resume_name?.toLowerCase().endsWith('.pdf') ||
    candidate.resume_type === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (isCvModalOpen) {
            setIsCvModalOpen(false);
          } else {
            onClose();
          }
        }}
      />

      {/* ===================================================================== */}
      {/* 1. FULL-SIZE EXPANDED CV MODAL (OCCUPIES LEFT SECTION WITH FULL HEIGHT) */}
      {/* ===================================================================== */}
      {isCvModalOpen && (
        <div
          className={`fixed inset-y-0 z-50 flex flex-col bg-[#0B0F17] text-white shadow-2xl border-r border-[#1E293B] transition-all duration-300 ${
            isMaximized ? 'inset-0' : 'left-0 right-0 lg:right-[580px]'
          }`}
        >
          {/* Top Control Bar */}
          <div className="px-5 py-3.5 bg-[#080B12] border-b border-[#1E293B] flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-xs font-bold text-[#E69D2B] px-2 py-0.5 rounded bg-[#E69D2B]/10 border border-[#E69D2B]/20 flex-shrink-0">
                {candidate.tracking_id}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">
                    {candidate.full_name}
                  </h3>
                  <span className="text-xs text-[#94A3B8] font-normal truncate hidden sm:inline">
                    &middot; Resume Profile
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] font-mono truncate">
                  {candidate.resume_name || 'Resume.pdf'} &bull; {candidate.target_discipline}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {candidate.resume_data_url && (
                <>
                  <a
                    href={candidate.resume_data_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-[#131926] hover:bg-[#1E293B] border border-[#1E293B] text-[#CBD5E1] hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Open document in new browser tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#E69D2B]" />
                    <span className="hidden md:inline">Open in Tab</span>
                  </a>

                  <a
                    href={candidate.resume_data_url}
                    download={candidate.resume_name || `${candidate.full_name}_Resume.pdf`}
                    className="px-2.5 py-1.5 rounded-lg bg-[#131926] hover:bg-[#1E293B] border border-[#1E293B] text-[#CBD5E1] hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Download document file"
                  >
                    <Download className="w-3.5 h-3.5 text-[#E69D2B]" />
                    <span className="hidden md:inline">Download</span>
                  </a>
                </>
              )}

              {/* Fullscreen / Dock Toggle (desktop only) */}
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="hidden lg:flex px-2.5 py-1.5 rounded-lg bg-[#131926] hover:bg-[#1E293B] border border-[#1E293B] text-[#CBD5E1] hover:text-white transition-colors text-xs items-center gap-1.5 cursor-pointer"
                title={isMaximized ? 'Dock to left section' : 'Expand full screen'}
              >
                {isMaximized ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Dock to Side</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Full Screen</span>
                  </>
                )}
              </button>

              {/* Close CV Modal */}
              <button
                type="button"
                onClick={() => setIsCvModalOpen(false)}
                className="px-2.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-white/[0.12] text-white border border-[#334155] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Close CV viewer modal"
                title="Close CV"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Full-Height Scrollable CV Body */}
          <div className="flex-1 w-full h-full bg-[#0E131F] relative overflow-hidden flex flex-col">
            {candidate.resume_data_url ? (
              isPdf ? (
                <iframe
                  src={`${candidate.resume_data_url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  title={`${candidate.full_name} Resume`}
                  className="w-full h-full border-0 bg-[#1E293B]"
                />
              ) : (
                /* DOCX or alternative format */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0B0F17]">
                  <div className="max-w-md space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#131926] border border-[#1E293B] flex items-center justify-center mx-auto text-[#E69D2B]">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{candidate.resume_name}</h4>
                      <p className="text-xs text-[#94A3B8] mt-1 font-mono">
                        Word Document (.docx) &bull;{' '}
                        {candidate.resume_size
                          ? `${(candidate.resume_size / 1024 / 1024).toFixed(2)} MB`
                          : 'Ready for Review'}
                      </p>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Word documents are formatted for local office applications. Click below to
                      download and review the complete Profile file.
                    </p>
                    <div className="pt-2">
                      <a
                        href={candidate.resume_data_url}
                        download={candidate.resume_name}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] font-semibold text-xs shadow-md transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Word Document</span>
                      </a>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-[#94A3B8]">
                <div className="space-y-2">
                  <FileText className="w-8 h-8 text-[#64748B] mx-auto opacity-50" />
                  <p className="text-sm font-medium text-white">No Resume Document File</p>
                  <p className="text-xs text-[#64748B]">
                    This applicant submitted their profile without an attached digital document.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. CANDIDATE PROFILE SLIDE-OVER DRAWER (RIGHT PANEL)                  */}
      {/* ===================================================================== */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-[580px] bg-[#0E131F] border-l border-[#1E293B]/80 text-white flex flex-col shadow-2xl">
          {/* Drawer Top Header (Unboxed, Clean Text) */}
          <div className="px-6 py-5 bg-[#0B0F17] border-b border-[#1E293B]/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-[#E69D2B]">
                {candidate.tracking_id}
              </span>
              {candidate.is_demo && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                  [Demo]
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              aria-label="Close Profile drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-7 custom-scrollbar">
            {/* Candidate Identity Block */}
            <div className="space-y-3 pb-6 border-b border-[#1E293B]/60">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {candidate.full_name}
                  </h2>
                  <p className="text-xs text-[#E69D2B] font-medium mt-1">
                    {candidate.target_discipline}
                  </p>
                </div>

                {/* Inline Restrained Status Selector */}
                <div className="relative">
                  <select
                    value={currentStatus}
                    disabled={statusUpdating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-xs font-medium py-1 pl-2 pr-6 bg-[#131926] border border-[#1E293B] rounded text-white appearance-none focus:outline-none focus:border-[#E69D2B] cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-[#0E131F]">
                        {st}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#94A3B8]">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Direct Unboxed Contact Links */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
                <a
                  href={`mailto:${candidate.email}`}
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E69D2B]" />
                  <span>{candidate.email}</span>
                </a>

                {candidate.phone && (
                  <a
                    href={`tel:${candidate.phone}`}
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E69D2B]" />
                    <span>{candidate.phone}</span>
                  </a>
                )}

                {candidate.linkedin_url && (
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#E69D2B]" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}
              </div>
            </div>

            {/* Career Summary & Salary Targets */}
            {candidate.career_summary && (
              <div className="space-y-2 pb-6 border-b border-[#1E293B]/60">
                <div className="text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Career Summary &amp; Salary Targets
                </div>
                <div className="p-3.5 rounded-lg bg-[#0B0F17] text-xs text-[#CBD5E1] leading-relaxed whitespace-pre-wrap border border-[#1E293B]/40">
                  {candidate.career_summary}
                </div>
              </div>
            )}

            {/* Resume Profile Card (Cramped iframe removed, replaced by clean View CV trigger) */}
            <div className="space-y-3 pb-6 border-b border-[#1E293B]/60">
              <div className="flex items-center justify-between">
                <div className="text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Resume Profile
                </div>
                {candidate.resume_data_url && (
                  <a
                    href={candidate.resume_data_url}
                    download={candidate.resume_name || `${candidate.full_name}_Resume.pdf`}
                    className="inline-flex items-center gap-1 text-xs text-[#E69D2B] hover:underline cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}
              </div>

              {candidate.resume_name || candidate.resume_data_url ? (
                <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-lg bg-[#131926] border border-[#1E293B]/60 text-[#E69D2B] flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">
                        {candidate.resume_name || 'Candidate_Resume.pdf'}
                      </p>
                      <p className="text-[10.5px] text-[#94A3B8] font-mono mt-0.5">
                        {candidate.resume_size
                          ? `${(candidate.resume_size / 1024 / 1024).toFixed(2)} MB • `
                          : ''}
                        {isPdf ? 'PDF Document' : 'Word Document'}
                      </p>
                    </div>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCvModalOpen(true)}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View CV</span>
                    </button>

                    {candidate.resume_data_url && (
                      <a
                        href={candidate.resume_data_url}
                        download={candidate.resume_name || `${candidate.full_name}_Resume.pdf`}
                        className="py-2.5 px-3 rounded-lg bg-[#131926] hover:bg-[#1E293B] border border-[#1E293B] text-[#CBD5E1] hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Download resume document"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]/60 text-center py-6">
                  <FileText className="w-6 h-6 text-[#64748B] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#94A3B8]">No resume attached to this application</p>
                </div>
              )}
            </div>

            {/* Internal Admin Notes Section */}
            <div className="space-y-3 pb-6 border-b border-[#1E293B]/60">
              <div className="flex items-center justify-between">
                <div className="text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Internal Admin Notes
                </div>
                <div className="text-[10.5px] text-[#64748B]">Private to Recruitment Squad</div>
              </div>

              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add confidential candidate notes, compensation range, or interview observations..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F17] border border-[#1E293B] text-white text-xs placeholder-[#64748B] focus:border-[#E69D2B] focus:outline-none transition-colors"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#94A3B8]">
                  {notesSavedSuccess ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#64748B]">Edits kept in draft</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSavingNotes ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                  <span>Save Notes</span>
                </button>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="text-[11px] text-[#64748B] space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted: {new Date(candidate.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span>Privacy Consent: Recorded at Intake</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
