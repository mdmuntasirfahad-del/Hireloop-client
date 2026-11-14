import Link from "next/link";
import { FileText } from "@gravity-ui/icons";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const statusStyles = {
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    new: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
    reviewing: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    interviewing: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    rejected: "border-red-500/20 bg-red-500/10 text-red-300",
    hired: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
};

const statusLabels = {
    pending: "Pending",
    new: "New",
    reviewing: "Reviewing",
    interviewing: "Interviewing",
    rejected: "Rejected",
    hired: "Hired",
};

export default function RecentApplications({
    applications = [],
    viewAllHref = "/dashboard/recruiter/jobs",
    title = "Recent applicants",
    description = "The latest candidates who applied to your roles.",
}) {
    const recentApplications = [...applications]
        .sort((a, b) => {
            const aDate = new Date(a.appliedAt || a.createdAt || 0).getTime();
            const bDate = new Date(b.appliedAt || b.createdAt || 0).getTime();
            return bDate - aDate;
        })
        .slice(0, 6);

    return (
        <SurfaceCard className="overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
                <div>
                    <h2 className="text-sm font-semibold text-white">
                        {title}
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                        {description}
                    </p>
                </div>

                {applications.length > 0 && (
                    <Link
                        href={viewAllHref}
                        className="shrink-0 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                    >
                        View all
                    </Link>
                )}
            </div>

            {recentApplications.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                            <tr>
                                <th className="px-5 py-3 font-medium">
                                    Applicant
                                </th>
                                <th className="px-5 py-3 font-medium">Role</th>
                                <th className="px-5 py-3 font-medium">
                                    Applied
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Resume
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentApplications.map((application, index) => {
                                const status = String(
                                    application.status || "pending"
                                ).toLowerCase();
                                const statusLabel =
                                    statusLabels[status] ||
                                    application.status ||
                                    "Pending";

                                return (
                                    <tr
                                        key={
                                            application._id ||
                                            `${application.jobId}-${index}`
                                        }
                                        className="border-t border-white/[0.06]"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-white">
                                                {application.applicantName ||
                                                    "Applicant"}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-zinc-500">
                                                {application.applicantEmail ||
                                                    "—"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-zinc-400">
                                            {application.jobTitle || "—"}
                                        </td>
                                        <td className="px-5 py-4 text-zinc-400">
                                            {formatDate(
                                                application.appliedAt ||
                                                    application.createdAt
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {application.resumeUrl ? (
                                                <a
                                                    href={application.resumeUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                                                >
                                                    View resume
                                                </a>
                                            ) : (
                                                <span className="text-xs text-zinc-500">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                                                    statusStyles[status] ||
                                                    statusStyles.pending
                                                }`}
                                            >
                                                {statusLabel}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400">
                        <FileText size={22} aria-hidden="true" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-white">
                        No applicants yet
                    </h3>

                    <p className="mt-1 max-w-sm text-sm leading-relaxed text-zinc-400">
                        Once candidates apply to your roles, their details will
                        appear here.
                    </p>

                    <Link
                        href="/dashboard/recruiter/jobs/new"
                        className={`${buttonStyles.secondary} mt-5`}
                    >
                        Post a job
                    </Link>
                </div>
            )}
        </SurfaceCard>
    );
}
