import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Production Supabase client instance (or null in offline local dev mode)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// SAMPLE DEMO CANDIDATES SEED (#SAH-1041 to #SAH-1045)
// ============================================================================
const DEMO_PDF_DATA_URL = 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTg1Cj4+CnN0cmVhbQpCVAovRjEgMTYgVGYKNzIgNzIwIFRECihtU0FIQVJBIFNUQUZGSU5HIElOQy4gLSBDQU5ESURBVEUgQ1YgRE9TU0lFUikgVGoKL0YxIDEwIFRmCjAgLTI4IFRECihoQXBwbGljYW50IFJlY29yZCBWZXR0ZWQgYW5kIFNlY3VyZWRcbi0gQWxsIFJpZ2h0cyBSZXNlcnZlZCkgVGoKRVQgCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOSAwMDAwMCBuIAowMDAwMDAwMDY5IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDI1NSAwMDAwMCBuIAowMDAwMDAwNDkyIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNjAyCiUlRU9GCg==';

const INITIAL_DEMO_CANDIDATES = [
  {
    id: 'demo-1041',
    tracking_id: '#SAH-1041',
    full_name: 'Elena Vance',
    email: 'elena.vance@cloudarchitect.example',
    phone: '+1 (415) 890-2134',
    target_discipline: 'AI & Cloud Engineering',
    linkedin_url: 'https://www.linkedin.com/in/elena-vance-cloud',
    career_summary: 'Principal Cloud Infrastructure Engineer with 11+ years designing fault-tolerant multi-region AWS and GCP enterprise environments. Specialized in high-throughput LLM deployment pipelines and Kubernetes cluster governance.',
    resume_name: 'Elena_Vance_Staff_Cloud_Architect.pdf',
    resume_size: 2450000,
    resume_type: 'application/pdf',
    resume_data_url: DEMO_PDF_DATA_URL,
    status: 'Shortlisted',
    notes: 'Exceptional distributed systems experience at tier-1 cloud provider. Passed initial tech assessment with high marks. Candidate prefers hybrid SF or Remote.',
    privacy_agreed: true,
    privacy_agreed_at: '2026-10-18T14:32:00Z',
    created_at: '2026-10-18T14:32:00Z',
    updated_at: '2026-10-22T09:15:00Z',
    is_demo: true,
  },
  {
    id: 'demo-1042',
    tracking_id: '#SAH-1042',
    full_name: 'Marcus Chen',
    email: 'marcus.chen@execs.example',
    phone: '+1 (212) 640-9921',
    target_discipline: 'Executive Leadership',
    linkedin_url: 'https://www.linkedin.com/in/marcus-chen-exec',
    career_summary: 'Former VP of Technology scaling Series B to IPO ($450M exit). 15+ years managing cross-functional orgs of 140+ engineers, product managers, and site reliability directors.',
    resume_name: 'Marcus_Chen_VP_Engineering_CV.pdf',
    resume_size: 3120000,
    resume_type: 'application/pdf',
    resume_data_url: DEMO_PDF_DATA_URL,
    status: 'Under Review',
    notes: 'Ex-VP Engineering. Looking for VP/CTO opportunity in FinTech or High-Scale SaaS. Scheduled for executive consultation interview this Thursday.',
    privacy_agreed: true,
    privacy_agreed_at: '2026-10-20T11:20:00Z',
    created_at: '2026-10-20T11:20:00Z',
    updated_at: '2026-10-23T16:45:00Z',
    is_demo: true,
  },
  {
    id: 'demo-1043',
    tracking_id: '#SAH-1043',
    full_name: 'Sarah Jenkins',
    email: 'sarah.jenkins@finance.example',
    phone: '+1 (312) 554-1029',
    target_discipline: 'Strategic Finance',
    linkedin_url: 'https://www.linkedin.com/in/sarah-jenkins-cfo',
    career_summary: 'Chartered Financial Analyst (CFA) with deep corporate development, M&A due diligence, and capital markets experience across mid-market enterprise technology firms.',
    resume_name: 'Sarah_Jenkins_Strategic_Finance_Lead.pdf',
    resume_size: 1980000,
    resume_type: 'application/pdf',
    resume_data_url: DEMO_PDF_DATA_URL,
    status: 'Placed',
    notes: 'Successfully placed as Interim VP of Strategic Finance at Crestview Partners. Placement contract finalized with standard 90-day retention guarantee.',
    privacy_agreed: true,
    privacy_agreed_at: '2026-10-12T08:15:00Z',
    created_at: '2026-10-12T08:15:00Z',
    updated_at: '2026-10-24T18:00:00Z',
    is_demo: true,
  },
  {
    id: 'demo-1044',
    tracking_id: '#SAH-1044',
    full_name: 'David Ross',
    email: 'david.ross@developer.example',
    phone: '+1 (617) 402-8871',
    target_discipline: 'Product & Full-Stack',
    linkedin_url: 'https://www.linkedin.com/in/david-ross-tech',
    career_summary: 'Senior Full-Stack Product Engineer with 8+ years experience building reactive frontend architectures (React/Next.js/TypeScript) paired with high-concurrency Node.js and Go microservices.',
    resume_name: 'David_Ross_Senior_FullStack.docx',
    resume_size: 1450000,
    resume_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    resume_data_url: null, // DOCX sample demonstrates DOCX metadata & download workflow
    status: 'New',
    notes: 'Applied through public candidate intake portal. Outstanding portfolio with 3 shipped production enterprise applications. Resume in DOCX format.',
    privacy_agreed: true,
    privacy_agreed_at: '2026-10-24T14:10:00Z',
    created_at: '2026-10-24T14:10:00Z',
    updated_at: '2026-10-24T14:10:00Z',
    is_demo: true,
  },
  {
    id: 'demo-1045',
    tracking_id: '#SAH-1045',
    full_name: 'Amina Al-Mansoor',
    email: 'amina.mansoor@ai-research.example',
    phone: '+1 (206) 779-3310',
    target_discipline: 'AI & Cloud Engineering',
    linkedin_url: 'https://www.linkedin.com/in/amina-al-mansoor-ml',
    career_summary: 'Machine Learning Research Engineer focusing on retrieval-augmented generation (RAG) and embedding fine-tuning. MS in Computer Science from Stanford.',
    resume_name: 'Amina_AlMansoor_ML_Research.pdf',
    resume_size: 2890000,
    resume_type: 'application/pdf',
    resume_data_url: DEMO_PDF_DATA_URL,
    status: 'Archived',
    notes: 'Accepted competitive senior offer at tier-1 research lab. Candidate marked archived; keep warm relationship for principal consulting leads in 2027.',
    privacy_agreed: true,
    privacy_agreed_at: '2026-09-28T10:00:00Z',
    created_at: '2026-09-28T10:00:00Z',
    updated_at: '2026-10-15T12:00:00Z',
    is_demo: true,
  },
];

// Local storage keys
const STORAGE_KEYS = {
  CANDIDATES: 'sahara_candidates_v1',
  AUTH_SESSION: 'sahara_admin_session_v1',
  SETTINGS: 'sahara_admin_settings_v1',
  NOTIFICATIONS: 'sahara_notification_logs_v1',
};

// ============================================================================
// LOCAL STORAGE ADAPTER (HIGH-RELIABILITY OFFLINE + DEV SYSTEM)
// ============================================================================
class LocalStorageDatabase {
  getCandidates() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(INITIAL_DEMO_CANDIDATES));
        return INITIAL_DEMO_CANDIDATES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_CANDIDATES;
    }
  }

  saveCandidates(candidates) {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  async getCandidateList() {
    return this.getCandidates();
  }

  async addCandidate(candidate) {
    const list = this.getCandidates();
    // Prepend new candidate to top
    const updated = [candidate, ...list];
    this.saveCandidates(updated);
    return candidate;
  }

  async updateCandidate(id, partial) {
    const list = this.getCandidates();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Candidate record not found');
    
    list[index] = {
      ...list[index],
      ...partial,
      updated_at: new Date().toISOString(),
    };
    this.saveCandidates(list);
    return list[index];
  }

  // Unique Tracking ID Generation (#SAH-XXXX)
  generateTrackingId() {
    const list = this.getCandidates();
    const existingIds = new Set(list.map((c) => c.tracking_id));

    // Try finding next sequential ID starting above demo records (1046+)
    let numeric = 1046;
    while (numeric <= 9999) {
      const candidateId = `#SAH-${String(numeric).padStart(4, '0')}`;
      if (!existingIds.has(candidateId)) {
        return candidateId;
      }
      numeric++;
    }

    // Fallback collision detection
    for (let attempts = 0; attempts < 50; attempts++) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      const candidateId = `#SAH-${rand}`;
      if (!existingIds.has(candidateId)) {
        return candidateId;
      }
    }

    throw new Error('Candidate tracking ID space exhausted. Contact system administrator.');
  }

  // Admin Notification Logs
  getNotificationLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addNotificationLog(logEntry) {
    try {
      const logs = this.getNotificationLogs();
      const updated = [
        {
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          ...logEntry,
        },
        ...logs.slice(0, 49), // retain last 50
      ];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to log notification:', e);
    }
  }
}

export const localDB = new LocalStorageDatabase();

// ============================================================================
// UNIFIED DATA SERVICE (SUPABASE WITH AUTOMATIC LOCAL PERSISTENCE FALLBACK)
// ============================================================================
export const CandidateService = {
  async getAll() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) return data;
        // If Supabase table is empty, seed with demo candidates
        return localDB.getCandidateList();
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to LocalDB:', err);
        return localDB.getCandidateList();
      }
    }
    return localDB.getCandidateList();
  },

  async create(candidateData) {
    // Generate tracking ID
    const trackingId = localDB.generateTrackingId();
    const newRecord = {
      id: 'sah_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      tracking_id: trackingId,
      full_name: candidateData.fullName.trim(),
      email: candidateData.email.trim().toLowerCase(),
      phone: candidateData.phone.trim(),
      target_discipline: candidateData.targetDiscipline,
      linkedin_url: candidateData.linkedinUrl.trim(),
      career_summary: candidateData.careerSummary?.trim() || '',
      resume_name: candidateData.resumeFile ? candidateData.resumeFile.name : 'resume.pdf',
      resume_size: candidateData.resumeFile ? candidateData.resumeFile.size : 0,
      resume_type: candidateData.resumeFile ? candidateData.resumeFile.type : 'application/pdf',
      resume_data_url: candidateData.resumeDataUrl || null,
      resume_path: `resumes/${trackingId}_${candidateData.resumeFile?.name || 'resume.pdf'}`,
      status: 'New',
      notes: '',
      privacy_agreed: Boolean(candidateData.privacyAgreed),
      privacy_agreed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_demo: false,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('candidates')
          .insert([newRecord])
          .select()
          .single();

        if (error) throw error;
        // Also sync locally
        await localDB.addCandidate(data || newRecord);
        return data || newRecord;
      } catch (err) {
        console.warn('Supabase insert failed, storing in LocalDB:', err);
        await localDB.addCandidate(newRecord);
        return newRecord;
      }
    }

    // Offline / Local development mode
    await localDB.addCandidate(newRecord);
    return newRecord;
  },

  async updateStatus(id, newStatus) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('candidates')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        await localDB.updateCandidate(id, { status: newStatus });
        return data;
      } catch (err) {
        console.warn('Supabase status update failed, saving locally:', err);
      }
    }
    return localDB.updateCandidate(id, { status: newStatus });
  },

  async updateNotes(id, notes) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('candidates')
          .update({ notes, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        await localDB.updateCandidate(id, { notes });
        return data;
      } catch (err) {
        console.warn('Supabase notes update failed, saving locally:', err);
      }
    }
    return localDB.updateCandidate(id, { notes });
  },
};

