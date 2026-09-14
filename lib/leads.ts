import { dedupeKeyFor, insert, nowIso, readTable, update } from "./db";
import type { Lead, LeadEvent, Staff } from "./db";

export type LeadInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  company?: string;
  position?: string;
  fleetSize?: string;
  mainChallenge?: string;
  serviceInterest?: string;
  serviceInterests?: string[];
  needsHelpChoosing?: boolean;
  leadSource?: string;
  campaign?: string;
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  agentCode?: string;
  consent?: boolean;
};

export async function upsertLead(input: LeadInput): Promise<Lead | undefined> {
  const key = dedupeKeyFor(input.email, input.phone);
  let leads = await readTable<Lead>("leads");
  const lead = leads.find((l) => l.dedupeKey === key);

  if (lead) {
    const patch: Partial<Lead> & Record<string, unknown> = {
      firstName: input.firstName || lead.firstName,
      lastName: input.lastName || lead.lastName,
      company: input.company ?? lead.company,
      position: input.position ?? lead.position,
      fleetSize: input.fleetSize ?? lead.fleetSize,
      mainChallenge: input.mainChallenge ?? lead.mainChallenge,
      serviceInterest: joinedServiceInterest(input) ?? lead.serviceInterest,
      serviceInterests: input.serviceInterests ?? lead.serviceInterests,
      needsHelpChoosing: input.needsHelpChoosing ?? lead.needsHelpChoosing,
      lastActivityAt: nowIso(),
      updatedAt: nowIso(),
    };
    if (input.email && !lead.email) patch.email = input.email;
    if (input.phone && !lead.phone) {
      patch.phone = input.phone;
      patch.phoneCountryCode = input.phoneCountryCode ?? "+260";
    }
    if (!lead.assignedSalespersonId) {
      patch.assignedSalespersonId = await pickSalesperson(
        leads.filter((l) => l.id !== lead.id)
      );
    }
    const updated = await update<Lead>("leads", lead.id, patch);
    return updated ?? lead;
  }

  const assignedSalespersonId = await pickSalesperson(leads);
  return insert<Lead>("leads", {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email || undefined,
    phone: input.phone || "",
    phoneCountryCode: input.phoneCountryCode || "+260",
    dedupeKey: key,
    company: input.company,
    position: input.position,
    fleetSize: input.fleetSize,
    mainChallenge: input.mainChallenge,
    serviceInterest: joinedServiceInterest(input),
    serviceInterests: input.serviceInterests,
    needsHelpChoosing: input.needsHelpChoosing,
    leadSource: input.leadSource,
    campaign: input.campaign,
    landingPage: input.landingPage,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    utmContent: input.utmContent,
    agentCode: input.agentCode,
    status: "new",
    assignedSalespersonId,
    followUpDate: null,
    lastActivityAt: nowIso(),
    consent: input.consent ?? false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
}

function joinedServiceInterest(input: LeadInput): string | undefined {
  if (input.serviceInterest) return input.serviceInterest;
  if (Array.isArray(input.serviceInterests) && input.serviceInterests.length > 0) {
    return input.serviceInterests.join(", ");
  }
  if (input.needsHelpChoosing) return "I need help choosing";
  return undefined;
}

export async function addLeadEvent(
  leadId: number,
  eventType: string,
  description: string,
  meta: Record<string, unknown> = {}
): Promise<LeadEvent> {
  return insert<LeadEvent>("leadEvents", {
    leadId,
    eventType,
    description,
    meta,
    createdAt: nowIso(),
  });
}

export async function pickSalesperson(
  existingLeads: Array<{ assignedSalespersonId?: number | null }>
): Promise<number | null> {
  const staff = await readTable<Staff>("staff");
  const salespeople = staff.filter(
    (s) => ["sales_manager", "salesperson", "admin"].includes(s.role) && s.active
  );
  if (salespeople.length === 0) return null;
  const counts = new Map<number, number>();
  for (const l of existingLeads) {
    if (l.assignedSalespersonId) {
      counts.set(l.assignedSalespersonId, (counts.get(l.assignedSalespersonId) ?? 0) + 1);
    }
  }
  let best = salespeople[0];
  let bestCount = Infinity;
  for (const sp of salespeople) {
    const c = counts.get(sp.id) ?? 0;
    if (c < bestCount) {
      bestCount = c;
      best = sp;
    }
  }
  return best.id;
}