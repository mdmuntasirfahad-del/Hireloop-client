import Link from "next/link";
import {
    ArrowRight,
    CircleCheck,
    Clock,
    Factory,
    Globe,
    LocationArrow,
} from "@gravity-ui/icons";
import SurfaceCard from "@/components/ui/SurfaceCard";

export default function CompanySnapshot({ company, jobs = [] }) {
    const companyName = company?.companyName || "Your company";
    const activeJobs = jobs.filter(
        (job) => (job.status || "active") === "active"
    ).length;
    const jobLimit = Number(company?.jobLimit) || 3;
    const isApproved = Boolean(company?.isApproved);
    const usagePercent =
        jobLimit > 0 ? Math.min((activeJobs / jobLimit) * 100, 100) : 0;

    return (
        <SurfaceCard className="p-6">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400">
                        {company?.logoUrl ? (
                            <img
                                src={company.logoUrl}
                                alt={`${companyName} logo`}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Factory size={22} aria-hidden="true" />
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                            {companyName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                            {company?.industry || "Company profile"}
                        </p>
                    </div>
                </div>

                <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                        isApproved
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-300"
                    }`}
                >
                    {isApproved ? (
                        <CircleCheck size={12} aria-hidden="true" />
                    ) : (
                        <Clock size={12} aria-hidden="true" />
                    )}
                    {isApproved ? "Approved" : "Pending review"}
                </span>
            </div>

            <dl className="mt-5 space-y-3 border-t border-white/[0.06] pt-4 text-xs">
                <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-1.5 text-zinc-500">
                        <LocationArrow size={13} aria-hidden="true" />
                        Location
                    </dt>
                    <dd className="text-right text-zinc-300">
                        {company?.location || "Not specified"}
                    </dd>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-1.5 text-zinc-500">
                        <Globe size={13} aria-hidden="true" />
                        Website
                    </dt>
                    <dd className="max-w-[60%] truncate text-right text-zinc-300">
                        {company?.website ? (
                            <a
                                href={
                                    company.website.startsWith("http")
                                        ? company.website
                                        : `https://${company.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-300 transition-colors hover:text-indigo-200"
                            >
                                {company.website}
                            </a>
                        ) : (
                            "Not specified"
                        )}
                    </dd>
                </div>
            </dl>

            <div className="mt-5 border-t border-white/[0.06] pt-4">
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Active job posts</span>
                    <span className="text-zinc-300">
                        {activeJobs} / {jobLimit}
                    </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${usagePercent}%` }}
                    />
                </div>
            </div>

            <Link
                href="/dashboard/recruiter/my-company"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            >
                Manage company
                <ArrowRight size={14} aria-hidden="true" />
            </Link>
        </SurfaceCard>
    );
}
