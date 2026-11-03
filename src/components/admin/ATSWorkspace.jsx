import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  ArrowRight,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
  Eye,
  FileText,
} from 'lucide-react';
import { CandidateService } from '../../lib/supabase';
import CandidateDrawer from './CandidateDrawer';

const STATUS_FILTERS = [
  'All Applicants',
  'New',
  'Under Review',
  'Shortlisted',
  'Placed',
  'Archived',
];

export default function ATSWorkspace({ candidates, onRefreshCandidates }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Applicants');
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCvImmediately, setOpenCvImmediately] = useState(false);

  // Layout View Mode: 'boxes' (default) | 'rows'
  const [viewMode, setViewMode] = useState('boxes');

  // Status Counts
  const statusCounts = useMemo(() => {
    const counts = {
      'All Applicants': candidates.length,
      New: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Placed: 0,
      Archived: 0,
    };
    candidates.forEach((c) => {
      if (counts[c.status] !== undefined) {
        counts[c.status]++;
      }
    });
    return counts;
  }, [candidates]);

  // Filtered & Searched Candidates
  const filteredCandidates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase().replace(/^#/, '');

    return candidates.filter((c) => {
      // 1. Status Filter
      if (selectedStatus !== 'All Applicants' && c.status !== selectedStatus) {
        return false;
      }

      // 2. Search Query (Name, Target Discipline, Tracking ID, Email)
      if (!query) return true;

      const trackingClean = (c.tracking_id || '').toLowerCase().replace(/^#/, '');
      const nameMatch = (c.full_name || '').toLowerCase().includes(query);
      const disciplineMatch = (c.target_discipline || '').toLowerCase().includes(query);
      const emailMatch = (c.email || '').toLowerCase().includes(query);
      const idMatch = trackingClean.includes(query);

      return nameMatch || disciplineMatch || idMatch || emailMatch;
    });
  }, [candidates, selectedStatus, searchQuery]);

  // Handle direct status change in row or card
  const handleQuickStatusChange = async (candidateId, newStatus) => {
    try {
      await CandidateService.updateStatus(candidateId, newStatus);
      if (onRefreshCandidates) onRefreshCandidates();
    } catch (err) {
      console.error('Quick status update failed:', err);
    }
  };

  const handleOpenDrawer = (candidate, openCv = false) => {
    setActiveCandidate(candidate);
    setOpenCvImmediately(openCv);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* ===================================================================== */}
      {/* 1. WORKSPACE HEADING & UNBOXED COMPACT METRICS ROW                    */}
      {/* ===================================================================== */}
      <div className="space-y-4 pb-2 border-b border-[#1E293B]/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Applicant Talent Portal
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Review candidate submissions and manage hiring pipelines.
            </p>
          </div>

          {/* Single Compact Summary Row: Unboxed Plain Text Hierarchy */}
          <div className="flex items-center gap-6 sm:gap-8 text-xs">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                Total
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {candidates.length}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                In Review
              </span>
              <span className="font-mono text-sm font-bold text-amber-400">
                {statusCounts['Under Review']}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                Shortlisted
              </span>
              <span className="font-mono text-sm font-bold text-[#E69D2B]">
                {statusCounts['Shortlisted']}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                Placed
              </span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {statusCounts['Placed']}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. SEARCH, VIEW MODE TOGGLE & TEXT-UNDERLINE STATUS FILTERS           */}
      {/* ===================================================================== */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Left: Search Input + Layout Switcher */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, discipline, or #SAH-1042..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs placeholder-[#64748B] focus:border-[#E69D2B] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Boxes (Default) vs Rows */}
          <div className="flex items-center gap-1 p-1 bg-[#131926] border border-[#1E293B] rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('boxes')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'boxes'
                  ? 'bg-[#E69D2B] text-[#0B0F17] font-semibold shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="Boxes View (Candidate cards with contact info and View CV)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Boxes</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('rows')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'rows'
                  ? 'bg-[#E69D2B] text-[#0B0F17] font-semibold shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="Rows View (High-density tabular list)"
            >
              <List className="w-3.5 h-3.5" />
              <span>Rows</span>
            </button>
          </div>
        </div>

        {/* Right: Status Filters */}
        <div className="flex items-center overflow-x-auto gap-6 border-b border-[#1E293B]/60 custom-scrollbar">
          {STATUS_FILTERS.map((st) => {
            const isActive = selectedStatus === st;
            const count = statusCounts[st] || 0;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`pb-2.5 text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold border-b-2 border-[#E69D2B]'
                    : 'text-[#94A3B8] hover:text-white border-b-2 border-transparent'
                }`}
              >
                <span>{st}</span>
                <span className="text-[10.5px] font-mono text-[#64748B]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. CANDIDATE PRESENTATION (BOXES VIEW vs. ROWS VIEW)                  */}
      {/* ===================================================================== */}
      {viewMode === 'boxes' ? (
        /* =================================================================== */
        /* LAYOUT 1: BOXES (CARDS GRID VIEW - DEFAULT)                         */
        /* =================================================================== */
        filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="rounded-xl bg-[#0E131F] border border-[#1E293B] hover:border-[#E69D2B]/50 transition-all p-5 flex flex-col justify-between space-y-4 group shadow-sm"
              >
                {/* Box Header: Tracking ID + Applied Date + Inline Status Dropdown */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#E69D2B]">
                      {candidate.tracking_id}
                    </span>

                    {/* Status Dropdown */}
                    <div
                      className="relative inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={candidate.status}
                        onChange={(e) => handleQuickStatusChange(candidate.id, e.target.value)}
                        className={`text-[11px] font-semibold py-1 pl-2 pr-6 bg-[#131926] border border-[#1E293B] rounded-md appearance-none cursor-pointer focus:outline-none focus:border-[#E69D2B] ${
                          candidate.status === 'New'
                            ? 'text-sky-400'
                            : candidate.status === 'Under Review'
                            ? 'text-amber-400'
                            : candidate.status === 'Shortlisted'
                            ? 'text-[#E69D2B]'
                            : candidate.status === 'Placed'
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {['New', 'Under Review', 'Shortlisted', 'Placed', 'Archived'].map((st) => (
                          <option key={st} value={st} className="bg-[#0E131F] text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#94A3B8]">
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Identity */}
                  <div
                    onClick={() => handleOpenDrawer(candidate, false)}
                    className="cursor-pointer space-y-1"
                  >
                    <h3 className="text-base font-bold text-white group-hover:text-[#E69D2B] transition-colors truncate">
                      {candidate.full_name}
                    </h3>
                    <p className="text-xs text-[#CBD5E1] font-medium truncate">
                      {candidate.target_discipline}
                    </p>
                    <p className="text-[10.5px] text-[#64748B] font-mono">
                      Applied:{' '}
                      {new Date(candidate.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Candidate Contact Info */}
                  <div className="pt-2 pb-1 border-t border-[#1E293B]/60 space-y-2 text-xs text-[#94A3B8]">
                    <a
                      href={`mailto:${candidate.email}`}
                      className="flex items-center gap-2 hover:text-white transition-colors truncate"
                      title={candidate.email}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-3.5 h-3.5 text-[#E69D2B] flex-shrink-0" />
                      <span className="truncate">{candidate.email}</span>
                    </a>

                    {candidate.phone && (
                      <a
                        href={`tel:${candidate.phone}`}
                        className="flex items-center gap-2 hover:text-white transition-colors truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E69D2B] flex-shrink-0" />
                        <span>{candidate.phone}</span>
                      </a>
                    )}

                    {candidate.linkedin_url && (
                      <a
                        href={candidate.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-white transition-colors truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="w-3.5 h-3.5 text-[#E69D2B] flex-shrink-0" />
                        <span className="truncate">LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                      </a>
                    )}
                  </div>

                  {/* Short Career Summary Snippet (if available) */}
                  {candidate.career_summary && (
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2 italic bg-[#0B0F17] p-2.5 rounded-lg border border-[#1E293B]/40">
                      &ldquo;{candidate.career_summary}&rdquo;
                    </p>
                  )}
                </div>

                {/* Box Footer: View CV Button & Profile Trigger */}
                <div className="pt-3 border-t border-[#1E293B]/60 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDrawer(candidate, true)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View CV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDrawer(candidate, false)}
                    className="py-2 px-3 rounded-lg bg-[#131926] hover:bg-[#1E293B] border border-[#1E293B] text-[#CBD5E1] hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Open Candidate Profile Drawer"
                  >
                    <span>Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[#94A3B8] border border-[#1E293B]/60 rounded-xl bg-[#0E131F]">
            <div className="max-w-xs mx-auto space-y-2">
              <Filter className="w-6 h-6 text-[#64748B] mx-auto opacity-50" />
              <div className="font-semibold text-white">No applicants found</div>
              <p className="text-xs text-[#64748B]">
                {searchQuery
                  ? `No applicants match "${searchQuery}". Clear your search query to see all candidates.`
                  : `No applicants currently under status "${selectedStatus}".`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs font-medium text-[#E69D2B] hover:underline cursor-pointer"
                >
                  Clear search filter
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        /* =================================================================== */
        /* LAYOUT 2: ROWS (TABULAR LIST VIEW)                                  */
        /* =================================================================== */
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] text-[#64748B] uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4 font-normal">Tracking ID</th>
                <th className="py-3 px-4 font-normal">Candidate Name</th>
                <th className="py-3 px-4 font-normal">Target Discipline</th>
                <th className="py-3 px-4 font-normal">Applied Date</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40 text-white">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    onClick={() => handleOpenDrawer(candidate, false)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    {/* 1. Tracking ID: Plain Sahara Gold Monospace Text */}
                    <td className="py-4 px-4 font-mono font-medium text-[#E69D2B] whitespace-nowrap">
                      {candidate.tracking_id}
                    </td>

                    {/* 2. Candidate Name & Subdued Email */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white group-hover:text-[#E69D2B] transition-colors">
                        {candidate.full_name}
                      </div>
                      <div className="text-[11px] text-[#64748B] truncate max-w-[200px]">
                        {candidate.email}
                      </div>
                    </td>

                    {/* 3. Target Role */}
                    <td className="py-4 px-4 whitespace-nowrap text-[#CBD5E1]">
                      {candidate.target_discipline}
                    </td>

                    {/* 4. Applied Date */}
                    <td className="py-4 px-4 text-[#94A3B8] whitespace-nowrap font-mono text-[11px]">
                      {new Date(candidate.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* 5. Status: Restrained Inline Dropdown Control */}
                    <td
                      className="py-4 px-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block">
                        <select
                          value={candidate.status}
                          onChange={(e) => handleQuickStatusChange(candidate.id, e.target.value)}
                          className={`text-xs font-medium py-1 pl-1 pr-6 bg-transparent border-0 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#E69D2B] rounded ${
                            candidate.status === 'New'
                              ? 'text-sky-400'
                              : candidate.status === 'Under Review'
                              ? 'text-amber-400'
                              : candidate.status === 'Shortlisted'
                              ? 'text-[#E69D2B]'
                              : candidate.status === 'Placed'
                              ? 'text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {['New', 'Under Review', 'Shortlisted', 'Placed', 'Archived'].map((st) => (
                            <option key={st} value={st} className="bg-[#0E131F] text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#64748B]">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </span>
                      </div>
                    </td>

                    {/* 6. Actions: Minimal Text Action "View CV →" */}
                    <td
                      className="py-4 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(candidate, true)}
                        className="text-xs font-medium text-[#94A3B8] hover:text-[#E69D2B] transition-colors cursor-pointer inline-flex items-center gap-1 group/btn"
                      >
                        <span>View CV</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#94A3B8]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Filter className="w-6 h-6 text-[#64748B] mx-auto opacity-50" />
                      <div className="font-semibold text-white">No applicants found</div>
                      <p className="text-xs text-[#64748B]">
                        {searchQuery
                          ? `No applicants match "${searchQuery}". Clear your search query to see all candidates.`
                          : `No applicants currently under status "${selectedStatus}".`}
                      </p>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-xs font-medium text-[#E69D2B] hover:underline cursor-pointer"
                        >
                          Clear search filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Slide-Over Drawer */}
      <CandidateDrawer
        candidate={activeCandidate}
        isOpen={drawerOpen}
        initialOpenCv={openCvImmediately}
        onClose={() => {
          setDrawerOpen(false);
          setOpenCvImmediately(false);
        }}
        onCandidateUpdated={() => {
          if (onRefreshCandidates) onRefreshCandidates();
        }}
      />
    </div>
  );
}
