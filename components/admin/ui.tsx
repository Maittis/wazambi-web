import type { ReactNode } from "react";

export const statusColors: Record<string, string> = {
  new: "bg-electric-blue/15 text-electric-blue",
  contacted: "bg-sky-200 text-sky-900",
  potential: "bg-violet-200 text-violet-900",
  serious: "bg-gold/30 text-navy",
  follow_up: "bg-orange-200 text-orange-900",
  assessment_booked: "bg-blue-200 text-blue-900",
  demonstration_booked: "bg-blue-200 text-blue-900",
  quotation_requested: "bg-purple-200 text-purple-900",
  quotation_sent: "bg-purple-200 text-purple-900",
  deposit_paid: "bg-green-200 text-green-900",
  sold: "bg-green-300 text-green-950",
  not_interested: "bg-gray-200 text-gray-700",
  invalid: "bg-gray-200 text-gray-700",
  pending: "bg-amber-200 text-amber-900",
  approved: "bg-green-200 text-green-900",
  rejected: "bg-red-200 text-red-900",
  submitted: "bg-blue-200 text-blue-900",
  under_review: "bg-sky-200 text-sky-900",
  changes_requested: "bg-orange-200 text-orange-900",
  sent: "bg-green-200 text-green-900",
  failed: "bg-red-200 text-red-800",
  completed: "bg-green-200 text-green-900",
  missed: "bg-red-200 text-red-800",
  new2: "bg-electric-blue/15 text-electric-blue",
  read: "bg-gray-200 text-gray-700",
  replied: "bg-green-200 text-green-900",
};

export function Badge({ status }: { status: string }) {
  const cls = statusColors[status] ?? "bg-gray-200 text-gray-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-navy/10 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 font-poppins text-[26px] font-extrabold text-navy">{value}</p>
      {hint && <p className="text-[11px] font-light text-ink/50">{hint}</p>}
    </div>
  );
}

export function Th({ children }: { children?: ReactNode }) {
  return (
    <th className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink/50">
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
  colSpan,
}: {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-3 py-2.5 align-top text-[13px] text-ink/80 ${className}`}>
      {children}
    </td>
  );
}

export function PrimaryBtn({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-electric-blue disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostBtn({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border border-navy/15 px-3 py-1.5 text-[12px] font-medium text-ink/70 transition-colors hover:border-electric-blue hover:text-electric-blue ${className}`}
    >
      {children}
    </button>
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-navy/15 bg-white px-2 py-1.5 text-[12px] text-ink outline-none focus:border-electric-blue"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/60 p-4" onClick={onClose}>
      <div
        className="max-h-[86vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[17px] font-bold uppercase text-navy">{title}</h3>
          <button onClick={onClose} className="text-ink/50 hover:text-navy" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}