-- ============================================================
-- WAZAMBI GPS CUSTOMER WEBSITE + CRM DATABASE SCHEMA
-- Target: PostgreSQL (Supabase) / MySQL-compatible field shapes
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE staff_role AS ENUM
  ('owner', 'admin', 'sales_manager', 'salesperson', 'content_manager');

CREATE TYPE lead_status AS ENUM
  ('new', 'contacted', 'potential', 'serious', 'follow_up',
   'assessment_booked', 'demonstration_booked', 'quotation_requested',
   'quotation_sent', 'deposit_paid', 'sold', 'not_interested', 'invalid');

CREATE TYPE fleet_size AS ENUM
  ('1_4', '5_10', '11_20', '21_50', '50_plus');

CREATE TYPE main_challenge AS ENUM
  ('vehicle_theft', 'fuel_theft_or_high_fuel_costs', 'unauthorized_vehicle_use',
   'dangerous_driving', 'managing_several_vehicles', 'vehicle_maintenance',
   'unreliable_gps_tracking', 'still_exploring');

CREATE TYPE service_type AS ENUM
  ('gps_tracking', 'fuel_monitoring', 'fleet_management');

CREATE TYPE course_code AS ENUM
  ('gps_tracking', 'fuel_monitoring', 'fleet_management');

CREATE TYPE assessment_type AS ENUM
  ('fleet', 'fuel');

CREATE TYPE follow_up_type AS ENUM
  ('phone_call', 'whatsapp', 'email', 'demonstration', 'assessment', 'quotation', 'installation_discussion');

CREATE TYPE follow_up_status AS ENUM
  ('pending', 'completed', 'missed', 'cancelled');

CREATE TYPE email_status AS ENUM
  ('pending', 'sent', 'failed', 'opened', 'clicked', 'bounced');

CREATE TYPE quotation_status AS ENUM
  ('draft', 'requested', 'sent', 'accepted', 'rejected', 'expired');

CREATE TYPE message_status AS ENUM
  ('new', 'read', 'replied', 'closed');

CREATE TYPE customer_status AS ENUM
  ('active', 'installing', 'suspended', 'cancelled');

-- ============================================================
-- STAFF, AUTH AND PERMISSIONS
-- ============================================================

CREATE TABLE staff (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role staff_role NOT NULL DEFAULT 'salesperson',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE staff_sessions (
  id BIGSERIAL PRIMARY KEY,
  staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  ip TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE staff_permissions (
  id BIGSERIAL PRIMARY KEY,
  staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  UNIQUE (staff_id, permission)
);

CREATE INDEX idx_staff_role ON staff(role);

-- ============================================================
-- SITE CONFIG / EDITABLE CONTENT
-- ============================================================

CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  setting_group TEXT NOT NULL,
  updated_by BIGINT REFERENCES staff(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE announcement (
  id BIGSERIAL PRIMARY KEY,
  badge_text TEXT,
  banner_text TEXT NOT NULL,
  link_url TEXT NOT NULL DEFAULT '/',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  updated_by BIGINT REFERENCES staff(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE site_stats (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value NUMERIC(12,2) NOT NULL,
  prefix TEXT DEFAULT '',
  suffix TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by BIGINT REFERENCES staff(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE home_video (
  id BIGSERIAL PRIMARY KEY,
  video_url TEXT,
  poster_image_url TEXT,
  caption TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by BIGINT REFERENCES staff(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  photo_url TEXT,
  video_url TEXT,
  quote TEXT NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE customer_results (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  company TEXT,
  industry TEXT,
  problem TEXT,
  solution TEXT,
  result TEXT,
  story TEXT,
  images JSONB DEFAULT '[]',
  video_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE faqs (
  id BIGSERIAL PRIMARY KEY,
  section TEXT NOT NULL DEFAULT 'homepage',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faqs_section ON faqs(section);

-- ============================================================
-- FLEET ACADEMY: COURSES, LESSONS, PDF GUIDES, EMAIL TEMPLATES
-- ============================================================

CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  course_code course_code NOT NULL UNIQUE,
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  short_description TEXT,
  hero_video_url TEXT,
  cover_image_url TEXT,
  icon_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lessons (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_seconds INT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE pdf_guides (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  version TEXT DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  uploaded_by BIGINT REFERENCES staff(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE email_templates (
  id BIGSERIAL PRIMARY KEY,
  template_key TEXT NOT NULL UNIQUE,
  course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  subject_template TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  sender_email TEXT NOT NULL DEFAULT 'academy@wazambigps.com',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by BIGINT REFERENCES staff(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LEADS, CAMPAIGNS, ACTIVITY
-- ============================================================

CREATE TABLE campaigns (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT,
  medium TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone_country_code TEXT DEFAULT '+260',
  phone TEXT,
  dedupe_key TEXT NOT NULL UNIQUE,
  company TEXT,
  position TEXT,
  fleet_size fleet_size,
  main_challenge main_challenge,
  service_interest service_type,
  lead_source TEXT,
  campaign_id BIGINT REFERENCES campaigns(id),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  landing_page TEXT,
  agent_code TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_salesperson_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  follow_up_date TIMESTAMPTZ,
  follow_up_notes TEXT,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  converted_customer_id BIGINT,
  consent_communication BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_salesperson ON leads(assigned_salesperson_id);
CREATE INDEX idx_leads_follow_up ON leads(follow_up_date);
CREATE INDEX idx_leads_created ON leads(created_at);

CREATE TABLE lead_events (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT,
  meta JSONB DEFAULT '{}',
  staff_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_events_lead ON lead_events(lead_id, created_at);

-- ============================================================
-- CONVERSION: ASSESSMENTS, QUOTATIONS, CONTACT, CUSTOMERS
-- ============================================================

CREATE TABLE assessments (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  assessment_type assessment_type NOT NULL,
  fleet_size fleet_size,
  main_challenge main_challenge,
  service_interest service_type,
  details JSONB DEFAULT '{}',
  submission_path TEXT,
  assigned_salesperson_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_lead ON assessments(lead_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);

CREATE TABLE quotation_requests (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  customer_id BIGINT,
  requested_by BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  assigned_salesperson_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  items JSONB DEFAULT '[]',
  amount NUMERIC(14,2),
  currency TEXT DEFAULT 'ZMW',
  status quotation_status NOT NULL DEFAULT 'requested',
  valid_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status message_status NOT NULL DEFAULT 'new',
  assigned_staff_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  reply_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  company TEXT,
  install_address TEXT,
  vehicle_count INT,
  services service_type[] DEFAULT '{}',
  contract_type TEXT,
  contract_start_date DATE,
  agent_code TEXT,
  status customer_status NOT NULL DEFAULT 'active',
  onboarding_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leads ADD CONSTRAINT fk_leads_customer
  FOREIGN KEY (converted_customer_id) REFERENCES customers(id) ON DELETE SET NULL;

CREATE INDEX idx_customers_lead ON customers(lead_id);

CREATE TABLE follow_ups (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  salesperson_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  follow_up_type follow_up_type NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  status follow_up_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_follow_ups_due ON follow_ups(status, due_date);
CREATE INDEX idx_follow_ups_salesperson ON follow_ups(salesperson_id);

-- ============================================================
-- COURSE REGISTRATIONS + EMAIL DELIVERY
-- ============================================================

CREATE TABLE course_registrations (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  course_code course_code NOT NULL,
  email_status email_status NOT NULL DEFAULT 'pending',
  email_sent_at TIMESTAMPTZ,
  email_opened_at TIMESTAMPTZ,
  pdf_link_clicked_at TIMESTAMPTZ,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lead_id, course_id)
);

CREATE INDEX idx_registrations_course ON course_registrations(course_id);
CREATE INDEX idx_registrations_created ON course_registrations(created_at);

CREATE TABLE email_deliveries (
  id BIGSERIAL PRIMARY KEY,
  registration_id BIGINT REFERENCES course_registrations(id) ON DELETE SET NULL,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  template_key TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  pdf_guide_id BIGINT REFERENCES pdf_guides(id) ON DELETE SET NULL,
  status email_status NOT NULL DEFAULT 'pending',
  error_message TEXT,
  provider_message_id TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_deliveries_lead ON email_deliveries(lead_id);
CREATE INDEX idx_email_deliveries_status ON email_deliveries(status);

CREATE TABLE email_events (
  id BIGSERIAL PRIMARY KEY,
  email_delivery_id BIGINT REFERENCES email_deliveries(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta JSONB DEFAULT '{}'
);

-- ============================================================
-- ANALYTICS
-- ============================================================

CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  session_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  device_type TEXT,
  country TEXT,
  city TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_page_views_path ON page_views(path, viewed_at);
CREATE INDEX idx_page_views_session ON page_views(session_id);

CREATE TABLE site_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  path TEXT,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  session_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  device_type TEXT,
  country TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_events_type ON site_events(event_type, created_at);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_staff_updated BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_follow_ups_updated BEFORE UPDATE ON follow_ups
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_quotation_requests_updated BEFORE UPDATE ON quotation_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- DEFAULT DATA
-- ============================================================

INSERT INTO courses (slug, course_code, title, headline, short_description, sort_order) VALUES
  ('academy/gps-tracking', 'gps_tracking',
   'GPS Tracking Course',
   'Do you really know where your vehicles go after they leave?',
   'Learn how live tracking, geofences, trip history and alerts protect every vehicle.', 1),
  ('academy/fuel-monitoring', 'fuel_monitoring',
   'Fuel Monitoring Course',
   'How much money could your business be losing through fuel?',
   'Learn how to monitor fuel levels, refuelling and suspicious drops with records.', 2),
  ('academy/fleet-management', 'fleet_management',
   'Fleet Management Course',
   'Your fleet cannot improve if you cannot see what is happening.',
   'Learn how to organise vehicles, drivers, maintenance and reports in one system.', 3);

INSERT INTO email_templates (template_key, course_id, subject_template, body_html, sender_email) VALUES
  ('gps_guide', 1, '[First Name], your GPS Tracking Guide is ready',
   '<p>Hi [First Name],</p><p>Your free Wazambi GPS Tracking Guide is ready to download.</p>',
   'academy@wazambigps.com'),
  ('fuel_guide', 2, '[First Name], your Fuel Control Guide is ready',
   '<p>Hi [First Name],</p><p>Your free Wazambi Fuel Control Guide is ready to download.</p>',
   'academy@wazambigps.com'),
  ('fleet_guide', 3, '[First Name], your Fleet Management Guide is ready',
   '<p>Hi [First Name],</p><p>Your free Wazambi Fleet Management Guide is ready to download.</p>',
   'academy@wazambigps.com');

INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
  ('branding', '{"primary_color":"#0A1633","accent_color":"#1E5EFF","cta_color":"#FFB400","light_color":"#FFFFFF"}', 'brand'),
  ('contact', '{"phone":"","email":"","whatsapp_number":"","whatsapp_message":"Hello Wazambi GPS. I would like help choosing the right solution for my vehicles."}', 'contact'),
  ('social_links', '{"facebook":"","instagram":"","linkedin":"","tiktok":"","youtube":""}', 'contact'),
  ('office_locations', '[]', 'contact'),
  ('external_links', '{"client_login":"","agent_login":"","agent_app":"https://wazambi-gps.vercel.app/","agent_admin":"https://wazambi-backend.vercel.app/admin"}', 'links');

INSERT INTO announcement (banner_text, link_url, is_published) VALUES
  ('NEW: WAZAMBI GPS AGENT PROGRAM NOW OPEN — ONLY 100 AGENTS WILL BE SELECTED', '/agents', TRUE);