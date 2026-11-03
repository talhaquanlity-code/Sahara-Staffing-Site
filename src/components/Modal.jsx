import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
import markImg from '../assets/sahara-mark.png';

export default function Modal() {
  const { modalState, closeModal, showToast } = useUI();
  const { isOpen, title } = modalState;

  const [formData, setFormData] = useState({
    email: '',
    company: '',
    revenue: '$50,000 - $150,000 / mo',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
    showToast('Application submitted! Our financing team will reach out shortly.');
    setFormData({
      email: '',
      company: '',
      revenue: '$50,000 - $150,000 / mo',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className={`fixed inset-0 bg-obsidian/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Modal Dialog */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-obsidian border border-slateCard text-crispWhite rounded-[28px] p-6 sm:p-8 max-h-[92vh] overflow-y-auto z-50 transition-all duration-300 shadow-2xl ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <img src={markImg} alt="Sahara" className="w-7 h-7 object-contain" />
            <span className="font-bold text-lg tracking-tight">{title}</span>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slateCard flex items-center justify-center text-slateGray hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slateGray mb-1.5 font-medium">Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="founder@company.com"
              className="w-full bg-slateCard/70 border border-slateCard rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder-slateGray/60 focus:border-saharaGold focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-slateGray mb-1.5 font-medium">Company Name</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Technologies Inc."
              className="w-full bg-slateCard/70 border border-slateCard rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder-slateGray/60 focus:border-saharaGold focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-slateGray mb-1.5 font-medium">Monthly Revenue Band</label>
            <select
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              className="w-full bg-slateCard/70 border border-slateCard rounded-xl px-4 py-3 text-base sm:text-sm text-white focus:border-saharaGold focus:outline-none transition-colors"
            >
              <option className="bg-obsidian text-white">$50,000 - $150,000 / mo</option>
              <option className="bg-obsidian text-white">$150,000 - $500,000 / mo</option>
              <option className="bg-obsidian text-white">$500,000 - $2,000,000+ / mo</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-saharaGold hover:bg-saharaGoldLight text-obsidian font-semibold py-3.5 rounded-full text-sm transition-all flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            <span>Continue to Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}

