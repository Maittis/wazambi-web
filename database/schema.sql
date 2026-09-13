-- ============================================================
-- WAZAMBI GPS — OPERATIVE POSTGRES SCHEMA (Supabase-compatible)
-- Mirrors the application data model consumed by lib/db.ts.
-- Run this in your Supabase project (SQL Editor) or apply via a migration.
-- Note: root schema.sql keeps the fuller normalized design as a reference;
-- this file is the schema the app actually reads/writes.
-- ============================================================

-- ---------- STAFF / AUTH ----------
CREATE TABLE IF NOT EXISTS staff (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'salesperson'
    CHECK (role IN ('owner','admin','sales_manager','salesperson','content_manager')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_staff ON sessions(staff_id);

-- ---------- EDITABLE CONTENT ----------
CREATE TABLE IF NOT EXISTS system_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- LEADS + ACTIVITY ----------
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone_country_code TEXT DEFAULT '+260',
  phone TEXT,
  dedupe_key TEXT NOT NULL UNIQUE,
  company TEXT,
  position TEXT,
  fleet_size TEXT,
  main_challenge TEXT,
  service_interest TEXT,
  lead_source TEXT,
  campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  landing_page TEXT,
  agent_code TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_salesperson_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  follow_up_date TIMESTAMPTZ,
  follow_up_notes TEXT,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_dedupe ON leads(dedupe_key);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_salesperson ON leads(assigned_salesperson_id);

CREATE TABLE IF NOT EXISTS lead_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT,
  meta JSONB DEFAULT '{}',
  staff_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lead_events_lead ON lead_events(lead_id, created_at);

-- ---------- CONVERSIONS ----------
CREATE TABLE IF NOT EXISTS assessments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('fleet','fuel')),
  fleet_size TEXT,
  main_challenge TEXT,
  service_interest TEXT,
  details JSONB DEFAULT '{}',
  submission_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_assessments_lead ON assessments(lead_id);

CREATE TABLE IF NOT EXISTS registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL CHECK (course_code IN ('gps_tracking','fuel_monitoring','fleet_management')),
  email_status TEXT NOT NULL DEFAULT 'pending',
  email_sent_at TIMESTAMPTZ,
  email_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lead_id, course_code)
);
CREATE INDEX IF NOT EXISTS idx_registrations_course ON registrations(course_code);

CREATE TABLE IF NOT EXISTS email_deliveries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  registration_id BIGINT REFERENCES registrations(id) ON DELETE SET NULL,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  subject TEXT,
  guide_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_lead ON email_deliveries(lead_id);

CREATE TABLE IF NOT EXISTS quotation_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  requested_by BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  salesperson_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  vehicle_count INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customers_lead ON customers(lead_id);

CREATE TABLE IF NOT EXISTS follow_ups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  salesperson_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  follow_up_type TEXT NOT NULL DEFAULT 'phone_call'
    CHECK (follow_up_type IN ('phone_call','whatsapp','email','demonstration','assessment','quotation','installation_discussion')),
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due ON follow_ups(status, due_date);

-- ---------- ANALYTICS ----------
CREATE TABLE IF NOT EXISTS page_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path, created_at);

CREATE TABLE IF NOT EXISTS events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type TEXT NOT NULL,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type, created_at);

-- ---------- DEFAULT DATA (apply only on a fresh database) ----------
-- Change these credentials before going live.
-- INSERT INTO staff (full_name, email, password_hash, role)
-- VALUES ('Wazambi Owner', 'owner@wazambigps.com', '<scrypt salt:hash>', 'owner');

-- INSERT INTO system_settings (setting_key, setting_value) VALUES
-- ('content', '{}');