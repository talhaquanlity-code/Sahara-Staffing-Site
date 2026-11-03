import React from 'react';
import { useUI } from '../context/UIContext';

export default function Toast() {
  const { toastState } = useUI();
  const { isOpen, message } = toastState;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none bg-obsidian text-crispWhite px-5 py-3.5 rounded-2xl border border-slateCard shadow-2xl flex items-center gap-3 ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-saharaGold shrink-0"></span>
      <span className="text-xs font-medium tracking-wide">{message || 'Action completed'}</span>
    </div>
  );
}

