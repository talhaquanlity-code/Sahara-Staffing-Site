import React, { useState, useEffect } from 'react';
import {
  Send,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { isSupabaseConfigured, localDB } from '../../lib/supabase';
import { sendTestNotification, DEFAULT_NOTIFICATION_EMAIL } from '../../lib/notifications';

const BRAND_PALETTES = [
  { name: 'Sahara Amber Gold (Default)', hex: '#E69D2B' },
  { name: 'Warm Sahara Gold', hex: '#F5A623' },
  { name: 'Radiant Honey Gold', hex: '#F2A51A' },
  { name: 'Subdued Bronze Gold', hex: '#D4881A' },
];

export default function SettingsWorkspace() {
  const { settings, updateSettings } = useCMS();

  // Settings Local Form State
  const [accentColor, setAccentColor] = useState(settings.primaryAccent || '#E69D2B');
  const [recipientEmail, setRecipientEmail] = useState(
    settings.recipientEmail || DEFAULT_NOTIFICATION_EMAIL
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test Email State
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Notification Logs
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(localDB.getNotificationLogs());
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateSettings({
        primaryAccent: accentColor,
        recipientEmail: recipientEmail.trim().toLowerCase(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2800);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setTestResult(null);

    try {
      const result = await sendTestNotification(recipientEmail);
      setTestResult(result);
      setLogs(localDB.getNotificationLogs());
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to dispatch test notification.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Workspace Header: Clean Editorial Hierarchy */}
      <div className="pb-4 border-b border-[#1E293B]/60">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Brand &amp; Notification Settings
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Configure executive notification destinations, brand color tokens, and inspect system audit records.
        </p>
      </div>

      {/* Control Panel Section 1: Notification Recipient */}
      <div className="space-y-4">
        <div className="border-b border-[#1E293B]/60 pb-2">
          <h2 className="text-sm font-semibold text-white">Intake Notification Destination</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Destination for candidate Profiles and automated application alerts
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs max-w-lg">
          <div className="space-y-1.5">
            <label className="block text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Notification Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="talhaquanlity@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#131926] border border-[#1E293B] text-white focus:border-[#E69D2B] focus:outline-none"
            />
            <p className="text-[11px] text-[#64748B]">
              Default destination: <span className="font-mono text-[#E69D2B]">talhaquanlity@gmail.com</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            {saveSuccess && (
              <span className="text-emerald-400 text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="ml-auto px-4 py-2 rounded-lg bg-[#E69D2B] hover:bg-[#F2A51A] text-[#0B0F17] font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Recipient'}
            </button>
          </div>
        </form>

        {/* Test Email Trigger Block */}
        <div className="pt-3 max-w-lg">
          <div className="flex items-center justify-between py-2 border-t border-[#1E293B]/40">
            <div>
              <div className="text-xs font-medium text-white">Test Notification Engine</div>
              <div className="text-[11px] text-[#64748B]">Dispatches verification email to saved address</div>
            </div>
            <button
              type="button"
              onClick={handleSendTestEmail}
              disabled={isSendingTest}
              className="px-3 py-1.5 rounded text-xs font-medium text-white hover:text-[#E69D2B] border border-[#1E293B] hover:border-[#E69D2B] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              {isSendingTest ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#E69D2B]" />
              ) : (
                <Send className="w-3 h-3 text-[#E69D2B]" />
              )}
              <span>Send Test</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs mt-2 ${
                testResult.success
                  ? 'border-emerald-900 bg-emerald-950/20 text-emerald-300'
                  : 'border-red-900 bg-red-950/20 text-red-300'
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5">
                {testResult.success ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                )}
                <span>{testResult.success ? 'Dispatch Recorded' : 'Dispatch Failed'}</span>
              </div>
              <p className="mt-1 text-[11px] opacity-90">{testResult.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel Section 2: Brand Accent Token */}
      <div className="space-y-4">
        <div className="border-b border-[#1E293B]/60 pb-2">
          <h2 className="text-sm font-semibold text-white">Brand Accent Color</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Primary accent token for highlighted metrics, links, and operational controls
          </p>
        </div>

        <div className="space-y-3 text-xs max-w-lg">
          <div className="grid grid-cols-2 gap-2">
            {BRAND_PALETTES.map((p) => (
              <button
                key={p.hex}
                type="button"
                onClick={() => setAccentColor(p.hex)}
                className={`p-2 rounded-lg border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                  accentColor.toLowerCase() === p.hex.toLowerCase()
                    ? 'border-[#E69D2B] bg-white/[0.04]'
                    : 'border-[#1E293B] hover:border-[#334155]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: p.hex }}
                />
                <div className="truncate">
                  <div className="text-[11px] text-white font-medium truncate">{p.name}</div>
                  <div className="font-mono text-[10px] text-[#64748B]">{p.hex}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded border border-[#1E293B] bg-transparent cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded bg-[#131926] border border-[#1E293B] text-white font-mono text-xs focus:border-[#E69D2B] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Control Panel Section 3: Persistence Status (Unboxed Typography) */}
      <div className="space-y-4">
        <div className="border-b border-[#1E293B]/60 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">System Architecture &amp; Storage</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Supabase database connector and private Profile vault status
            </p>
          </div>
          <span className="text-[10.5px] font-mono tracking-wider text-[#94A3B8] uppercase">
            {isSupabaseConfigured ? 'SUPABASE LIVE' : 'LOCAL MODE ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
              Private Storage Bucket
            </div>
            <div className="font-mono font-bold text-white text-xs mt-1">candidate-resumes</div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">Private Authorization Enforced</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
              Row-Level Security
            </div>
            <div className="font-mono font-bold text-white text-xs mt-1">Active</div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">Isolated Staff Access Policies</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
              Tracking Sequence
            </div>
            <div className="font-mono font-bold text-[#E69D2B] text-xs mt-1">#SAH-1046+</div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">Collision-Checked &amp; Unique</div>
          </div>
        </div>
      </div>

      {/* Control Panel Section 4: Audit History Table (Unboxed) */}
      <div className="space-y-4 pt-2">
        <div className="border-b border-[#1E293B]/60 pb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Notification Audit History</h2>
          <span className="text-[11px] text-[#64748B]">Last 50 Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] text-[#64748B] uppercase text-[10px] tracking-wider">
                <th className="py-2 px-2 font-normal">Timestamp</th>
                <th className="py-2 px-2 font-normal">Event Type</th>
                <th className="py-2 px-2 font-normal">Recipient</th>
                <th className="py-2 px-2 font-normal">Subject</th>
                <th className="py-2 px-2 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40 text-white">
              {logs.length > 0 ? (
                logs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-2 text-[#94A3B8] font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-white whitespace-nowrap">
                      {log.type}
                    </td>
                    <td className="py-2.5 px-2 text-[#CBD5E1] font-mono text-[11px] whitespace-nowrap">
                      {log.recipient}
                    </td>
                    <td className="py-2.5 px-2 text-[#94A3B8] truncate max-w-xs">
                      {log.subject}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-[11px] whitespace-nowrap text-[#94A3B8]">
                      {log.delivery_status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#64748B]">
                    No notification transmissions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
