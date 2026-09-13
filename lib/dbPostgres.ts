import type { Pool } from "pg";
import type { CollectionName, DbRow, DbShape, SessionRow } from "./dbTypes";
import { emptyShape } from "./seed";

type FieldDef = { k: string; col: string; t: FieldType };
type FieldType = "text" | "int" | "bool" | "ts" | "jsonb";

type TableDef = { t: string; fields: FieldDef[] };

function tsSql(col: string): string {
  return `TO_CHAR(${col} AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;
}

const TABLES: Record<CollectionName, TableDef> = {
  staff: {
    t: "staff",
    fields: [
      { k: "fullName", col: "full_name", t: "text" },
      { k: "email", col: "email", t: "text" },
      { k: "phone", col: "phone", t: "text" },
      { k: "passwordHash", col: "password_hash", t: "text" },
      { k: "role", col: "role", t: "text" },
      { k: "active", col: "active", t: "bool" },
    ],
  },
  leads: {
    t: "leads",
    fields: [
      { k: "firstName", col: "first_name", t: "text" },
      { k: "lastName", col: "last_name", t: "text" },
      { k: "email", col: "email", t: "text" },
      { k: "phoneCountryCode", col: "phone_country_code", t: "text" },
      { k: "phone", col: "phone", t: "text" },
      { k: "dedupeKey", col: "dedupe_key", t: "text" },
      { k: "company", col: "company", t: "text" },
      { k: "position", col: "position", t: "text" },
      { k: "fleetSize", col: "fleet_size", t: "text" },
      { k: "mainChallenge", col: "main_challenge", t: "text" },
      { k: "serviceInterest", col: "service_interest", t: "text" },
      { k: "leadSource", col: "lead_source", t: "text" },
      { k: "campaign", col: "campaign", t: "text" },
      { k: "utmSource", col: "utm_source", t: "text" },
      { k: "utmMedium", col: "utm_medium", t: "text" },
      { k: "utmCampaign", col: "utm_campaign", t: "text" },
      { k: "utmContent", col: "utm_content", t: "text" },
      { k: "landingPage", col: "landing_page", t: "text" },
      { k: "agentCode", col: "agent_code", t: "text" },
      { k: "status", col: "status", t: "text" },
      { k: "assignedSalespersonId", col: "assigned_salesperson_id", t: "int" },
      { k: "followUpDate", col: "follow_up_date", t: "ts" },
      { k: "followUpNotes", col: "follow_up_notes", t: "text" },
      { k: "lastActivityAt", col: "last_activity_at", t: "ts" },
      { k: "consent", col: "consent", t: "bool" },
      { k: "createdAt", col: "created_at", t: "ts" },
      { k: "updatedAt", col: "updated_at", t: "ts" },
    ],
  },
  leadEvents: {
    t: "lead_events",
    fields: [
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "eventType", col: "event_type", t: "text" },
      { k: "description", col: "description", t: "text" },
      { k: "meta", col: "meta", t: "jsonb" },
      { k: "staffId", col: "staff_id", t: "int" },
      { k: "createdAt", col: "created_at", t: "ts" },
    ],
  },
  assessments: {
    t: "assessments",
    fields: [
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "assessmentType", col: "assessment_type", t: "text" },
      { k: "fleetSize", col: "fleet_size", t: "text" },
      { k: "mainChallenge", col: "main_challenge", t: "text" },
      { k: "serviceInterest", col: "service_interest", t: "text" },
      { k: "details", col: "details", t: "jsonb" },
      { k: "submissionPath", col: "submission_path", t: "text" },
      { k: "createdAt", col: "created_at", t: "ts" },
    ],
  },
  registrations: {
    t: "registrations",
    fields: [
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "courseCode", col: "course_code", t: "text" },
      { k: "emailStatus", col: "email_status", t: "text" },
      { k: "emailSentAt", col: "email_sent_at", t: "ts" },
      { k: "emailOpenedAt", col: "email_opened_at", t: "ts" },
      { k: "createdAt", col: "created_at", t: "ts" },
    ],
  },
  emailDeliveries: {
    t: "email_deliveries",
    fields: [
      { k: "registrationId", col: "registration_id", t: "int" },
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "toEmail", col: "to_email", t: "text" },
      { k: "subject", col: "subject", t: "text" },
      { k: "guideName", col: "guide_name", t: "text" },
      { k: "status", col: "status", t: "text" },
      { k: "errorMessage", col: "error_message", t: "text" },
      { k: "createdAt", col: "created_at", t: "ts" },
    ],
  },
  quotationRequests: {
    t: "quotation_requests",
    fields: [
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "requestedBy", col: "requested_by", t: "int" },
      { k: "salespersonId", col: "salesperson_id", t: "int" },
      { k: "notes", col: "notes", t: "text" },
      { k: "status", col: "status", t: "text" },
      { k: "createdAt", col: "created_at", t: "ts" },
      { k: "updatedAt", col: "updated_at", t: "ts" },
    ],
  },
  contactMessages: {
    t: "contact_messages",
    fields: [
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "fullName", col: "full_name", t: "text" },
      { k: "email", col: "email", t: "text" },
      { k: "phone", col: "phone", t: "text" },
      { k: "subject", col: "subject", t: "text" },
      { k: "message", col: "message", t: "text" },
      { k: "status", col: "status", t: "text" },
      { k: "createdAt", col: "created_at", t: "ts" },
      { k: "updatedAt", col: "updated_at", t: "ts" },
    ],
  },
  followUps: {
    t: "follow_ups",
    fields: [
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "salespersonId", col: "salesperson_id", t: "int" },
      { k: "followUpType", col: "follow_up_type", t: "text" },
      { k: "dueDate", col: "due_date", t: "ts" },
      { k: "status", col: "status", t: "text" },
      { k: "notes", col: "notes", t: "text" },
      { k: "completedAt", col: "completed_at", t: "ts" },
      { k: "createdAt", col: "created_at", t: "ts" },
      { k: "updatedAt", col: "updated_at", t: "ts" },
    ],
  },
  customers: {
    t: "customers",
    fields: [
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "contactName", col: "contact_name", t: "text" },
      { k: "company", col: "company", t: "text" },
      { k: "phone", col: "phone", t: "text" },
      { k: "vehicleCount", col: "vehicle_count", t: "int" },
      { k: "status", col: "status", t: "text" },
      { k: "createdAt", col: "created_at", t: "ts" },
      { k: "updatedAt", col: "updated_at", t: "ts" },
    ],
  },
  pageViews: {
    t: "page_views",
    fields: [
      { k: "path", col: "path", t: "text" },
      { k: "createdAt", col: "created_at", t: "ts" },
    ],
  },
  events: {
    t: "events",
    fields: [
      { k: "eventType", col: "event_type", t: "text" },
      { k: "leadId", col: "lead_id", t: "int" },
      { k: "meta", col: "meta", t: "jsonb" },
      { k: "createdAt", col: "created_at", t: "ts" },
    ],
  },
  sessions: {
    t: "sessions",
    fields: [
      { k: "tokenHash", col: "token_hash", t: "text" },
      { k: "staffId", col: "staff_id", t: "int" },
      { k: "expiresAt", col: "expires_at", t: "ts" },
      { k: "createdAt", col: "created_at", t: "ts" },
    ],
  },
};

const SELECT_COLS: Record<CollectionName, string> = {
  staff: `id::int AS "id", full_name AS "fullName", email, phone, password_hash AS "passwordHash", role, active`,
  leads: `id::int AS "id", first_name AS "firstName", last_name AS "lastName", email, phone_country_code AS "phoneCountryCode", phone, dedupe_key AS "dedupeKey", company, position, fleet_size AS "fleetSize", main_challenge AS "mainChallenge", service_interest AS "serviceInterest", lead_source AS "leadSource", campaign, utm_source AS "utmSource", utm_medium AS "utmMedium", utm_campaign AS "utmCampaign", utm_content AS "utmContent", landing_page AS "landingPage", agent_code AS "agentCode", status, assigned_salesperson_id::int AS "assignedSalespersonId", ${tsSql("follow_up_date")} AS "followUpDate", follow_up_notes AS "followUpNotes", ${tsSql("last_activity_at")} AS "lastActivityAt", consent, ${tsSql("created_at")} AS "createdAt", ${tsSql("updated_at")} AS "updatedAt"`,
  leadEvents: `id::int AS "id", lead_id::int AS "leadId", event_type AS "eventType", description, meta, staff_id::int AS "staffId", ${tsSql("created_at")} AS "createdAt"`,
  assessments: `id::int AS "id", lead_id::int AS "leadId", assessment_type AS "assessmentType", fleet_size AS "fleetSize", main_challenge AS "mainChallenge", service_interest AS "serviceInterest", details, submission_path AS "submissionPath", ${tsSql("created_at")} AS "createdAt"`,
  registrations: `id::int AS "id", lead_id::int AS "leadId", course_code AS "courseCode", email_status AS "emailStatus", ${tsSql("email_sent_at")} AS "emailSentAt", ${tsSql("email_opened_at")} AS "emailOpenedAt", ${tsSql("created_at")} AS "createdAt"`,
  emailDeliveries: `id::int AS "id", registration_id::int AS "registrationId", lead_id::int AS "leadId", to_email AS "toEmail", subject, guide_name AS "guideName", status, error_message AS "errorMessage", ${tsSql("created_at")} AS "createdAt"`,
  quotationRequests: `id::int AS "id", lead_id::int AS "leadId", requested_by::int AS "requestedBy", salesperson_id::int AS "salespersonId", notes, status, ${tsSql("created_at")} AS "createdAt", ${tsSql("updated_at")} AS "updatedAt"`,
  contactMessages: `id::int AS "id", lead_id::int AS "leadId", full_name AS "fullName", email, phone, subject, message, status, ${tsSql("created_at")} AS "createdAt", ${tsSql("updated_at")} AS "updatedAt"`,
  followUps: `id::int AS "id", lead_id::int AS "leadId", salesperson_id::int AS "salespersonId", follow_up_type AS "followUpType", ${tsSql("due_date")} AS "dueDate", status, notes, ${tsSql("completed_at")} AS "completedAt", ${tsSql("created_at")} AS "createdAt", ${tsSql("updated_at")} AS "updatedAt"`,
  customers: `id::int AS "id", lead_id::int AS "leadId", contact_name AS "contactName", company, phone, vehicle_count::int AS "vehicleCount", status, ${tsSql("created_at")} AS "createdAt", ${tsSql("updated_at")} AS "updatedAt"`,
  pageViews: `id::int AS "id", path, ${tsSql("created_at")} AS "createdAt"`,
  events: `id::int AS "id", event_type AS "eventType", lead_id::int AS "leadId", meta, ${tsSql("created_at")} AS "createdAt"`,
  sessions: `id::int AS "id", token_hash AS "tokenHash", staff_id::int AS "staffId", ${tsSql("expires_at")} AS "expiresAt", ${tsSql("created_at")} AS "createdAt"`,
};

type PgClient = { query: (text: string, values?: unknown[]) => Promise<{ rows: unknown[] }> };

let poolPromise: Promise<PgClient> | null = null;

async function getPool(): Promise<PgClient> {
  if (!poolPromise) {
    poolPromise = (async () => {
      const { Pool } = await import("pg");
      const p = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 3,
        idleTimeoutMillis: 30_000,
        ...(needsTls(process.env.DATABASE_URL) ? { ssl: { rejectUnauthorized: false } } : {}),
      });
      return p as unknown as PgClient;
    })();
  }
  return poolPromise;
}

function needsTls(url: string | undefined): boolean {
  if (!url) return false;
  if (process.env.DATABASE_SSL === "true") return true;
  if (process.env.DATABASE_SSL === "false") return false;
  return /\.(supabase\.co|neon\.tech|fly\.io|render\.com)$/.test(url);
}

function bind(field: FieldDef, v: unknown): unknown {
  if (v === undefined || v === null) return null;
  switch (field.t) {
    case "jsonb":
      return JSON.stringify(v);
    case "ts":
      return new Date(v as string);
    case "bool":
      return v ? true : false;
    case "int":
      return Number(v);
    default:
      return v;
  }
}

function castSuffix(field: FieldDef): string {
  return field.t === "jsonb" ? "::jsonb" : "";
}

export async function readTable<T extends DbRow>(collection: CollectionName): Promise<T[]> {
  const client = await getPool();
  const res = await client.query(
    `SELECT ${SELECT_COLS[collection]} FROM ${TABLES[collection].t} ORDER BY id`
  );
  return (res.rows as unknown[]) as T[];
}

export async function readDb(): Promise<DbShape> {
  const [all, settings] = await Promise.all([readAllCollections(), getSettings()]);
  return { ...emptyShape(), ...all, settings };
}

async function readAllCollections(): Promise<Omit<DbShape, "settings">> {
  const keys: CollectionName[] = [
    "staff",
    "leads",
    "leadEvents",
    "assessments",
    "registrations",
    "emailDeliveries",
    "quotationRequests",
    "contactMessages",
    "followUps",
    "customers",
    "pageViews",
    "events",
    "sessions",
  ];
  const results: unknown[] = [];
  for (const k of keys) {
    results.push(
      k === "sessions" ? await readTable<SessionRow>(k) : await readTable<DbRow>(k)
    );
  }
  const shape: Record<string, unknown> = {};
  keys.forEach((k, i) => {
    shape[k] =
      k === "sessions"
        ? (results[i] as SessionRow[])
        : results[i];
  });
  return shape as Omit<DbShape, "settings">;
}

export async function insert<T extends DbRow>(collection: CollectionName, item: Omit<T, "id">): Promise<T> {
  const def = TABLES[collection];
  const client = await getPool();
  const fields = def.fields.filter((f) => (item as Record<string, unknown>)[f.k] !== undefined);
  const cols = fields.map((f) => f.col);
  const vals = fields.map((f, i) => `$${i + 1}${castSuffix(f)}`);
  const params = fields.map((f) => bind(f, (item as Record<string, unknown>)[f.k]));
  const res = await client.query(
    `INSERT INTO ${def.t} (${cols.join(", ")}) VALUES (${vals.join(", ")})
     RETURNING id::int AS "id"`,
    params
  );
  const id = Number((res.rows[0] as { id: number })?.id);
  const rows = await readTable<T>(collection);
  const found = rows.find((r) => r.id === id);
  if (!found) throw new Error(`Insert into ${collection} returned no row`);
  return found;
}

export async function update<T extends DbRow>(
  collection: CollectionName,
  id: number,
  patch: Partial<T>
): Promise<T | null> {
  const def = TABLES[collection];
  const client = await getPool();
  const fields = def.fields.filter((f) => (patch as Record<string, unknown>)[f.k] !== undefined);
  if (fields.length === 0) {
    const rows = await readTable<T>(collection);
    return rows.find((r) => r.id === id) ?? null;
  }
  const sets = fields.map((f, i) => `${f.col} = $${i + 1}${castSuffix(f)}`);
  const params = [
    ...fields.map((f) => bind(f, (patch as Record<string, unknown>)[f.k])),
    id,
  ];
  await client.query(
    `UPDATE ${def.t} SET ${sets.join(", ")} WHERE id = $${fields.length + 1} RETURNING id::int AS "id"`,
    params
  );
  const rows = await readTable<T>(collection);
  return rows.find((r) => r.id === id) ?? null;
}

export async function remove(collection: CollectionName, id: number): Promise<boolean> {
  const def = TABLES[collection];
  const client = await getPool();
  const res = await client.query(`DELETE FROM ${def.t} WHERE id = $1 RETURNING id::int AS "id"`, [id]);
  return (res.rows.length ?? 0) > 0;
}

export async function getSettings(): Promise<Record<string, unknown>> {
  const client = await getPool();
  const res = await client.query(`SELECT setting_key AS "key", setting_value AS value FROM system_settings`);
  const out: Record<string, unknown> = {};
  for (const row of res.rows as Array<{ key: string; value: unknown }>) {
    out[row.key] = row.value;
  }
  return out;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const client = await getPool();
  await client.query(
    `INSERT INTO system_settings (setting_key, setting_value) VALUES ($1, $2::jsonb)
     ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW()`,
    [key, JSON.stringify(value ?? {})]
  );
}