import type { DbShape, Staff } from "./dbTypes";
import { hashPassword } from "./passwords";

export function emptyShape(): Omit<DbShape, "settings"> & { settings: Record<string, unknown> } {
  return {
    staff: [],
    leads: [],
    leadEvents: [],
    assessments: [],
    registrations: [],
    emailDeliveries: [],
    quotationRequests: [],
    contactMessages: [],
    followUps: [],
    customers: [],
    pageViews: [],
    events: [],
    sessions: [],
    settings: {},
  };
}

export function seedStaff(): Staff[] {
  return [
    {
      id: 1,
      fullName: "Wazambi Owner",
      email: "owner@wazambigps.com",
      passwordHash: hashPassword("wazambi123"),
      role: "owner",
      active: true,
    },
    {
      id: 2,
      fullName: "Sales Manager",
      email: "sales@wazambigps.com",
      passwordHash: hashPassword("wazambi123"),
      role: "sales_manager",
      active: true,
    },
    {
      id: 3,
      fullName: "Content Manager",
      email: "content@wazambigps.com",
      passwordHash: hashPassword("wazambi123"),
      role: "content_manager",
      active: true,
    },
  ];
}

export function seedStaffSql(): string {
  const rows = seedStaff().map(
    (s) =>
      `('${s.fullName.replace(/'/g, "")}', '${s.email}', '${s.passwordHash}', '${s.role}')`
  );
  return `INSERT INTO staff (full_name, email, password_hash, role) VALUES ${rows.join(",\n")};`;
}