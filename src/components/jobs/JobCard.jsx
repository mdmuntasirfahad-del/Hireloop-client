import Link from "next/link";
import {
    Pin,
    Briefcase,
    TagDollar,
    ArrowRight,
    Factory,
    Clock,
} from "@gravity-ui/icons";

function Meta({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
            <Icon
                size={12}
                className="shrink-0 text-indigo-400"
                aria-hidden="true"
            />
            {children}
        </span>
    );
}

export default function JobCard({ job }) {
    if (!job) return null;

    const jobId = job._id || job.id;
    const numericSalary = Number(
        String(job.salary ?? "").replace(/,/g, "")
    );
    const hasSalary =
        job.salary !== null &&
        job.salary !== undefined &&
        job.salary !== "" &&
        Number.isFinite(numericSalary) &&
        numericSalary > 0;
    const formattedSalary = hasSalary
        ? numericSalary.toLocaleString()
        : null;

    return (
        <article className="group relative flex h-full flex-col rounded-2xl border border-white/[0.08] bg-surface-raised p-5 transition-colors duration-200 hover:border-white/20 focus-within:border-indigo-400/50">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400">
                        {job.companyLogo ? (
                            <img
                                src={job.companyLogo}
                                alt={job.companyName || "Company logo"}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Factory size={16} aria-hidden="true" />
                        )}
                    </div>

                    <span className="truncate text-sm font-medium text-zinc-400">
                        {job.companyName || "Company"}
                    </span>
                </div>

                {job.category && (
                    <span className="shrink-0 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-medium text-indigo-300">
                        {job.category}
                    </span>
                )}
            </div>

            <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
                <Link
                    href={`/jobs/${jobId}`}
                    aria-label={`View ${job.title}${
                        job.companyName ? ` at ${job.companyName}` : ""
                    }`}
                    className="rounded-md transition-colors hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416]"
                >
                    {job.title}
                </Link>
            </h3>

            {job.responsibilities && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {job.responsibilities}
                </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
                {job.location && <Meta icon={Pin}>{job.location}</Meta>}
                {job.type && <Meta icon={Briefcase}>{job.type}</Meta>}
                {hasSalary && (
                    <Meta icon={TagDollar}>${formattedSalary}/year</Meta>
                )}
            </div>

            <div className="mt-auto">
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] text-zinc-500">
                        <Clock size={12} aria-hidden="true" />
                        <span className="truncate">
                            Deadline: {job.deadline || "Open"}
                        </span>
                    </span>

                    <Link
                        href={`/jobs/${jobId}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md text-xs font-semibold text-zinc-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416]"
                    >
                        View job
                        <ArrowRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
}
