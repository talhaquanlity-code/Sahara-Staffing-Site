-- ============================================================================
-- SAHARA STAFFING INC. — PRODUCTION DATABASE SCHEMA
-- Candidate Intake System + Secure Admin Portal + Executive Dashboard + CMS
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. CANDIDATES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id VARCHAR(16) UNIQUE NOT NULL, -- Format: #SAH-XXXX
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    target_discipline VARCHAR(128) NOT NULL,
    linkedin_url TEXT NOT NULL,
    career_summary TEXT,
    resume_path TEXT,
    resume_name VARCHAR(255),
    resume_size BIGINT,
    resume_type VARCHAR(128),
    resume_data_url TEXT,
    status VARCHAR(64) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Shortlisted', 'Placed', 'Archived')),
    notes TEXT DEFAULT '',
    privacy_agreed BOOLEAN NOT NULL DEFAULT TRUE,
    privacy_agreed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_demo BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes for lightning-fast search and ATS filtering
CREATE INDEX IF NOT EXISTS idx_candidates_tracking_id ON public.candidates(tracking_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON public.candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_discipline ON public.candidates(target_discipline);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON public.candidates(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2. CMS CONTENT TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_content (
    id VARCHAR(64) PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(255)
);

-- ----------------------------------------------------------------------------
-- 3. ADMIN SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key VARCHAR(64) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. NOTIFICATION AUDIT LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(64) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    tracking_id VARCHAR(32),
    candidate_name VARCHAR(255),
    delivery_status VARCHAR(32) NOT NULL,
    mode VARCHAR(64),
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON public.notification_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Security: Resumes and Profiles are private to authorized staff
-- ----------------------------------------------------------------------------
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Candidates: Anyone can submit their own profile
CREATE POLICY "Public candidates can insert applications"
    ON public.candidates
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Candidates: Only authenticated staff can read, search, or update Profiles
CREATE POLICY "Authenticated staff can view and manage candidate Profiles"
    ON public.candidates
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CMS Content: Public can read published content
CREATE POLICY "Public read access for published website content"
    ON public.cms_content
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- CMS Content: Only authenticated staff can edit
CREATE POLICY "Authenticated staff can update website CMS content"
    ON public.cms_content
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Admin Settings: Authenticated staff access only
CREATE POLICY "Authenticated staff access to admin settings"
    ON public.admin_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Notification Logs: Authenticated staff access only
CREATE POLICY "Authenticated staff access to notification logs"
    ON public.notification_logs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 6. PRIVATE STORAGE BUCKET CONFIGURATION FOR RESUMES
-- ----------------------------------------------------------------------------
-- Create private 'candidate-resumes' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate-resumes', 'candidate-resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow public anonymous uploads into 'candidate-resumes'
CREATE POLICY "Allow public resume uploads"
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'candidate-resumes');

-- Storage Policy: Allow only authenticated staff to read/download candidate resumes
CREATE POLICY "Allow authenticated staff to read resumes"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'candidate-resumes');

-- ----------------------------------------------------------------------------
-- 7. INITIAL SEED FOR DEMO CANDIDATES (#SAH-1041 to #SAH-1045)
-- ----------------------------------------------------------------------------
INSERT INTO public.candidates (
    tracking_id, full_name, email, phone, target_discipline, linkedin_url,
    career_summary, resume_name, resume_size, resume_type, status, notes,
    privacy_agreed, is_demo
) VALUES
(
    '#SAH-1041', 'Elena Vance', 'elena.vance@cloudarchitect.example', '+1 (415) 890-2134',
    'AI & Cloud Engineering', 'https://www.linkedin.com/in/elena-vance-cloud',
    'Principal Cloud Infrastructure Engineer with 11+ years designing fault-tolerant multi-region AWS and GCP enterprise environments.',
    'Elena_Vance_Staff_Cloud_Architect.pdf', 2450000, 'application/pdf', 'Shortlisted',
    'Exceptional distributed systems experience at tier-1 cloud provider. Passed initial tech assessment with high marks.',
    TRUE, TRUE
),
(
    '#SAH-1042', 'Marcus Chen', 'marcus.chen@execs.example', '+1 (212) 640-9921',
    'Executive Leadership', 'https://www.linkedin.com/in/marcus-chen-exec',
    'Former VP of Technology scaling Series B to IPO ($450M exit). 15+ years managing cross-functional orgs.',
    'Marcus_Chen_VP_Engineering_CV.pdf', 3120000, 'application/pdf', 'Under Review',
    'Ex-VP Engineering. Looking for VP/CTO opportunity in FinTech or High-Scale SaaS.',
    TRUE, TRUE
),
(
    '#SAH-1043', 'Sarah Jenkins', 'sarah.jenkins@finance.example', '+1 (312) 554-1029',
    'Strategic Finance', 'https://www.linkedin.com/in/sarah-jenkins-cfo',
    'Chartered Financial Analyst (CFA) with deep corporate development and M&A due diligence experience.',
    'Sarah_Jenkins_Strategic_Finance_Lead.pdf', 1980000, 'application/pdf', 'Placed',
    'Successfully placed as Interim VP of Strategic Finance at Crestview Partners.',
    TRUE, TRUE
),
(
    '#SAH-1044', 'David Ross', 'david.ross@developer.example', '+1 (617) 402-8871',
    'Product & Full-Stack', 'https://www.linkedin.com/in/david-ross-tech',
    'Senior Full-Stack Product Engineer with 8+ years building reactive frontend architectures (React/Node).',
    'David_Ross_Senior_FullStack.docx', 1450000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'New',
    'Applied through public candidate intake portal. Outstanding portfolio.',
    TRUE, TRUE
),
(
    '#SAH-1045', 'Amina Al-Mansoor', 'amina.mansoor@ai-research.example', '+1 (206) 779-3310',
    'AI & Cloud Engineering', 'https://www.linkedin.com/in/amina-al-mansoor-ml',
    'Machine Learning Research Engineer focusing on retrieval-augmented generation (RAG) and embedding fine-tuning.',
    'Amina_AlMansoor_ML_Research.pdf', 2890000, 'application/pdf', 'Archived',
    'Accepted competitive offer at Anthropic. Archive for future principal leads.',
    TRUE, TRUE
)
ON CONFLICT (tracking_id) DO NOTHING;

