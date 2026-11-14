import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobsById } from "@/lib/api/jobs";
import {
    Factory,
    Pin,
    Briefcase,
    TagDollar,
    Calendar,
    ArrowLeft,
    CircleCheck,
    ShieldCheck,
    Star,
    ArrowRight,
} from "@gravity-ui/icons";
import Container from "@/components/ui/Container";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

const isValidObjectId = (value) => /^[a-f0-9]{24}$/i.test(value);

const formatDate = (value) => {
    if (!value) return null;

    const normalized =
        typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? `${value}T00:00:00`
            : value;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

function DetailPill({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
            <Icon
                size={14}
                className="shrink-0 text-indigo-400"
                aria-hidden="true"
            />
            {children}
        </span>
    );
}

function ContentCard({ icon: Icon, title, children }) {
    if (!children) return null;

    return (
        <SurfaceCard className="p-6 md:p-7">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Icon
                    size={18}
                    className="text-indigo-400"
                    aria-hidden="true"
                />
                {title}
            </h2>

            <div className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-300">
                {children}
            </div>
        </SurfaceCard>
    );
}

function OverviewRow({ label, value, highlight = false }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd
                className={`text-right text-xs font-medium ${
                    highlight ? "text-indigo-300" : "text-zinc-200"
                }`}
            >
                {value}
            </dd>
        </div>
    );
}

export async function generateMetadata({ params }) {
    const { id } = await params;

    try {
        const job = isValidObjectId(id) ? await getJobsById(id) : null;

        if (!job) {
            return {
                title: "Job not found",
                robots: { index: false, follow: false },
            };
        }

        const summary = job.responsibilities
            ? String(job.responsibilities).slice(0, 140).trim()
            : "View the full role, responsibilities, and requirements on HireLoop.";

        return {
            title: `${job.title}${
                job.companyName ? ` at ${job.companyName}` : ""
            }`,
            description: summary,
        };
    } catch {
        return {
            title: "Job details",
        };
    }
}

export default async function JobDetailsPage({ params }) {
    const { id } = await params;

    let job = null;

    try {
        job = isValidObjectId(id) ? await getJobsById(id) : null;
    } catch (error) {
        console.error("Failed to load job:", error);
    }

    if (!job) {
        notFound();
    }

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

    const postedDate = formatDate(job.createdAt) || "Recently posted";
    const formattedDeadline = formatDate(job.deadline);
    const deadlineLabel =
        formattedDeadline ||
        (job.deadline ? String(job.deadline) : "Open until filled");

    const companyName = job.companyName || "Company";

    return (
        <Container className="py-10 md:py-14">
            <div className="space-y-8">
                <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 rounded-md text-xs font-medium text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to job listings
                </Link>

                {/* Hero header */}
                <SurfaceCard className="relative overflow-hidden p-6 md:p-8">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
                    />

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400">
                                {job.companyLogo ? (
                                    <img
                                        src={job.companyLogo}
                                        alt={`${companyName} logo`}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Factory size={30} aria-hidden="true" />
                                )}
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium text-zinc-400">
                                        {companyName}
                                    </span>

                                    {job.category && (
                                        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-300">
                                            {job.category}
                                        </span>
                                    )}
                                </div>

                                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                                    {job.title}
                                </h1>

                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <DetailPill icon={Pin}>
                                        {job.location || "Remote"}
                                    </DetailPill>
                                    <DetailPill icon={Briefcase}>
                                        {job.type || "Full time"}
                                    </DetailPill>
                                    {hasSalary && (
                                        <DetailPill icon={TagDollar}>
                                            ${formattedSalary} / year
                                        </DetailPill>
                                    )}
                                    <DetailPill icon={Calendar}>
                                        Apply by {deadlineLabel}
                                    </DetailPill>
                                </div>
                            </div>
                        </div>

                        <div className="w-full shrink-0 border-t border-white/[0.08] pt-4 md:w-auto md:border-t-0 md:pt-0">
                            <Link
                                href={`/jobs/${id}/apply`}
                                className={`${buttonStyles.primary} w-full md:w-auto`}
                            >
                                Apply now
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                            <p className="mt-2 text-[11px] text-zinc-500 md:text-right">
                                Takes about 2 minutes
                            </p>
                        </div>
                    </div>
                </SurfaceCard>

                {/* Details + overview */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                    <div className="space-y-6">
                        <ContentCard
                            icon={CircleCheck}
                            title="Key responsibilities"
                        >
                            {job.responsibilities}
                        </ContentCard>

                        <ContentCard
                            icon={ShieldCheck}
                            title="Requirements & qualifications"
                        >
                            {job.requirements}
                        </ContentCard>

                        <ContentCard icon={Star} title="Benefits & perks">
                            {job.benefits}
                        </ContentCard>
                    </div>

                    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                        <SurfaceCard className="p-6">
                            <h2 className="text-sm font-semibold text-white">
                                Job overview
                            </h2>

                            <dl className="mt-5 space-y-4">
                                <OverviewRow
                                    label="Posted"
                                    value={postedDate}
                                />
                                <OverviewRow
                                    label="Location"
                                    value={job.location || "Remote"}
                                />
                                <OverviewRow
                                    label="Job type"
                                    value={job.type || "Full time"}
                                />
                                {hasSalary && (
                                    <OverviewRow
                                        label="Salary"
                                        value={`$${formattedSalary} / year`}
                                    />
                                )}
                                <OverviewRow
                                    label="Application deadline"
                                    value={deadlineLabel}
                                    highlight
                                />
                            </dl>

                            <Link
                                href={`/jobs/${id}/apply`}
                                className={`${buttonStyles.primary} mt-6 w-full`}
                            >
                                Apply now
                            </Link>
                        </SurfaceCard>

                        <SurfaceCard className="p-6">
                            <h2 className="text-sm font-semibold text-white">
                                Before you apply
                            </h2>

                            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-zinc-400">
                                <li className="flex gap-2.5">
                                    <ShieldCheck
                                        size={15}
                                        className="mt-0.5 shrink-0 text-indigo-400"
                                        aria-hidden="true"
                                    />
                                    Your application is sent directly to this
                                    hiring team.
                                </li>
                                <li className="flex gap-2.5">
                                    <CircleCheck
                                        size={15}
                                        className="mt-0.5 shrink-0 text-indigo-400"
                                        aria-hidden="true"
                                    />
                                    You can review your submitted applications
                                    from your dashboard.
                                </li>
                            </ul>
                        </SurfaceCard>
                    </aside>
                </div>
            </div>
        </Container>
    );
}
