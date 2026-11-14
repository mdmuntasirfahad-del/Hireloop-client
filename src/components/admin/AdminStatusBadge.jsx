import { titleCase } from "@/lib/admin/format";

const statusStyles = {
    active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    closed: "border-white/10 bg-white/[0.04] text-zinc-400",
    seeker: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    recruiter: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
    admin: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300",
    approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    unapproved: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    reviewing: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
    interviewing: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    rejected: "border-red-500/20 bg-red-500/10 text-red-300",
    hired: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    unassigned: "border-white/10 bg-white/[0.04] text-zinc-400",
};

export default function AdminStatusBadge({ status, label }) {
    const value = String(status || "pending").toLowerCase();

    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize ${
                statusStyles[value] || statusStyles.pending
            }`}
        >
            {label || titleCase(value)}
        </span>
    );
}
