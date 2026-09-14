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
  staff_id BIGINT REFERENCES staff(id) ON DELETE CASCADE,
  customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_staff ON sessions(staff_id);
CREATE INDEX IF NOT EXISTS idx_sessions_customer ON sessions(customer_id);

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
  service_interests JSONB DEFAULT '[]'::jsonb,
  needs_help_choosing BOOLEAN DEFAULT FALSE,
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
  service_interests JSONB DEFAULT '[]'::jsonb,
  needs_help_choosing BOOLEAN DEFAULT FALSE,
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
  email TEXT UNIQUE,
  phone TEXT,
  password_hash TEXT,
  vehicle_count INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customers_lead ON customers(lead_id);

CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plate TEXT,
  vehicle_type TEXT,
  status TEXT,
  last_location TEXT,
  latitude TEXT,
  longitude TEXT,
  speed_kph INTEGER,
  fuel_level_pct INTEGER,
  ignition BOOLEAN,
  last_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles(customer_id);

CREATE TABLE IF NOT EXISTS vehicle_positions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  latitude TEXT,
  longitude TEXT,
  speed_kph INTEGER,
  fuel_level_pct INTEGER,
  ignition BOOLEAN,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicle_positions_vehicle ON vehicle_positions(vehicle_id, recorded_at);

CREATE TABLE IF NOT EXISTS geofences (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  latitude TEXT NOT NULL,
  longitude TEXT NOT NULL,
  radius_km DOUBLE PRECISION NOT NULL DEFAULT 1,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS geofence_states (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  geofence_id BIGINT NOT NULL REFERENCES geofences(id) ON DELETE CASCADE,
  vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  inside BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (geofence_id, vehicle_id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL
    CHECK (alert_type IN ('geofence_enter','geofence_exit','overspeed','ignition_on','ignition_off','low_fuel')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status, created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_vehicle ON alerts(vehicle_id);

CREATE TABLE IF NOT EXISTS password_resets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token_hash);

CREATE TABLE IF NOT EXISTS quotations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]',
  total DOUBLE PRECISION NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'ZMW',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','declined','converted')),
  valid_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quotation_id BIGINT REFERENCES quotations(id) ON DELETE SET NULL,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]',
  total DOUBLE PRECISION NOT NULL DEFAULT 0,
  amount_paid DOUBLE PRECISION NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','partial','paid','overdue')),
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deposits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  method TEXT NOT NULL DEFAULT 'cash',
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_deposits_invoice ON deposits(invoice_id);

-- ---------- UPGRADES (idempotent — safe to re-run on an existing database) ----------
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE;
ALTER TABLE sessions ALTER COLUMN staff_id DROP NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_customer ON sessions(customer_id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

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