import type { Customer, DbShape, Staff, Vehicle } from "./dbTypes";
import { hashPassword } from "./passwords";
import { nowIso } from "./dbTypes";

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
    vehicles: [],
    vehiclePositions: [],
    geofences: [],
    geofenceStates: [],
    alerts: [],
    passwordResets: [],
    quotations: [],
    invoices: [],
    deposits: [],
    pageViews: [],
    events: [],
    sessions: [],
    creatorVideos: [],
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

export function seedCustomers(): Customer[] {
  const passwordHash = hashPassword("wazambi123");
  return [
    {
      id: 1,
      leadId: null,
      contactName: "Demo Client",
      company: "Demo Haulage Ltd",
      email: "demo@wazambigps.com",
      phone: "+260 976 000 000",
      passwordHash,
      vehicleCount: 3,
      status: "active",
      active: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];
}

export function seedVehicles(): Vehicle[] {
  const now = new Date();
  const ago = (mins: number) => new Date(now.getTime() - mins * 60_000).toISOString();
  const stamp = ago(60);
  return [
    {
      id: 1,
      customerId: 1,
      name: "Scania Truck 01",
      plate: "BAL 4521",
      vehicleType: "Truck",
      status: "moving",
      lastLocation: "Kafue Road, Lusaka",
      latitude: "-15.4121",
      longitude: "28.2872",
      speedKph: 61,
      fuelLevelPct: 74,
      ignition: true,
      lastUpdate: ago(2),
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 2,
      customerId: 1,
      name: "Toyota Hilux",
      plate: "ABZ 8823",
      vehicleType: "Pickup",
      status: "stopped",
      lastLocation: "ChaChaCha Road, Lusaka",
      latitude: "-15.4182",
      longitude: "28.2934",
      speedKph: 0,
      fuelLevelPct: 38,
      ignition: false,
      lastUpdate: ago(14),
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 3,
      customerId: 1,
      name: "Hino 300 Truck",
      plate: "BAL 1097",
      vehicleType: "Truck",
      status: "stopped",
      lastLocation: "Great North Road, Lusaka",
      latitude: "-15.3651",
      longitude: "28.2625",
      speedKph: 0,
      fuelLevelPct: 12,
      ignition: true,
      lastUpdate: ago(5),
      createdAt: stamp,
      updatedAt: stamp,
    },
  ];
}