import React, { useState, useEffect } from 'react';
import {
  Users,
  LayoutGrid,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldAlert,
  Loader2,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import logoImg from '../assets/sahara-logo.png';
import markImg from '../assets/sahara-mark.png';
import { isSupabaseConfigured, supabase, CandidateService } from '../lib/supabase';
import ATSWorkspace from '../components/admin/ATSWorkspace';
import CMSWorkspace from '../components/admin/CMSWorkspace';
import SettingsWorkspace from '../components/admin/SettingsWorkspace';

const SESSION_KEY = 'sahara_admin_session_v1';

export default function AdminPage({ onNavigateHome }) {
  // Always begin at the Login Gate. Never automatically bypass the login screen.
  const [session, setSession] = useState(null);

  // Active Workspace: 'ats' | 'cms' | 'settings'
  const [activeWorkspace, setActiveWorkspace] = useState('ats');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Candidates Dataset State
  const [candidates, setCandidates] = useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Load Candidates
  const loadCandidates = async () => {
    setIsLoadingCandidates(true);
    try {
      const data = await CandidateService.getAll();
      setCandidates(data || []);
    } catch (err) {
      console.error('Failed to load candidate Profiles:', err);
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadCandidates();
    }
  }, [session]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setAuthError('Please enter both your administrator email and password.');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) throw error;

        const newSession = {
          user: data.user,
          email: data.user.email,
          role: 'administrator',
          mode: 'supabase_production',
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        setSession(newSession);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 350));
        const newSession = {
          email: email.trim().toLowerCase(),
          role: 'administrator',
          mode: 'local_development',
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        setSession(newSession);
      }
    } catch (err) {
      console.error('Authentication failed:', err);
      setAuthError(err.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Quick Demo Login for instant verification
  const handleQuickDemoLogin = () => {
    const demoSession = {
      email: 'admin@saharastaffing.example',
      role: 'administrator',
      mode: 'development_demo',
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(demoSession));
    setSession(demoSession);
  };

  // Handle Logout
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setEmail('');
    setPassword('');
  };

  // =========================================================================
  // VIEW 1: REFINED LOGIN GATE (UNAUTHENTICATED)
  // =========================================================================
  if (!session) {
    return (
      <div className="min-h-screen bg-[#080B12] text-white flex flex-col justify-between p-6 select-none">
        {/* Top Minimal Brand Bar */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <img src={markImg} alt="Sahara Emblem" className="h-5 w-auto" />
            <span className="text-[11px] font-semibold tracking-[0.16em] text-[#94A3B8] uppercase">
              Sahara Staffing Inc.
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            &larr; Public Website
          </button>
        </div>

        {/* Center Login Box (Restrained Editorial Container) */}
        <div className="w-full max-w-md mx-auto my-auto py-10">
          <div className="bg-[#0B0F17] rounded-2xl p-8 sm:p-10 border border-[#1E293B] space-y-6">
            {/* Logo & Heading */}
            <div className="space-y-2">
              <img
                src={logoImg}
                alt="Sahara Staffing Inc."
                className="h-7 w-auto object-contain mb-4"
              />
              <h1 className="text-xl font-bold text-white tracking-tight">
                Executive Administrative Portal
              </h1>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Restricted access. Authorized staffing personnel only.
              </p>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@saharastaffing.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs sm:text-sm placeholder-[#64748B] focus:border-[#E69D2B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-[#131926] border border-[#1E293B] text-white text-xs sm:text-sm placeholder-[#64748B] focus:border-[#E69D2B] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign In to Executive Dashboard &rarr;</span>
                  )}
                </button>
              </div>
            </form>

            {/* Development Quick-Access Button */}
            <div className="pt-3 border-t border-[#1E293B]/60 text-center space-y-2">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 text-[#E69D2B] hover:text-[#F2A51A] text-xs font-medium transition-colors cursor-pointer"
              >
                Instant Development Sign In (Demo Mode)
              </button>
              <div className="text-[10px] text-[#64748B] flex items-center justify-center gap-1.5 font-mono">
                <span>Shortcut:</span>
                <span className="text-[#94A3B8]">Tab + SH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="w-full max-w-md mx-auto text-center text-[10.5px] text-[#64748B] py-2">
          &copy; 2026 Sahara Staffing Inc. Candidate Data Governance
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED EXECUTIVE DASHBOARD (REFINED DE-AI SHELL)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex">
      {/* ===================================================================== */}
      {/* 1. FIXED LEFT SIDEBAR (EXACTLY 260px WIDE ON DESKTOP)                 */}
      {/* ===================================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[#0E131F] border-r border-[#1E293B]/60 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1E293B]/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={markImg} alt="Sahara" className="h-6 w-auto" />
            <div>
              <div className="text-xs font-bold text-white tracking-wide uppercase">
                Sahara Staffing
              </div>
              <div className="text-[10px] text-[#E69D2B] font-mono">Executive Admin</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-[#94A3B8] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Navigation Items (Restrained Left Indicator, No Bulky Pills) */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-2 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
            Workspaces
          </div>

          {/* Item 1: ATS */}
          <button
            type="button"
            onClick={() => {
              setActiveWorkspace('ats');
              setMobileSidebarOpen(false);
            }}
            className={`relative w-full px-3.5 py-2.5 text-xs flex items-center gap-3 transition-colors text-left cursor-pointer rounded-r-md ${
              activeWorkspace === 'ats'
                ? 'text-white font-medium bg-white/[0.04] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-[#E69D2B]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Applicant Talent Portal</span>
          </button>

          {/* Item 2: CMS */}
          <button
            type="button"
            onClick={() => {
              setActiveWorkspace('cms');
              setMobileSidebarOpen(false);
            }}
            className={`relative w-full px-3.5 py-2.5 text-xs flex items-center gap-3 transition-colors text-left cursor-pointer rounded-r-md ${
              activeWorkspace === 'cms'
                ? 'text-white font-medium bg-white/[0.04] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-[#E69D2B]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <LayoutGrid className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Site Content CMS</span>
          </button>

          {/* Item 3: Settings */}
          <button
            type="button"
            onClick={() => {
              setActiveWorkspace('settings');
              setMobileSidebarOpen(false);
            }}
            className={`relative w-full px-3.5 py-2.5 text-xs flex items-center gap-3 transition-colors text-left cursor-pointer rounded-r-md ${
              activeWorkspace === 'settings'
                ? 'text-white font-medium bg-white/[0.04] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-[#E69D2B]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Brand &amp; Notifications</span>
          </button>
        </nav>

        {/* Lower Account & Controls (Unboxed, Minimal Typography) */}
        <div className="p-4 border-t border-[#1E293B]/60 space-y-3">
          <div className="px-1 text-[11px]">
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-medium">
              Administrator
            </div>
            <div className="text-[#CBD5E1] font-mono text-xs truncate mt-0.5">
              {session.email || 'administrator'}
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full px-1 py-1.5 text-left text-xs text-[#94A3B8] hover:text-white transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-1 py-1.5 text-left text-xs font-medium text-red-400/85 hover:text-red-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ===================================================================== */}
      {/* 2. MAIN WORKSPACE CANVAS                                              */}
      {/* ===================================================================== */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        {/* Top Operational Bar (72px, Quiet Text Environment Indicator) */}
        <header className="h-[72px] bg-[#0B0F17] border-b border-[#1E293B]/60 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs text-[#94A3B8] font-medium hidden sm:inline">
              Sahara Staffing Inc. / Executive Command
            </span>
          </div>

          {/* Top Bar Right: Text Status Indicator & Quiet Logout */}
          <div className="flex items-center gap-6">
            <span className="text-[10.5px] font-mono tracking-widest text-[#64748B] uppercase">
              {isSupabaseConfigured ? 'SUPABASE LIVE' : 'LOCAL MODE'}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {activeWorkspace === 'ats' && (
            <ATSWorkspace candidates={candidates} onRefreshCandidates={loadCandidates} />
          )}

          {activeWorkspace === 'cms' && <CMSWorkspace />}

          {activeWorkspace === 'settings' && <SettingsWorkspace />}
        </main>
      </div>
    </div>
  );
}
