"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge, Modal, Select, StatCard, Td, Th, PrimaryBtn, GhostBtn } from "@/components/admin/ui";
import Tracking from "@/components/admin/Tracking";
import Alerts from "@/components/admin/Alerts";
import Invoicing from "@/components/admin/Invoicing";

type Staff = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "◉" },
  { key: "leads", label: "All Leads", icon: "▤" },
  { key: "fleet", label: "Fleet Assessments", icon: "▣" },
  { key: "fuel", label: "Fuel Assessments", icon: "▣" },
  { key: "registrations", label: "Course Registrations", icon: "✎" },
  { key: "quotations", label: "Quotation Requests", icon: "₭" },
  { key: "contacts", label: "Contact Messages", icon: "✉" },
  { key: "customers", label: "Customers", icon: "★" },
  { key: "invoicing", label: "Invoicing", icon: "₭" },
  { key: "tracking", label: "Live Tracking", icon: "◎" },
  { key: "alerts", label: "Alerts", icon: "!" },
  { key: "followups", label: "Follow-ups", icon: "→" },
  { key: "agentApplications", label: "Agent Applications", icon: "★" },
  { key: "creatorApplications", label: "Creator Applications", icon: "★" },
  { key: "salespeople", label: "Salespeople", icon: "●" },
  { key: "emails", label: "Email Delivery", icon: "✉" },
  { key: "content", label: "Website Content", icon: "✎" },
  { key: "reports", label: "Reports", icon: "◧" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

const roleNav: Record<string, string[]> = {
  dashboard: ["owner", "admin", "sales_manager", "salesperson", "content_manager"],
  leads: ["owner", "admin", "sales_manager", "salesperson"],
  fleet: ["owner", "admin", "sales_manager", "salesperson"],
  fuel: ["owner", "admin", "sales_manager", "salesperson"],
  registrations: ["owner", "admin", "sales_manager", "salesperson"],
  quotations: ["owner", "admin", "sales_manager", "salesperson"],
  contacts: ["owner", "admin", "sales_manager", "salesperson"],
  customers: ["owner", "admin", "sales_manager", "salesperson"],
  invoicing: ["owner", "admin", "sales_manager"],
  tracking: ["owner", "admin", "sales_manager", "salesperson"],
  alerts: ["owner", "admin", "sales_manager", "salesperson"],
  followups: ["owner", "admin", "sales_manager", "salesperson"],
  agentApplications: ["owner", "admin"],
  creatorApplications: ["owner", "admin"],
  salespeople: ["owner", "admin"],
  emails: ["owner", "admin", "sales_manager", "salesperson"],
  content: ["owner", "admin", "content_manager"],
  reports: ["owner", "admin", "sales_manager"],
  settings: ["owner", "admin"],
};

const leadStatuses = [
  "new", "contacted", "potential", "serious", "follow_up", "assessment_booked",
  "demonstration_booked", "quotation_requested", "quotation_sent", "deposit_paid",
  "sold", "not_interested", "invalid",
];

const followUpTypes = [
  "phone_call", "whatsapp", "email", "demonstration", "assessment", "quotation", "installation_discussion",
];

export default function Dashboard() {
  const router = useRouter();
  const [me, setMe] = useState<Staff | null>(null);
  const [section, setSection] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (resources: string[]) => {
    setLoading(true);
    const out: Record<string, any> = {};
    for (const r of resources) {
      try {
        const res = await fetch(`/api/data?resource=${r}`);
        if (res.ok) {
          const json = await res.json();
          out[r] = json.data ?? [];
        }
      } catch {
        /* ignore */
      }
    }
    setData((prev) => ({ ...prev, ...out }));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok || d.kind !== "staff") {
          router.replace(d.kind === "customer" ? "/portal" : "/customer-admin/login");
          return;
        }
        setMe(d.staff);
      })
      .catch(() => router.replace("/customer-admin/login"));
  }, [router]);

  useEffect(() => {
    const map: Record<string, string[]> = {
      dashboard: [],
      leads: ["leads", "staff", "leadEvents"],
      fleet: ["assessments", "leads", "staff"],
      fuel: ["assessments", "leads", "staff"],
      registrations: ["registrations", "leads"],
      quotations: ["quotationRequests", "leads", "staff"],
      contacts: ["contactMessages", "leads"],
      customers: ["customers", "leads", "vehicles"],
      invoicing: ["customers"],
      tracking: ["vehicles", "customers", "vehiclePositions"],
      alerts: ["alerts", "vehicles", "customers"],
      followups: ["followUps", "leads", "staff"],
      agentApplications: ["leads"],
      creatorApplications: ["leads", "leadEvents"],
      salespeople: ["staff"],
      emails: ["emailDeliveries", "leads"],
      content: [],
      reports: [],
      settings: ["staff"],
    };
    if (section !== "dashboard") {
      fetchData(map[section] ?? []);
    }
  }, [section, fetchData]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  };

  if (!me) return <div className="min-h-screen bg-navy" />;

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[150] w-[240px] transform bg-navy text-white transition-transform lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Image src="/images/wazambi-logo-light-v2.svg" alt="Wazambi" width={150} height={32} className="h-[22px] w-auto opacity-90" />
          <button className="lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="overflow-y-auto px-3 py-4" style={{ maxHeight: "calc(100vh - 80px)" }}>
          {navItems
            .filter((item) => (roleNav[item.key] ?? []).includes(me.role))
            .map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setSection(item.key);
                setMenuOpen(false);
              }}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-[14px] font-medium transition-colors ${
                section === item.key ? "bg-electric-blue text-white" : "text-white/75 hover:bg-white/10"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button onClick={logout} className="mt-4 flex w-full items-center gap-3 rounded-lg bg-white/5 px-4 py-2.5 text-left text-[14px] font-medium text-gold hover:bg-white/10">
            <span className="w-4 text-center">↩</span> Logout
          </button>
        </nav>
      </aside>

      {menuOpen && <div className="fixed inset-0 z-[140] bg-navy/60 lg:hidden" onClick={() => setMenuOpen(false)} />}

      {/* Main */}
      <div className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-navy/10 bg-white px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-[16px] font-bold uppercase text-navy">
              {navItems.find((n) => n.key === section)?.label}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-navy">{me.fullName}</p>
            <p className="text-[11px] uppercase tracking-wide text-ink/50">{me.role}</p>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          {loading && section !== "dashboard" && (
            <p className="mb-4 text-[13px] text-ink/50">Loading...</p>
          )}
          {section === "dashboard" && <Overview />}
          {section === "leads" && <Leads data={data} me={me} />}
          {section === "fleet" && <Assessments type="fleet" data={data} />}
          {section === "fuel" && <Assessments type="fuel" data={data} />}
          {section === "registrations" && <Registrations data={data} />}
          {section === "quotations" && <Quotations data={data} />}
          {section === "contacts" && <Contacts data={data} />}
          {section === "customers" && <Customers data={data} />}
          {section === "invoicing" && <Invoicing data={data} />}
          {section === "tracking" && <Tracking data={data} />}
          {section === "alerts" && <Alerts data={data} />}
          {section === "followups" && <FollowUps data={data} />}
          {section === "agentApplications" && <AgentApplications data={data} />}
          {section === "creatorApplications" && <CreatorApplications data={data} />}
          {section === "salespeople" && <Salespeople data={data} />}
          {section === "emails" && <Emails data={data} />}
          {section === "content" && <ContentManager />}
          {section === "reports" && <Reports />}
          {section === "settings" && <Settings data={data} />}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Overview() {
  const [ov, setOv] = useState<any>(null);
  useEffect(() => {
    fetch("/api/data/overview")
      .then((r) => r.json())
      .then((d) => d.ok && setOv(d))
      .catch(() => {});
  }, []);

  if (!ov) return <p className="text-[14px] text-ink/50">Loading overview...</p>;

  const o = ov.overview;
  const c = ov.charts;
  const ser = o.serious ?? 0;
  const totals = [
    { label: "Total Leads", value: o.totalLeads },
    { label: "New Today", value: o.newToday },
    { label: "Serious Leads", value: ser },
    { label: "Fleet Assessments", value: o.fleetAssessments },
    { label: "Fuel Assessments", value: o.fuelAssessments },
    { label: "Course Registrations", value: o.courseRegistrations },
    { label: "Quotation Requests", value: o.quotationRequests },
    { label: "Customers Won", value: o.customersWon },
    { label: "Follow-ups Due", value: o.followUpsDue },
    { label: "Successful Emails", value: o.emailsSent },
    { label: "Failed Emails", value: o.emailsFailed },
    { label: "Contact Messages", value: o.contactMessages },
  ];
  const guide = [
    { label: "GPS Guides", value: o.gpsGuideRequests },
    { label: "Fuel Guides", value: o.fuelGuideRequests },
    { label: "Fleet Guides", value: o.fleetGuideRequests },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {totals.map((t) => (
          <StatCard key={t.label} label={t.label} value={t.value} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Conversion Rate" value={`${c.conversionRate}%`} />
        <div className="rounded-xl border border-navy/10 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">Guide Requests</p>
          <div className="mt-3 space-y-2">
            {guide.map((g) => (
              <Bar key={g.label} label={g.label} value={g.value} total={Math.max(...guide.map((x) => x.value), 1)} />
            ))}
          </div>
        </div>
      </div>
      <ChartsGrid charts={c} />
    </div>
  );
}

function Bar({ label, value, total, color = "bg-electric-blue" }: { label: string; value: number; total: number; color?: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-[12px] text-ink/70">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-navy/10">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}

function ChartsGrid({ charts }: { charts: any }) {
  const block = [
    { title: "Leads by Source", data: charts.leadsBySource ?? [] },
    { title: "Leads by Service", data: charts.leadsByService ?? [] },
    { title: "Leads by Fleet Size", data: charts.leadsByFleetSize ?? [] },
    { title: "Leads by Salesperson", data: charts.leadsBySalesperson ?? [] },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {block.map((b) => {
        const max = Math.max(...b.data.map((x: { count: number }) => x.count), 1);
        return (
          <div key={b.title} className="rounded-xl border border-navy/10 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">{b.title}</p>
            <div className="mt-3 space-y-2">
              {b.data.length === 0 && <p className="text-[12px] text-ink/40">No data yet</p>}
              {b.data.map((x: { label: string; count: number }) => (
                <Bar key={x.label} label={x.label} value={x.count} total={max} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ServiceChips({ item }: { item: any }) {
  const list =
    Array.isArray(item?.serviceInterests) && item.serviceInterests.length > 0
      ? item.serviceInterests
      : item?.serviceInterest
        ? [item.serviceInterest]
        : [];
  if (list.length === 0 && !item?.needsHelpChoosing) {
    return <span>—</span>;
  }
  return (
    <span className="flex flex-wrap gap-1">
      {list.map((s: string) => (
        <span key={s} className="rounded-full bg-electric-blue/10 px-2 py-0.5 text-[11px] font-semibold text-electric-blue">
          {s}
        </span>
      ))}
      {item?.needsHelpChoosing && (
        <span className="rounded-full bg-gold/25 px-2 py-0.5 text-[11px] font-semibold text-navy">
          I need help choosing
        </span>
      )}
    </span>
  );
}

function ChallengeChips({ item }: { item: any }) {
  const list =
    Array.isArray(item?.mainChallenges) && item.mainChallenges.length > 0
      ? item.mainChallenges
      : item?.mainChallenge
        ? [item.mainChallenge]
        : [];
  if (list.length === 0 && !item?.stillExploring) {
    return <span>—</span>;
  }
  return (
    <span className="flex flex-wrap gap-1">
      {list.map((s: string) => (
        <span key={s} className="rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy">
          {s}
        </span>
      ))}
      {item?.stillExploring && (
        <span className="rounded-full bg-gold/25 px-2 py-0.5 text-[11px] font-semibold text-navy">
          I am still exploring
        </span>
      )}
    </span>
  );
}

function Leads({ data, me }: { data: any; me: Staff }) {
  const [selected, setSelected] = useState<any>(null);
  const [note, setNote] = useState("");
  const [staffForAssign, setStaffForAssign] = useState<string>("");
  const leads: any[] = data.leads ?? [];
  const staff: any[] = data.staff ?? [];
  const events: any[] = data.leadEvents ?? [];
  const salespeople = staff.filter((s) => ["sales_manager", "salesperson"].includes(s.role));

  const patch = async (id: number, body: any) => {
    const res = await fetch(`/api/data/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  };

  const noteModal = selected && (
    <Modal title={`${selected.firstName} ${selected.lastName}`} onClose={() => setSelected(null)}>
      <div className="space-y-4">
        <div>
          <p className="text-[12px] font-semibold uppercase text-ink/50">Contact</p>
          <p className="text-[14px] text-ink/80">
            {selected.phone} {selected.email ? `· ${selected.email}` : ""}
          </p>
          <p className="text-[13px] text-ink/60">
            {selected.company ?? "No company"} · {selected.fleetSize ?? "?"} vehicles
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <ServiceChips item={selected} />
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            <ChallengeChips item={selected} />
          </div>
          <p className="mt-1 text-[12px] text-ink/50">
            Source: {selected.leadSource ?? "direct"} · Registered: {selected.createdAt?.slice(0, 10)}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${selected.phone}`} className="rounded-lg bg-green-600 px-3 py-1.5 text-[12px] font-semibold text-white">Call</a>
          <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green-500 px-3 py-1.5 text-[12px] font-semibold text-white">WhatsApp</a>
          {selected.email && (
            <a href={`mailto:${selected.email}`} className="rounded-lg bg-electric-blue px-3 py-1.5 text-[12px] font-semibold text-white">Email</a>
          )}
        </div>
        <div>
          <p className="mb-1 text-[12px] font-semibold uppercase text-ink/50">Status</p>
          <Select
            value={selected.status}
            onChange={(v) => {
              patch(selected.id, { status: v }).then(() => setSelected({ ...selected, status: v }));
            }}
            options={leadStatuses}
          />
        </div>
        <div>
          <p className="mb-1 text-[12px] font-semibold uppercase text-ink/50">Assign Salesperson</p>
          <Select
            value={String(selected.assignedSalespersonId ?? "")}
            onChange={(v) => {
              const pid = v ? Number(v) : null;
              patch(selected.id, { assignedSalespersonId: pid }).then(() =>
                setSelected({ ...selected, assignedSalespersonId: pid })
              );
            }}
            options={["", ...salespeople.map((s: any) => String(s.id))]}
          />
          <p className="mt-1 text-[11px] text-ink/40">Options show salesperson IDs; names in Salespeople section.</p>
        </div>
        <div>
          <p className="mb-1 text-[12px] font-semibold uppercase text-ink/50">Add Note / Schedule Follow-up</p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" rows={2} placeholder="Note..." />
          <div className="mt-2 flex flex-wrap gap-2">
            <GhostBtn onClick={() => patch(selected.id, { followUpNotes: note }).then(() => setNote(""))}>
              Save Note
            </GhostBtn>
            <GhostBtn
              onClick={() =>
                patch(selected.id, {
                  status: "follow_up",
                  followUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
                })
              }
            >
              Follow-up Tomorrow
            </GhostBtn>
            <GhostBtn
              onClick={() =>
                fetch("/api/data/followUps", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    leadId: selected.id,
                    salespersonId: selected.assignedSalespersonId ?? me.id,
                    followUpType: "phone_call",
                    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
                    status: "pending",
                    notes: note,
                  }),
                })
              }
            >
              Create Follow-up
            </GhostBtn>
            <GhostBtn onClick={() => patch(selected.id, { status: "sold" })}>Mark as Customer</GhostBtn>
            <GhostBtn onClick={() => patch(selected.id, { status: "quotation_requested" })}>Create Quotation</GhostBtn>
          </div>
        </div>
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase text-ink/50">Activity Timeline</p>
          <div className="max-h-[220px] space-y-2 overflow-y-auto rounded-lg bg-paper p-3">
            {events
              .filter((e) => e.leadId === selected.id)
              .slice()
              .reverse()
              .map((e) => (
                <div key={e.id} className="border-b border-navy/10 pb-2 text-[13px]">
                  <span className="font-semibold capitalize text-navy">{e.eventType.replace(/_/g, " ")}</span>
                  <p className="text-ink/60">{e.description}</p>
                  <p className="text-[11px] text-ink/40">{e.createdAt?.replace("T", " ").slice(0, 16)}</p>
                </div>
              ))}
            {events.filter((e) => e.leadId === selected.id).length === 0 && (
              <p className="text-[12px] text-ink/40">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
        <table className="w-full min-w-[980px]">
          <thead className="bg-paper">
            <tr>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Service</Th>
              <Th>Fleet Size</Th>
              <Th>Source</Th>
              <Th>Status</Th>
              <Th>Sales</Th>
              <Th>Follow-up</Th>
              <Th>Registered</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {leads.slice().reverse().map((l) => (
              <tr key={l.id} className="border-t border-navy/5 hover:bg-paper/60">
                <Td>
                  <button className="font-semibold text-electric-blue hover:underline" onClick={() => { setSelected(l); setStaffForAssign(""); }}>
                    {l.firstName} {l.lastName}
                  </button>
                </Td>
                <Td>{l.phone}</Td>
                <Td><ServiceChips item={l} /></Td>
                <Td>{l.fleetSize ?? "—"}</Td>
                <Td className="capitalize">{(l.leadSource ?? "direct").replace(/_/g, " ")}</Td>
                <Td><Badge status={l.status} /></Td>
                <Td>{l.assignedSalespersonId ?? "—"}</Td>
                <Td>{l.followUpDate ? l.followUpDate.slice(0, 10) : "—"}</Td>
                <Td className="whitespace-nowrap">{l.createdAt?.slice(0, 10)}</Td>
                <Td>
                  <div className="flex gap-1.5">
                    <GhostBtn onClick={() => { setSelected(l); setStaffForAssign(""); }}>View</GhostBtn>
                    <a href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-800">WA</a>
                  </div>
                </Td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><Td colSpan={10} className="text-center text-ink/40">No leads yet — submit a form on the website to see it here.</Td></tr>
            )}
          </tbody>
        </table>
      </div>
      {noteModal}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Assessments({ type, data }: { type: "fleet" | "fuel"; data: any }) {
  const assessments: any[] = (data.assessments ?? []).filter((a: any) => a.assessmentType === type);
  const leads: any[] = data.leads ?? [];
  const nameOf = (id: number) => {
    const l = leads.find((x) => x.id === id);
    return l ? `${l.firstName} ${l.lastName}` : `Lead #${id}`;
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
      <table className="w-full min-w-[800px]">
        <thead className="bg-paper">
          <tr>
            <Th>Lead</Th>
            <Th>Type</Th>
            <Th>Fleet Size</Th>
            <Th>Challenge</Th>
            <Th>Service Interest</Th>
            <Th>Submitted</Th>
          </tr>
        </thead>
        <tbody>
          {assessments.slice().reverse().map((a) => (
            <tr key={a.id} className="border-t border-navy/5">
              <Td className="font-semibold text-ink/90">{nameOf(a.leadId)}</Td>
              <Td className="capitalize">{a.assessmentType}</Td>
              <Td>{a.fleetSize ?? "—"}</Td>
              <Td><ChallengeChips item={a} /></Td>
              <Td><ServiceChips item={a} /></Td>
              <Td className="whitespace-nowrap">{a.createdAt?.slice(0, 10)}</Td>
            </tr>
          ))}
          {assessments.length === 0 && (
            <tr><Td colSpan={6} className="text-center text-ink/40">No {type} assessments yet</Td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Registrations({ data }: { data: any }) {
  const regs: any[] = data.registrations ?? [];
  const leads: any[] = data.leads ?? [];
  const nameOf = (id: number) => {
    const l = leads.find((x) => x.id === id);
    return l ? `${l.firstName} ${l.lastName}` : `Lead #${id}`;
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
      <table className="w-full min-w-[760px]">
        <thead className="bg-paper">
          <tr>
            <Th>Lead</Th>
            <Th>Course</Th>
            <Th>Email Status</Th>
            <Th>Sent At</Th>
            <Th>Registered</Th>
          </tr>
        </thead>
        <tbody>
          {regs.slice().reverse().map((r) => (
            <tr key={r.id} className="border-t border-navy/5">
              <Td className="font-semibold text-ink/90">{nameOf(r.leadId)}</Td>
              <Td className="capitalize">{r.courseCode.replace(/_/g, " ")}</Td>
              <Td><Badge status={r.emailStatus} /></Td>
              <Td>{r.emailSentAt ? r.emailSentAt.replace("T", " ").slice(0, 16) : "—"}</Td>
              <Td className="whitespace-nowrap">{r.createdAt?.slice(0, 10)}</Td>
            </tr>
          ))}
          {regs.length === 0 && <tr><Td colSpan={5} className="text-center text-ink/40">No course registrations yet</Td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function AgentApplications({ data }: { data: any }) {
  const apps: any[] = (data.leads ?? []).filter((l: any) => l.leadSource === "agent_application");
  const [busy, setBusy] = useState<number | null>(null);

  const act = async (lead: any, action: "approve" | "reject") => {
    if (!window.confirm(action === "approve" ? `Approve ${lead.firstName} ${lead.lastName} as an agent?` : `Reject ${lead.firstName} ${lead.lastName}'s application?`)) return;
    setBusy(lead.id);
    try {
      const res = await fetch("/api/agent-application/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, action }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "Action failed");
      } else {
        const j = await res.json();
        if (j.ok && j.agentCode) alert(`Approved. Agent code: ${j.agentCode}`);
        else if (j.ok) alert(`Application ${action === "approve" ? "approved" : "rejected"}.`);
      }
    } catch {
      alert("Action failed");
    } finally {
      setBusy(null);
      window.location.reload();
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
      <table className="w-full min-w-[880px]">
        <thead className="bg-paper">
          <tr>
            <Th>Applicant</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Agent Code</Th>
            <Th>Applied</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {apps.slice().reverse().map((a) => (
            <tr key={a.id} className="border-t border-navy/5">
              <Td className="font-semibold text-ink/90">
                {a.firstName} {a.lastName}
              </Td>
              <Td className="whitespace-nowrap">{a.phone}</Td>
              <Td>{a.email}</Td>
              <Td><Badge status={a.status} /></Td>
              <Td className="font-mono text-[12px] font-semibold text-navy">{a.agentCode ?? "—"}</Td>
              <Td className="whitespace-nowrap">{a.createdAt?.slice(0, 10)}</Td>
              <Td>
                {a.status === "pending" ? (
                  <div className="flex gap-2">
                    <button onClick={() => act(a, "approve")} disabled={busy === a.id} className="rounded-lg bg-green-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                      Approve
                    </button>
                    <button onClick={() => act(a, "reject")} disabled={busy === a.id} className="rounded-lg bg-alert px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50">
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-[12px] text-ink/45">—</span>
                )}
              </Td>
            </tr>
          ))}
          {apps.length === 0 && <tr><Td colSpan={7} className="text-center text-ink/40">No agent applications yet</Td></tr>}
        </tbody>
      </table>
      <p className="p-3 text-[12px] text-ink/40">Approving issues a unique Wazambi Agent Code and emails it to the applicant. The code is never shown on the public application form.</p>
    </div>
  );
}

function CreatorApplications({ data }: { data: any }) {
  const apps: any[] = (data.leads ?? []).filter((l: any) => l.leadSource === "creator_application");
  const events: any[] = data.leadEvents ?? [];
  const [busy, setBusy] = useState<number | null>(null);

  const metaFor = (leadId: number) => {
    const ev = events
      .filter((e) => e.leadId === leadId && e.eventType === "creator_application")
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))[0];
    return ev?.meta ?? {};
  };

  const act = async (lead: any, action: "approve" | "reject") => {
    if (!window.confirm(action === "approve" ? `Approve ${lead.firstName} ${lead.lastName} as a creator?` : `Reject ${lead.firstName} ${lead.lastName}'s application?`)) return;
    setBusy(lead.id);
    try {
      const res = await fetch("/api/creator-application/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, action }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "Action failed");
      } else {
        const j = await res.json();
        if (j.ok && j.creatorCode) alert(`Approved. Creator code: ${j.creatorCode}`);
        else if (j.ok) alert(`Application ${action === "approve" ? "approved" : "rejected"}.`);
      }
    } catch {
      alert("Action failed");
    } finally {
      setBusy(null);
      window.location.reload();
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
      <table className="w-full min-w-[980px]">
        <thead className="bg-paper">
          <tr>
            <Th>Creator</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Platforms</Th>
            <Th>Content Page</Th>
            <Th>Status</Th>
            <Th>Creator Code</Th>
            <Th>Applied</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {apps.slice().reverse().map((a) => {
            const meta = metaFor(a.id);
            const platforms = Array.isArray(meta.platforms) ? meta.platforms.join(", ") : (meta.platforms || "—");
            const contentUrl = meta.mainContentUrl || "—";
            return (
              <tr key={a.id} className="border-t border-navy/5">
                <Td className="font-semibold text-ink/90">
                  {a.firstName} {a.lastName}
                </Td>
                <Td className="whitespace-nowrap">{a.phone}</Td>
                <Td>{a.email}</Td>
                <Td className="text-[12px]">{platforms}</Td>
                <Td className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-[12px]">
                  {contentUrl !== "—" ? (
                    <a href={contentUrl} target="_blank" rel="noreferrer" className="text-electric-blue underline">
                      {contentUrl}
                    </a>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td><Badge status={a.status} /></Td>
                <Td className="font-mono text-[12px] font-semibold text-navy">{a.agentCode ?? "—"}</Td>
                <Td className="whitespace-nowrap">{a.createdAt?.slice(0, 10)}</Td>
                <Td>
                  {a.status === "pending" ? (
                    <div className="flex gap-2">
                      <button onClick={() => act(a, "approve")} disabled={busy === a.id} className="rounded-lg bg-green-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                        Approve
                      </button>
                      <button onClick={() => act(a, "reject")} disabled={busy === a.id} className="rounded-lg bg-alert px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-[12px] text-ink/45">—</span>
                  )}
                </Td>
              </tr>
            );
          })}
          {apps.length === 0 && <tr><Td colSpan={9} className="text-center text-ink/40">No creator applications yet</Td></tr>}
        </tbody>
      </table>
      <p className="p-3 text-[12px] text-ink/40">Approving issues a unique Wazambi Creator Code and emails it to the applicant. The code is never shown on the public application form.</p>
    </div>
  );
}

function Quotations({ data }: { data: any }) {
  const quotes: any[] = data.quotationRequests ?? [];
  const leads: any[] = data.leads ?? [];
  const nameOf = (id: number) => {
    if (!id) return "—";
    const l = leads.find((x) => x.id === id);
    return l ? `${l.firstName} ${l.lastName}` : `Lead #${id}`;
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
      <table className="w-full min-w-[700px]">
        <thead className="bg-paper">
          <tr>
            <Th>Lead</Th>
            <Th>Status</Th>
            <Th>Notes</Th>
            <Th>Created</Th>
          </tr>
        </thead>
        <tbody>
          {quotes.slice().reverse().map((q) => (
            <tr key={q.id} className="border-t border-navy/5">
              <Td className="font-semibold text-ink/90">{nameOf(q.leadId)}</Td>
              <Td><Badge status={q.status} /></Td>
              <Td>{q.notes ?? "—"}</Td>
              <Td className="whitespace-nowrap">{q.createdAt?.slice(0, 10)}</Td>
            </tr>
          ))}
          {quotes.length === 0 && <tr><Td colSpan={4} className="text-center text-ink/40">No quotation requests yet</Td></tr>}
        </tbody>
      </table>
      <p className="p-3 text-[12px] text-ink/40">Use the lead modal (All Leads → View → Create Quotation) to create a quotation request.</p>
    </div>
  );
}

function Contacts({ data }: { data: any }) {
  const messages: any[] = data.contactMessages ?? [];
  return (
    <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
      <table className="w-full min-w-[860px]">
        <thead className="bg-paper">
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Subject</Th>
            <Th>Message</Th>
            <Th>Status</Th>
            <Th>Received</Th>
          </tr>
        </thead>
        <tbody>
          {messages.slice().reverse().map((m) => (
            <tr key={m.id} className="border-t border-navy/5">
              <Td className="font-semibold text-ink/90">{m.fullName}</Td>
              <Td>{m.email}</Td>
              <Td>{m.subject ?? "—"}</Td>
              <Td className="max-w-[260px] truncate">{m.message}</Td>
              <Td><Badge status={m.status} /></Td>
              <Td className="whitespace-nowrap">{m.createdAt?.slice(0, 10)}</Td>
            </tr>
          ))}
          {messages.length === 0 && <tr><Td colSpan={6} className="text-center text-ink/40">No contact messages yet</Td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Customers({ data }: { data: any }) {
  const [customers, setCustomers] = useState<any[]>(data.customers ?? []);
  const [leads] = useState<any[]>(data.leads ?? []);
  const [vehicles, setVehicles] = useState<any[]>(data.vehicles ?? []);
  const [showNew, setShowNew] = useState(false);
  const [manageId, setManageId] = useState<number | null>(null);
  const [showResetId, setShowResetId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const won = leads.filter((l) => l.status === "sold");

  const refetch = async () => {
    const [c, v] = await Promise.all([
      fetch("/api/data?resource=customers").then((r) => r.json()),
      fetch("/api/data?resource=vehicles").then((r) => r.json()),
    ]);
    if (c.ok) setCustomers(c.data);
    if (v.ok) setVehicles(v.data);
  };

  const call = async (payload: any) => {
    setErr("");
    setNotice("");
    const res = await fetch("/api/customer/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || "Request failed");
    await refetch();
    return d;
  };

  const run = async (label: string, payload: any) => {
    try {
      const d = await call(payload);
      setNotice(label + (d.tempPassword ? ` — temporary password: ${d.tempPassword} (share it once)` : ""));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed");
    }
  };

  const managed = customers.find((c) => c.id === manageId) ?? null;
  const managedVehicles = vehicles.filter((v) => v.customerId === manageId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 bg-white p-4">
        <p className="text-[12px] text-ink/60">
          <strong className="text-navy">{won.length}</strong> won leads ·{" "}
          <strong className="text-navy">{customers.length}</strong> customer records. Give a customer{" "}
          <strong className="text-navy">portal access</strong> so they can log in at{" "}
          <a className="text-electric-blue" href="/portal" target="_blank" rel="noopener noreferrer">/portal</a>.
        </p>
        <PrimaryBtn onClick={() => setShowNew(true)}>New customer</PrimaryBtn>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">{notice}</div>
      )}
      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">{err}</div>}

      <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
        <table className="w-full min-w-[800px]">
          <thead className="bg-paper">
            <tr>
              <Th>Contact</Th>
              <Th>Company</Th>
              <Th>Email</Th>
              <Th>Portal</Th>
              <Th>Vehicles</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const portal = c.active && c.email && c.passwordHash ? "active" : c.active ? "no-access" : "disabled";
              return (
                <tr key={c.id} className="border-t border-navy/5">
                  <Td className="font-semibold text-ink/90">{c.contactName}</Td>
                  <Td>{c.company ?? "—"}</Td>
                  <Td>{c.email ?? "—"}</Td>
                  <Td>
                    {portal === "active" ? (
                      <span className="inline-block rounded-full bg-green-200 px-2.5 py-0.5 text-[11px] font-semibold text-green-900">Portal active</span>
                    ) : portal === "disabled" ? (
                      <span className="inline-block rounded-full bg-red-200 px-2.5 py-0.5 text-[11px] font-semibold text-red-800">Disabled</span>
                    ) : (
                      <span className="inline-block rounded-full bg-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">No access</span>
                    )}
                    {portal === "no-access" && (
                      <span className="block text-[11px] text-ink/50">no password set</span>
                    )}
                  </Td>
                  <Td>{c.vehicleCount ?? vehicles.filter((v: any) => v.customerId === c.id).length}</Td>
                  <Td><Badge status={c.status} /></Td>
                  <Td>
                    <GhostBtn onClick={() => setManageId(c.id)}>Manage</GhostBtn>
                  </Td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr><Td colSpan={7} className="text-center text-ink/40">No customer records yet</Td></tr>
            )}
          </tbody>
        </table>
      </div>

      {managed && (
        <Modal title={`${managed.contactName} — portal access`} onClose={() => setManageId(null)}>
          <div className="space-y-5">
            <div>
              <p className="text-[13px] font-medium text-ink/75">Enable or reset access</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <PrimaryBtn
                  onClick={() => run("Access enabled", { action: "enable", customerId: managed.id, email: managed.email ?? `${managed.contactName.split(" ")[0].toLowerCase()}@wazambigps.com`, password: "", vehicles: [] })}
                >
                  Enable access
                </PrimaryBtn>
                <GhostBtn onClick={() => setShowResetId(managed.id)}>Reset password</GhostBtn>
              </div>
              <div className="mt-2">
                <PrimaryBtn
                  onClick={() => run("Access disabled", { action: "disable", customerId: managed.id })}
                  className="border border-red-200 bg-red-50 !text-red-700 hover:!bg-red-100 hover:!text-red-800"
                >
                  Disable access
                </PrimaryBtn>
              </div>
              <p className="mt-2 text-[11px] text-ink/50">
                Enabling generates a temporary password (shown above) and signs the customer out everywhere.
                {!managed.email && " This customer has no email on file yet — add one in your account flow or set it during enable."}
              </p>
            </div>

            <div className="border-t border-navy/10 pt-4">
              <p className="text-[13px] font-medium text-ink/75">Vehicles ({managedVehicles.length})</p>
              {managedVehicles.length === 0 ? (
                <p className="mt-1 text-[12px] text-ink/50">No vehicles linked yet.</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {managedVehicles.map((v) => (
                    <li key={v.id} className="flex items-center justify-between gap-3 rounded-lg bg-paper px-3 py-2 text-[13px]">
                      <span>
                        <strong className="text-navy">{v.name}</strong>
                        {v.plate && <span className="ml-2 text-electric-blue">{v.plate}</span>}
                        {v.vehicleType && <span className="ml-2 text-ink/50">{v.vehicleType}</span>}
                      </span>
                      <button
                        className="text-[12px] font-medium text-red-600 hover:underline"
                        onClick={() => run("Vehicle removed", { action: "removeVehicle", vehicleId: v.id })}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <AddVehicleForm onAdd={(vehicle) => run("Vehicle added", { action: "addVehicle", customerId: managed.id, ...vehicle })} />
            </div>
          </div>
        </Modal>
      )}
      {showResetId != null && managed && (
        <ResetPasswordModal customerId={managed.id} onClose={() => setShowResetId(null)} onReset={(password) => run("Password reset", { action: "setPassword", customerId: managed.id, password })} />
      )}
      {showNew && <NewCustomerModal onClose={() => setShowNew(false)} onCreate={(payload) => run("Customer created", payload)} />}
    </div>
  );
}

function AddVehicleForm({ onAdd }: { onAdd: (v: { name: string; plate?: string; vehicleType?: string }) => void }) {
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");
  const [type, setType] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), plate: plate.trim() || undefined, vehicleType: type.trim() || undefined });
    setName("");
    setPlate("");
    setType("");
  };
  return (
    <form onSubmit={submit} className="mt-3 grid gap-2 rounded-xl border border-navy/10 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vehicle name (e.g. Scania Truck 01)" className="rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" required />
      <input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Plate (optional)" className="rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" />
      <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (optional)" className="rounded-lg border border-navy/15 px-3 py-2 text-[13px] outline-none focus:border-electric-blue" />
      <PrimaryBtn type="submit">Add</PrimaryBtn>
    </form>
  );
}

function ResetPasswordModal({ customerId, onClose, onReset }: { customerId: number; onClose: () => void; onReset: (password: string) => void }) {
  const [password, setPassword] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return;
    onReset(password);
    onClose();
  };
  return (
    <Modal title="Reset customer password" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-[13px] font-medium text-ink/75">
          New password (min 8 characters)
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue" required minLength={8} />
        </label>
        <PrimaryBtn type="submit" className="w-full">Set password</PrimaryBtn>
      </form>
    </Modal>
  );
}

function NewCustomerModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: any) => void }) {
  const [form, setForm] = useState({ contactName: "", company: "", phone: "", email: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactName.trim()) return;
    onCreate({ ...form, vehicles: [] });
    onClose();
  };
  return (
    <Modal title="New customer" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-[13px] font-medium text-ink/75">
          Contact name
          <input value={form.contactName} onChange={set("contactName")} className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] font-medium text-ink/75">
            Company
            <input value={form.company} onChange={set("company")} className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue" />
          </label>
          <label className="block text-[13px] font-medium text-ink/75">
            Phone
            <input value={form.phone} onChange={set("phone")} className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue" />
          </label>
        </div>
        <label className="block text-[13px] font-medium text-ink/75">
          Email (portal login)
          <input type="email" value={form.email} onChange={set("email")} className="mt-1.5 block w-full rounded-lg border border-navy/15 px-4 py-3 text-[14px] outline-none focus:border-electric-blue" />
        </label>
        <p className="text-[12px] text-ink/50">Password is generated automatically and shown once — share it with the customer.</p>
        <PrimaryBtn type="submit" className="w-full">Create customer</PrimaryBtn>
      </form>
    </Modal>
  );
}

function FollowUps({ data }: { data: any }) {
  const [draft, setDraft] = useState({ leadId: "", salespersonId: "", followUpType: "phone_call", dueDate: "", notes: "" });
  const followups: any[] = data.followUps ?? [];
  const leads: any[] = data.leads ?? [];
  const staff: any[] = data.staff ?? [];
  const nameOf = (id: number) => {
    const l = leads.find((x) => x.id === id);
    return l ? `${l.firstName} ${l.lastName}` : `Lead #${id}`;
  };

  const create = async () => {
    if (!draft.leadId || !draft.salespersonId) return;
    await fetch("/api/data/followUps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: Number(draft.leadId),
        salespersonId: Number(draft.salespersonId),
        followUpType: draft.followUpType,
        dueDate: draft.dueDate || new Date().toISOString().slice(0, 10),
        status: "pending",
        notes: draft.notes,
      }),
    });
    window.location.reload();
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/data/followUps/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, completedAt: status === "completed" ? new Date().toISOString() : undefined }),
    });
    window.location.reload();
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-xl border border-navy/10 bg-white p-4 md:grid-cols-6">
        <select value={draft.leadId} onChange={(e) => setDraft({ ...draft, leadId: e.target.value })} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px]">
          <option value="">Lead...</option>
          {leads.map((l) => <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>)}
        </select>
        <select value={draft.salespersonId} onChange={(e) => setDraft({ ...draft, salespersonId: e.target.value })} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px]">
          <option value="">Salesperson...</option>
          {staff.filter((s) => ["sales_manager", "salesperson"].includes(s.role)).map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
        <select value={draft.followUpType} onChange={(e) => setDraft({ ...draft, followUpType: e.target.value })} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px]">
          {followUpTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
        <input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
        <input type="text" placeholder="Notes" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
        <PrimaryBtn onClick={create}>Add</PrimaryBtn>
      </div>

      <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
        <table className="w-full min-w-[760px]">
          <thead className="bg-paper">
            <tr>
              <Th>Lead</Th>
              <Th>Salesperson</Th>
              <Th>Type</Th>
              <Th>Due</Th>
              <Th>Status</Th>
              <Th>Notes</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {followups.slice().reverse().map((f) => (
              <tr key={f.id} className="border-t border-navy/5">
                <Td className="font-semibold text-ink/90">{nameOf(f.leadId)}</Td>
                <Td>{f.salespersonId}</Td>
                <Td className="capitalize">{f.followUpType.replace(/_/g, " ")}</Td>
                <Td>{f.dueDate?.slice(0, 10)}</Td>
                <Td><Badge status={f.status} /></Td>
                <Td className="max-w-[220px] truncate">{f.notes ?? "—"}</Td>
                <Td>
                  {f.status === "pending" ? (
                    <GhostBtn onClick={() => updateStatus(f.id, "completed")}>Complete</GhostBtn>
                  ) : (
                    <GhostBtn onClick={() => updateStatus(f.id, "pending")}>Reopen</GhostBtn>
                  )}
                </Td>
              </tr>
            ))}
            {followups.length === 0 && <tr><Td colSpan={7} className="text-center text-ink/40">No follow-ups yet</Td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Salespeople({ data }: { data: any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("salesperson");
  const staff: any[] = data.staff ?? [];

  const add = async () => {
    if (!name || !email) return;
    await fetch("/api/data/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name, email, role }),
    });
    window.location.reload();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[40%_1fr]">
      <div className="rounded-xl border border-navy/10 bg-white p-5">
        <p className="text-[14px] font-bold uppercase text-navy">Add Staff Member</p>
        <div className="mt-3 space-y-3">
          <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px]">
            <option value="salesperson">Salesperson</option>
            <option value="sales_manager">Sales Manager</option>
            <option value="content_manager">Content Manager</option>
            <option value="admin">Administrator</option>
            <option value="owner">Owner</option>
          </select>
          <PrimaryBtn onClick={add}>Add {role.replace(/_/g, " ")}</PrimaryBtn>
          <p className="text-[11px] text-ink/40">New staff default password: wazambi123</p>
        </div>
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        {staff.map((s) => (
          <div key={s.id} className="rounded-xl border border-navy/10 bg-white p-4">
            <p className="text-[15px] font-bold text-navy">{s.fullName}</p>
            <p className="text-[12px] text-ink/60">{s.email}</p>
            <p className="mt-1"><Badge status={s.role} /></p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Emails({ data }: { data: any }) {
  const emails: any[] = data.emailDeliveries ?? [];
  const leads: any[] = data.leads ?? [];
  const nameOf = (id: number) => {
    const l = leads.find((x) => x.id === id);
    return l ? `${l.firstName} ${l.lastName}` : `Lead #${id}`;
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
      <table className="w-full min-w-[800px]">
        <thead className="bg-paper">
          <tr>
            <Th>Lead</Th>
            <Th>To</Th>
            <Th>Subject</Th>
            <Th>Guide</Th>
            <Th>Status</Th>
            <Th>Error</Th>
            <Th>Sent</Th>
          </tr>
        </thead>
        <tbody>
          {emails.slice().reverse().map((e) => (
            <tr key={e.id} className="border-t border-navy/5">
              <Td className="font-semibold text-ink/90">{nameOf(e.leadId)}</Td>
              <Td>{e.toEmail}</Td>
              <Td className="max-w-[240px] truncate">{e.subject}</Td>
              <Td>{e.guideName}</Td>
              <Td><Badge status={e.status} /></Td>
              <Td className="max-w-[180px] truncate">{e.errorMessage ?? "—"}</Td>
              <Td className="whitespace-nowrap">{e.createdAt?.slice(0, 10)}</Td>
            </tr>
          ))}
          {emails.length === 0 && <tr><Td colSpan={7} className="text-center text-ink/40">No email deliveries yet</Td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ContentManager() {
  const [ann, setAnn] = useState({ published: true, badge: "NEW", text: "", link: "/agents" });
  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        if (d.announcement) setAnn({ published: true, badge: d.announcement.badge ?? "NEW", text: d.announcement.text, link: d.announcement.link });
        setStats(d.stats ?? []);
        setFaqs(d.faqs ?? []);
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    const body: any = {};
    body.announcement = { badge: ann.badge, text: ann.text, link: ann.link };
    body.stats = stats;
    body.faqs = faqs;
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setSaved("Saved — updates now appear on the live site.");
      setTimeout(() => setSaved(""), 3000);
    }
  };

  return (
    <div className="max-w-[860px] space-y-6">
      <div className="rounded-xl border border-navy/10 bg-white p-5">
        <p className="text-[14px] font-bold uppercase text-navy">Announcement Bar</p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <input value={ann.badge} onChange={(e) => setAnn({ ...ann, badge: e.target.value })} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
          <div className="md:col-span-2">
            <input value={ann.text} onChange={(e) => setAnn({ ...ann, text: e.target.value })} className="w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
          </div>
          <input value={ann.link} onChange={(e) => setAnn({ ...ann, link: e.target.value })} className="rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-[13px] text-ink/70">
            <input type="checkbox" checked={ann.published} onChange={(e) => setAnn({ ...ann, published: e.target.checked })} />
            Show announcement
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-navy/10 bg-white p-5">
        <p className="text-[14px] font-bold uppercase text-navy">Homepage Statistics</p>
        <div className="mt-3 space-y-2">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input value={s.value} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} className="w-28 rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
              <input value={s.label} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} className="flex-1 rounded-lg border border-navy/15 px-3 py-2 text-[13px]" />
              <GhostBtn onClick={() => setStats(stats.filter((_, j) => j !== i))}>Remove</GhostBtn>
            </div>
          ))}
          <GhostBtn onClick={() => setStats([...stats, { value: "0", label: "New Statistic" }])}>
            + Add Statistic
          </GhostBtn>
        </div>
      </div>

      <div className="rounded-xl border border-navy/10 bg-white p-5">
        <p className="text-[14px] font-bold uppercase text-navy">FAQ Questions</p>
        <div className="mt-3 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-lg border border-navy/10 p-3">
              <input value={f.question} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} className="mb-2 w-full rounded-lg border border-navy/15 px-3 py-2 text-[13px] font-semibold" />
              <div className="flex gap-2">
                <textarea value={f.answer} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} className="flex-1 rounded-lg border border-navy/15 px-3 py-2 text-[13px]" rows={2} />
                <GhostBtn onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}>Remove</GhostBtn>
              </div>
            </div>
          ))}
          <GhostBtn onClick={() => setFaqs([...faqs, { question: "New question?", answer: "Answer..." }])}>
            + Add FAQ
          </GhostBtn>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PrimaryBtn onClick={save}>{saving ? "Saving..." : "Save Site Content"}</PrimaryBtn>
        {saved && <p className="text-[13px] font-medium text-green-700">{saved}</p>}
      </div>
      <p className="text-[12px] text-ink/50">
        Content permissions: Owner, Administrator and Content Manager can edit. Changes publish
        immediately to the announcement bar, homepage statistics and homepage FAQ.
      </p>
    </div>
  );
}

function Reports() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch("/api/data/overview")
      .then((r) => r.json())
      .then((d) => d.ok && setData(d))
      .catch(() => {});
  }, []);
  if (!data) return <p className="text-[14px] text-ink/50">Loading reports...</p>;
  return <ChartsGrid charts={data.charts} />;
}

function Settings({ data }: { data: any }) {
  const staff: any[] = data.staff ?? [];
  const [annLink, setAnnLink] = useState("");
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => d.announcement && setAnnLink(d.announcement.link))
      .catch(() => {});
  }, []);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-navy/10 bg-white p-5">
        <p className="text-[14px] font-bold uppercase text-navy">External Links</p>
        <ul className="mt-3 space-y-2 text-[13px]">
          <li>Client Login: <a className="text-electric-blue" href="/customer-admin">/customer-admin</a></li>
          <li>Agent App: <a className="text-electric-blue" href="https://wazambi-gps.vercel.app/">wazambi-gps.vercel.app</a></li>
          <li>Agent Admin: <a className="text-electric-blue" href="https://wazambi-backend.vercel.app/admin">wazambi-backend.vercel.app/admin</a></li>
        </ul>
      </div>
      <div className="rounded-xl border border-navy/10 bg-white p-5">
        <p className="text-[14px] font-bold uppercase text-navy">Roles</p>
        <ul className="mt-3 space-y-2 text-[13px]">
          <li><strong>Owner</strong> — full access including staff and reports</li>
          <li><strong>Administrator</strong> — leads, content, staff, reports</li>
          <li><strong>Sales Manager</strong> — leads, assignment, follow-ups, reports</li>
          <li><strong>Salesperson</strong> — only their assigned leads</li>
          <li><strong>Content Manager</strong> — website content only</li>
        </ul>
      </div>
    </div>
  );
}