import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  ArrowRight,
  Loader2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { CandidateService } from '../lib/supabase';
import { sendCandidateNotification } from '../lib/notifications';
import { useCMS } from '../context/CMSContext';

const DISCIPLINES = [
  'AI & Cloud Engineering',
  'Executive Leadership',
  'Strategic Finance',
  'Product & Full-Stack',
];

export default function ContactPage() {
  const { settings } = useCMS();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    targetDiscipline: '',
    linkedinUrl: '',
    careerSummary: '',
    privacyAgreed: false,
  });

  // Resume File State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeDataUrl, setResumeDataUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Interaction & Submission State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Field change handler
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setSubmitError(null);
  };

  // Validate file
  const handleFileSelection = (file) => {
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const isDocx = file.name.toLowerCase().endsWith('.docx');
    const isPdf = file.name.toLowerCase().endsWith('.pdf');

    if (!validTypes.includes(file.type) && !isDocx && !isPdf) {
      setErrors((prev) => ({
        ...prev,
        resume: 'Unsupported format. Please attach a valid PDF or DOCX file.',
      }));
      return;
    }

    // 10 MB maximum
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: 'File size exceeds 10 MB. Please optimize or compress your document.',
      }));
      return;
    }

    // Read base64 for PDF preview & persistence
    if (isPdf) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeDataUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setResumeDataUrl(null);
    }

    setResumeFile(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.resume;
      return next;
    });
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setResumeFile(null);
    setResumeDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Validate all inputs
  const validate = () => {
    const errs = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your phone number with country code.';
    } else if (formData.phone.trim().length < 7) {
      errs.phone = 'Please enter a complete phone number.';
    }

    if (!formData.targetDiscipline) {
      errs.targetDiscipline = 'Please select your target discipline.';
    }

    if (!formData.linkedinUrl.trim()) {
      errs.linkedinUrl = 'Please provide your LinkedIn profile URL.';
    } else if (!/^https?:\/\/(www\.)?linkedin\.com\/.*$/i.test(formData.linkedinUrl.trim())) {
      errs.linkedinUrl = 'Please enter a valid LinkedIn URL (https://www.linkedin.com/in/...).';
    }

    if (!resumeFile) {
      errs.resume = 'Please attach your PDF or DOCX resume to continue.';
    }

    if (!formData.privacyAgreed) {
      errs.privacyAgreed = 'You must agree to candidate data storage and review to submit.';
    }

    return errs;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Persist candidate record
      const record = await CandidateService.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        targetDiscipline: formData.targetDiscipline,
        linkedinUrl: formData.linkedinUrl,
        careerSummary: formData.careerSummary,
        resumeFile,
        resumeDataUrl,
        privacyAgreed: formData.privacyAgreed,
      });

      // 2. Dispatch automated email alert to talhaquanlity@gmail.com
      try {
        await sendCandidateNotification(record, settings);
      } catch (notifyErr) {
        console.warn('Candidate alert notification notice:', notifyErr);
      }

      // 3. Render verified success screen
      setSubmittedCandidate(record);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError(
        err.message || 'An unexpected error occurred while processing your application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy tracking ID
  const handleCopyId = () => {
    if (submittedCandidate?.tracking_id) {
      navigator.clipboard.writeText(submittedCandidate.tracking_id);
      setCopiedTrackingId(true);
      setTimeout(() => setCopiedTrackingId(false), 2400);
    }
  };

  // Reset form for another candidate
  const handleReset = () => {
    setSubmittedCandidate(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      targetDiscipline: '',
      linkedinUrl: '',
      careerSummary: '',
      privacyAgreed: false,
    });
    setResumeFile(null);
    setResumeDataUrl(null);
    setErrors({});
  };

  return (
    <div className="w-full bg-[#FAF9F6] text-[#0B0F17]">
      {/* ========================================================================= */}
      {/* SPLIT-LAYOUT CANDIDATE INTAKE CONTAINER (~1200px MAX-WIDTH)               */}
      {/* ========================================================================= */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-10 lg:px-12 pt-24 sm:pt-40 pb-16 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: CANDIDATE INTRO & VERIFIED CONTACT DETAILS (40%)         */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            {/* Editorial Eyebrow & Title */}
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-[#B87314] uppercase mb-3">
                SAHARA STAFFING INC. / CANDIDATE NETWORK
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0B0F17] leading-[1.12] tracking-tight mb-4">
                Your next opportunity starts with a{' '}
                <span className="text-[#B87314]">conversation.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-3">
                Share your professional background and career goals with Sahara Staffing Inc. Submit
                your profile for consideration within our talent network.
              </p>

              <p className="text-xs text-[#64748B] leading-relaxed">
                A thoughtful introduction helps us understand your experience, interests, and the
                roles you want to pursue.
              </p>
            </div>

            {/* Verified Contact Details (Reusing Project Details) */}
            <div className="pt-4 border-t border-[#E5E0D5] space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F17]">
                Sahara Executive Office
              </div>

              <div className="space-y-2.5 text-xs text-[#475569]">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#B87314] flex-shrink-0" />
                  <a
                    href="mailto:contact@saharastaffing.com"
                    className="hover:text-[#0B0F17] transition-colors"
                  >
                    contact@saharastaffing.com
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#B87314] flex-shrink-0" />
                  <a
                    href="tel:+18005550199"
                    className="hover:text-[#0B0F17] transition-colors"
                  >
                    +1 (800) 555-0199
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B87314] flex-shrink-0 mt-0.5" />
                  <span>100 Park Avenue, Suite 1600, New York, NY 10017</span>
                </div>
              </div>
            </div>

            {/* Candidate Guidance: Before You Submit */}
            <div className="pt-4 border-t border-[#E5E0D5] space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F17]">
                Before you submit
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                Your current resume, a LinkedIn profile, and a short overview of your professional
                background and target roles.
              </p>

              <div className="space-y-2 pt-1 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#B87314] text-[11px] font-bold">01</span>
                  <span>Updated resume (PDF or DOCX format, max 10 MB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#B87314] text-[11px] font-bold">02</span>
                  <span>Active LinkedIn profile URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#B87314] text-[11px] font-bold">03</span>
                  <span>Target discipline and salary expectations</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: APPLICATION FORM OR SUCCESS STATE (60%)                 */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!submittedCandidate ? (
                /* Application Form */
                <motion.form
                  key="intake-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6"
                >
                  {/* Form Heading: Aligned with the top of left column */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0B0F17] tracking-tight">
                      Introduce yourself.
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                      Complete your profile and attach your resume.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Paired Row 1: Full Name & Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div id="field-fullName" className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-[#0B0F17] uppercase tracking-wider">
                        Full Name <span className="text-[#B87314]">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full px-3.5 py-3 rounded-lg border bg-white text-[#0B0F17] text-base sm:text-sm placeholder-[#94A3B8] focus:outline-none transition-colors ${
                          errors.fullName
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-[#D4CEBF] focus:border-[#0B0F17]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div id="field-email" className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-[#0B0F17] uppercase tracking-wider">
                        Email Address <span className="text-[#B87314]">*</span>
                      </label>
                      <input
                        type="email"
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full px-3.5 py-3 rounded-lg border bg-white text-[#0B0F17] text-base sm:text-sm placeholder-[#94A3B8] focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-[#D4CEBF] focus:border-[#0B0F17]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Paired Row 2: Phone & Target Discipline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div id="field-phone" className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-[#0B0F17] uppercase tracking-wider">
                        Phone Number <span className="text-[#B87314]">*</span>
                      </label>
                      <input
                        type="tel"
                        disabled={isSubmitting}
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+1 (555) 012-3456"
                        className={`w-full px-3.5 py-3 rounded-lg border bg-white text-[#0B0F17] text-base sm:text-sm placeholder-[#94A3B8] focus:outline-none transition-colors ${
                          errors.phone
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-[#D4CEBF] focus:border-[#0B0F17]'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div id="field-targetDiscipline" className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-[#0B0F17] uppercase tracking-wider">
                        Target Discipline <span className="text-[#B87314]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          disabled={isSubmitting}
                          value={formData.targetDiscipline}
                          onChange={(e) => handleChange('targetDiscipline', e.target.value)}
                          className={`w-full px-3.5 py-3 rounded-lg border bg-white text-[#0B0F17] text-base sm:text-sm appearance-none focus:outline-none transition-colors cursor-pointer pr-8 ${
                            errors.targetDiscipline
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-[#D4CEBF] focus:border-[#0B0F17]'
                          }`}
                        >
                          <option value="">Select discipline...</option>
                          {DISCIPLINES.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748B]">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                      {errors.targetDiscipline && (
                        <p className="text-[11px] text-red-600 mt-1">
                          {errors.targetDiscipline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: LinkedIn URL */}
                  <div id="field-linkedinUrl" className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#0B0F17] uppercase tracking-wider">
                      LinkedIn Profile URL <span className="text-[#B87314]">*</span>
                    </label>
                    <input
                      type="url"
                      disabled={isSubmitting}
                      value={formData.linkedinUrl}
                      onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      className={`w-full px-3.5 py-3 rounded-lg border bg-white text-[#0B0F17] text-base sm:text-sm placeholder-[#94A3B8] focus:outline-none transition-colors ${
                        errors.linkedinUrl
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#D4CEBF] focus:border-[#0B0F17]'
                      }`}
                    />
                    {errors.linkedinUrl && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.linkedinUrl}</p>
                    )}
                  </div>

                  {/* Row 4: Career Summary & Salary Targets */}
                  <div id="field-careerSummary" className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#0B0F17] uppercase tracking-wider">
                      Career Summary &amp; Salary Targets <span className="text-[#64748B] font-normal lowercase">(optional context)</span>
                    </label>
                    <textarea
                      rows={3}
                      disabled={isSubmitting}
                      value={formData.careerSummary}
                      onChange={(e) => handleChange('careerSummary', e.target.value)}
                      placeholder="Summarize your experience, target roles, preferred work models (Remote/Hybrid), and salary expectations..."
                      className="w-full px-3.5 py-3 rounded-lg border border-[#D4CEBF] bg-white text-[#0B0F17] text-base sm:text-sm placeholder-[#94A3B8] focus:border-[#0B0F17] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Row 5: Resume Upload Area */}
                  <div id="field-resume" className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#0B0F17] uppercase tracking-wider">
                      Resume Document <span className="text-[#B87314]">*</span>
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelection(e.target.files[0]);
                        }
                      }}
                    />

                    {!resumeFile ? (
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border border-dashed rounded-xl p-6 sm:p-7 text-center cursor-pointer transition-colors ${
                          dragActive
                            ? 'border-[#B87314] bg-[#B87314]/5'
                            : errors.resume
                            ? 'border-red-400 bg-red-50/30'
                            : 'border-[#D4CEBF] bg-white hover:border-[#0B0F17]'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-1.5">
                          <Upload className="w-5 h-5 text-[#B87314] mb-1" />
                          <p className="text-xs font-semibold text-[#0B0F17]">
                            Drop your resume here
                          </p>
                          <p className="text-[11px] text-[#64748B]">
                            or <span className="underline font-medium text-[#0B0F17]">browse files</span> from your computer
                          </p>
                          <p className="text-[10.5px] text-[#94A3B8] pt-1">
                            PDF or DOCX &bull; Maximum 10 MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-lg border border-[#D4CEBF] bg-white flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-[#B87314] flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#0B0F17] truncate">
                              {resumeFile.name}
                            </p>
                            <p className="text-[10.5px] text-[#64748B]">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB &bull; {resumeFile.name.endsWith('.docx') ? 'DOCX' : 'PDF'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeFile}
                          disabled={isSubmitting}
                          className="p-1 rounded text-[#64748B] hover:text-red-600 transition-colors"
                          aria-label="Remove attached file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {errors.resume && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.resume}</p>
                    )}
                  </div>

                  {/* Row 6: Privacy Agreement */}
                  <div id="field-privacyAgreed" className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        disabled={isSubmitting}
                        checked={formData.privacyAgreed}
                        onChange={(e) => handleChange('privacyAgreed', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-[#D4CEBF] text-[#B87314] focus:ring-[#B87314] cursor-pointer"
                      />
                      <span className="text-xs text-[#475569] leading-relaxed">
                        I agree to Sahara Staffing Inc. storing and reviewing the information and
                        resume I submit for candidate consideration, as described in the Privacy Policy.
                      </span>
                    </label>
                    {errors.privacyAgreed && (
                      <p className="text-[11px] text-red-600 mt-1 ml-6.5">
                        {errors.privacyAgreed}
                      </p>
                    )}
                  </div>

                  {/* Row 7: Submission CTA */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0B0F17] hover:bg-[#E69D2B] text-white hover:text-[#0B0F17] font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm active:scale-98"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Profile...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Profile to Network</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* Success State */
                <motion.div
                  key="intake-success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0B0F17] tracking-tight">
                      Profile Submitted Successfully.
                    </h2>
                    <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">
                      Your profile has been received by Sahara Staffing Inc. Our recruitment leads
                      will review your Profile against active enterprise searches.
                    </p>
                  </div>

                  {/* Plain Editorial Tracking ID Display */}
                  <div className="p-6 rounded-xl bg-[#0B0F17] text-white space-y-3">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Application Tracking Identifier
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-2xl font-bold text-[#E69D2B] tracking-wider">
                        {submittedCandidate.tracking_id}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedTrackingId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#94A3B8] pt-2 border-t border-white/10 leading-relaxed">
                      Please retain this tracking ID for reference in all correspondence with Sahara
                      Staffing Inc.
                    </p>
                  </div>

                  {/* Submission Summary Recap */}
                  <div className="space-y-2 text-xs text-[#475569] border-t border-[#E5E0D5] pt-4">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Candidate:</span>
                      <span className="font-semibold text-[#0B0F17]">{submittedCandidate.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Target Discipline:</span>
                      <span className="font-semibold text-[#0B0F17]">{submittedCandidate.target_discipline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Attached Resume:</span>
                      <span className="font-semibold text-[#0B0F17]">{submittedCandidate.resume_name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-4 text-xs">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="font-semibold text-[#0B0F17] hover:text-[#B87314] transition-colors cursor-pointer"
                    >
                      &larr; Submit another application
                    </button>
                    <span className="text-[#D4CEBF]">&bull;</span>
                    <a
                      href="#home"
                      className="text-[#64748B] hover:text-[#0B0F17] transition-colors"
                    >
                      Return to Homepage
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
