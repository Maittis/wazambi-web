export type Staff = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: "owner" | "admin" | "sales_manager" | "salesperson" | "content_manager";
  active: boolean;
};

export type Lead = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneCountryCode: string;
  phone: string;
  dedupeKey: string;
  company?: string;
  position?: string;
  fleetSize?: string;
  mainChallenge?: string;
  mainChallenges?: string[];
  stillExploring?: boolean;
  serviceInterest?: string;
  serviceInterests?: string[];
  needsHelpChoosing?: boolean;
  leadSource?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  landingPage?: string;
  agentCode?: string;
  status: string;
  assignedSalespersonId?: number | null;
  followUpDate?: string | null;
  followUpNotes?: string;
  lastActivityAt: string;
  consent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LeadEvent = {
  id: number;
  leadId: number;
  eventType: string;
  description: string;
  meta: Record<string, unknown>;
  staffId?: number;
  createdAt: string;
};

export type Assessment = {
  id: number;
  leadId: number;
  assessmentType: "fleet" | "fuel";
  fleetSize?: string;
  mainChallenge?: string;
  mainChallenges?: string[];
  stillExploring?: boolean;
  serviceInterest?: string;
  serviceInterests?: string[];
  needsHelpChoosing?: boolean;
  details: Record<string, unknown>;
  submissionPath: string;
  createdAt: string;
};

export type Registration = {
  id: number;
  leadId: number;
  courseCode: string;
  emailStatus: string;
  emailSentAt?: string;
  emailOpenedAt?: string;
  createdAt: string;
};

export type EmailDelivery = {
  id: number;
  registrationId?: number;
  leadId: number;
  toEmail: string;
  subject: string;
  guideName: string;
  status: string;
  errorMessage?: string;
  createdAt: string;
};

export type QuotationRequest = {
  id: number;
  leadId: number;
  requestedBy?: number;
  salespersonId?: number;
  notes?: string;
  status: string;
  createdAt: string;
};

export type ContactMessage = {
  id: number;
  leadId?: number;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
};

export type FollowUp = {
  id: number;
  leadId: number;
  salespersonId: number;
  followUpType: string;
  dueDate: string;
  status: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
};

export type Customer = {
  id: number;
  leadId?: number | null;
  contactName: string;
  company?: string;
  phone?: string;
  email?: string;
  passwordHash?: string;
  active: boolean;
  vehicleCount?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Vehicle = {
  id: number;
  customerId: number;
  name: string;
  plate?: string;
  vehicleType?: string;
  status: string;
  lastLocation?: string;
  latitude?: string;
  longitude?: string;
  speedKph?: number;
  fuelLevelPct?: number;
  ignition?: boolean;
  lastUpdate?: string;
  createdAt: string;
  updatedAt: string;
};

export type VehiclePosition = {
  id: number;
  vehicleId: number;
  latitude?: string;
  longitude?: string;
  speedKph?: number;
  fuelLevelPct?: number;
  ignition?: boolean;
  recordedAt: string;
  createdAt: string;
};

export type Geofence = {
  id: number;
  customerId?: number | null;
  name: string;
  latitude: string;
  longitude: string;
  radiusKm: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GeofenceState = {
  id: number;
  geofenceId: number;
  vehicleId: number;
  inside: boolean;
  updatedAt: string;
};

export type AlertRow = {
  id: number;
  vehicleId?: number | null;
  customerId?: number | null;
  alertType: "geofence_enter" | "geofence_exit" | "overspeed" | "ignition_on" | "ignition_off" | "low_fuel";
  message: string;
  status: "open" | "resolved";
  createdAt: string;
  resolvedAt?: string;
};

export type QuotationItem = {
  description: string;
  qty: number;
  unitPrice: number;
};

export type Quotation = DbRow & {
  customerId?: number | null;
  number: string;
  items: QuotationItem[];
  total: number;
  currency: string;
  status: "draft" | "sent" | "accepted" | "declined" | "converted";
  validUntil?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Invoice = DbRow & {
  quotationId?: number | null;
  customerId?: number | null;
  number: string;
  items: QuotationItem[];
  total: number;
  amountPaid: number;
  status: "draft" | "sent" | "partial" | "paid" | "overdue";
  dueAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Deposit = DbRow & {
  invoiceId: number;
  amount: number;
  method: string;
  reference?: string | null;
  createdAt: string;
};

export type DbRow = { id: number };

export type PasswordReset = DbRow & {
  email: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
};

export type SessionRow = DbRow & {
  tokenHash: string;
  staffId?: number | null;
  customerId?: number | null;
  expiresAt: string;
  createdAt: string;
};

export type WzEvent = DbRow & {
  eventType: string;
  leadId?: number;
  meta: Record<string, unknown>;
  createdAt: string;
};

export type PageView = DbRow & {
  path: string;
  createdAt: string;
};

export type CreatorVideo = DbRow & {
  leadId: number;
  creatorCode: string;
  creatorName?: string;
  phone: string;
  email?: string;
  platform: string;
  videoTitle: string;
  videoUrl?: string;
  videoPath?: string;
  caption?: string;
  publishedUrl?: string;
  publishedDate?: string;
  note?: string;
  status: string;
  feedback?: string;
  finalPostUrl?: string;
  submittedAt: string;
  underReviewAt?: string;
  decidedAt?: string;
};

export type CollectionName =
  | "staff"
  | "leads"
  | "leadEvents"
  | "assessments"
  | "registrations"
  | "emailDeliveries"
  | "quotationRequests"
  | "contactMessages"
  | "followUps"
  | "customers"
  | "vehicles"
  | "vehiclePositions"
  | "geofences"
  | "geofenceStates"
  | "alerts"
  | "passwordResets"
  | "quotations"
  | "invoices"
  | "deposits"
  | "pageViews"
  | "events"
  | "sessions"
  | "creatorVideos";

export type DbShape = {
  staff: Staff[];
  leads: Lead[];
  leadEvents: LeadEvent[];
  assessments: Assessment[];
  registrations: Registration[];
  emailDeliveries: EmailDelivery[];
  quotationRequests: QuotationRequest[];
  contactMessages: ContactMessage[];
  followUps: FollowUp[];
  customers: Customer[];
  vehicles: Vehicle[];
  vehiclePositions: VehiclePosition[];
  geofences: Geofence[];
  geofenceStates: GeofenceState[];
  alerts: AlertRow[];
  passwordResets: PasswordReset[];
  quotations: Quotation[];
  invoices: Invoice[];
  deposits: Deposit[];
  pageViews: Array<{ id: number; path: string; createdAt: string }>;
  events: Array<{ id: number; eventType: string; leadId?: number; meta: Record<string, unknown>; createdAt: string }>;
  sessions: Array<{ tokenHash: string; staffId?: number | null; customerId?: number | null; expiresAt: string; createdAt: string }>;
  creatorVideos: CreatorVideo[];
  settings: Record<string, unknown>;
};

export function dedupeKeyFor(email?: string | null, phone?: string | null): string {
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length >= 5) return `phone:${digits}`;
  }
  if (email) return `email:${email.trim().toLowerCase()}`;
  return `none:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}