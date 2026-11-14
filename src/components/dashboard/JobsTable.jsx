import Link from "next/link";
import { ArrowUpRightFromSquare } from "@gravity-ui/icons";
import SurfaceCard from "@/components/ui/SurfaceCard";

const statusStyles = {
    active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    closed: "border-white/10 bg-white/[0.04] text-zinc-400",
};

const formatDate = (value) => {
    if (!value) return "—";

    const normalized =
        typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? `${value}T00:00:00`
            : value;
    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const formatSalary = (value) => {
    if (value === null || value === undefined || value === "") return "—";

    const raw = String(value).trim();
    const numeric = Number(raw.replace(/,/g, ""));

    if (Number.isFinite(numeric) && numeric > 0 && /^\d[\d,]*$/.test(raw)) {
        return `$${numeric.toLocaleString()}`;
    }

    return raw;
};

const columns = [
    "Role",
    "Category / type",
    "Location",
    "Salary",
    "Posted",
    "Deadline",
    "Status",
    "Open",
];

export default function JobsTable({ jobs = [] }) {
    return (
        <SurfaceCard className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className="whitespace-nowrap px-5 py-3 font-medium"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {jobs.map((job) => {
                            const status = job.status || "active";

                            return (
                                <tr
                                    key={job._id || job.id}
                                    className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                                >
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-white">
                                            {job.title || "Untitled job"}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-zinc-500">
                                            {job.companyName || "Your company"}
                                        </p>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                        <p>{job.type || "—"}</p>
                                        <p className="mt-0.5 text-[11px] text-zinc-500">
                                            {job.category || "—"}
                                        </p>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                        {job.location || "Remote"}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-zinc-300">
                                        {formatSalary(job.salary)}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                        {formatDate(job.createdAt)}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                        {formatDate(job.deadline)}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize ${
                                                statusStyles[status] ||
                                                statusStyles.pending
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4">
                                        <Link
                                            href={`/jobs/${job._id || job.id}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                                        >
                                            View
                                            <ArrowUpRightFromSquare
                                                size={13}
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </SurfaceCard>
    );
}
