import crypto from "crypto";
import { cookies } from "next/headers";
import { insert, nowIso, readTable, remove } from "./db";
import type { Customer, SessionRow, Staff } from "./db";

const SESSION_COOKIE = "wz_session";
const SESSION_DAYS = 7;

async function newSession(owner: { staffId: number } | { customerId: number }): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const sessions = await readTable<SessionRow>("sessions");
  const now = Date.now();
  const ownerId = "staffId" in owner ? owner.staffId : owner.customerId;
  for (const s of sessions) {
    const rowOwnerId = "staffId" in owner ? s.staffId : s.customerId;
    if (rowOwnerId === ownerId && new Date(s.expiresAt).getTime() > now) {
      await remove("sessions", s.id);
    }
  }
  await insert<SessionRow>("sessions", {
    tokenHash,
    ...(owner as { staffId: number } | { customerId: number }),
    expiresAt: expiresAt.toISOString(),
    createdAt: nowIso(),
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return token;
}

export async function createSession(staffId: number): Promise<string> {
  return newSession({ staffId });
}

export async function createCustomerSession(customerId: number): Promise<string> {
  return newSession({ customerId });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const sessions = await readTable<SessionRow>("sessions");
    const session = sessions.find((s) => s.tokenHash === tokenHash);
    if (session) await remove("sessions", session.id);
  }
  store.delete(SESSION_COOKIE);
}

export async function getSessionStaff(): Promise<Staff | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const sessions = await readTable<SessionRow>("sessions");
  const session = sessions.find((s) => s.tokenHash === tokenHash);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;
  if (!session.staffId) return null;
  const staffList = await readTable<Staff>("staff");
  const staff = staffList.find((s) => s.id === session.staffId && s.active);
  return staff ?? null;
}

export async function getSessionCustomer(): Promise<Customer | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const sessions = await readTable<SessionRow>("sessions");
  const session = sessions.find((s) => s.tokenHash === tokenHash);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;
  if (!session.customerId) return null;
  const customers = await readTable<Customer>("customers");
  const customer = customers.find((c) => c.id === session.customerId && c.active);
  return customer ?? null;
}

export async function getSessionUser(): Promise<
  | { kind: "staff"; id: number; fullName: string; email: string; role: string }
  | { kind: "customer"; id: number; fullName: string; email: string }
  | null
> {
  const staff = await getSessionStaff();
  if (staff) {
    return { kind: "staff", id: staff.id, fullName: staff.fullName, email: staff.email, role: staff.role };
  }
  const customer = await getSessionCustomer();
  if (customer) {
    return { kind: "customer", id: customer.id, fullName: customer.contactName, email: customer.email ?? "" };
  }
  return null;
}

export async function requireStaff(
  roles: Array<Staff["role"]> = ["owner", "admin", "sales_manager", "salesperson", "content_manager"]
): Promise<Staff> {
  const staff = await getSessionStaff();
  if (!staff) {
    throw new Error("UNAUTHORIZED");
  }
  if (!roles.includes(staff.role)) {
    throw new Error("FORBIDDEN");
  }
  return staff;
}

export function canManageContent(staff: Staff): boolean {
  return ["owner", "admin", "content_manager"].includes(staff.role);
}

export function isSalesRole(staff: Staff): boolean {
  return ["owner", "admin", "sales_manager", "salesperson"].includes(staff.role);
}

export { insert };