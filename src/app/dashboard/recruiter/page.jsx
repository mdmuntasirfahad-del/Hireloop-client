import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowRight,
    Calendar,
    CirclePlus,
    Factory,
    FileText,
    Persons,
    Thunderbolt,
} from "@gravity-ui/icons";
import CompanySnapshot from "@/components/dashboard/CompanySnapshot";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import RecentApplications from "@/components/dashboard/RecentApplications";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getApplicationsByJob } from "@/lib/api/applications";
import { getRecuiterCompanies } from "@/lib/api/companies";
import { getRecruiterJobs } from "@/lib/api/jobs";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "Recruiter Dashboard",
    robots: { index: false, follow: false },
};

const isThisMonth = (value) => {
    if (!value) return false;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    const now = new Date();

    return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
};

const getTimestamp = (value) => {
    if (!value) return 0;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const statusStyles = {
    active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    closed: "border-white/10 bg-white/[0.04] text-zinc-400",
};

export default async function RecruiterDashboardHomePage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/recruiter");
    }

    let company = null;

    try {
        company = await getRecuiterCompanies(user.id);
    } catch (error) {
        console.error("Failed to load recruiter company:", error);
    }

    let jobs = [];

    if (company) {
        try {
            const result = await getRecruiterJobs(company.recruiterId || user.id);
            jobs = Array.isArray(result) ? result : [];
        } catch (error) {
            console.error("Failed to load recruiter jobs:", error);
        }
    }

    jobs.sort(
        (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
    );

    const applicationGroups = await Promise.all(
        jobs.map((job) => getApplicationsByJob(job._id).catch(() => []))
    );
    const applications = applicationGroups.flat();

    const applicantCountByJob = new Map(
        jobs.map((job, index) => [
            String(job._id),
            Array.isArray(applicationGroups[index])
                ? applicationGroups[index].length
                : 0,
        ])
    );

    const activeJobs = jobs.filter(
        (job) => (job.status || "active") === "active"
    ).length;
    const applicationsThisMonth = applications.filter((application) =>
        isThisMonth(application.appliedAt || application.createdAt)
    ).length;

    const firstName = user.name?.split(" ")[0] || "there";
    const companyName = company?.companyName;
    const recentJobs = jobs.slice(0, 4);

    const stats = [
        {
            id: "total-jobs",
            title: "Total job posts",
            value: jobs.length,
            icon: FileText,
            hint: "Across all statuses",
        },
        {
            id: "active-jobs",
            title: "Active jobs",
            value: activeJobs,
            icon: Thunderbolt,
            hint: "Currently visible to candidates",
        },
        {
            id: "total-applicants",
            title: "Total applicants",
            value: applications.length,
            icon: Persons,
            hint: "Candidates across your job posts",
        },
        {
            id: "this-month",
            title: "This month",
            value: applicationsThisMonth,
            icon: Calendar,
            hint: "New applications in the current month",
        },
    ];

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Overview"
                title={`Welcome back, ${firstName}`}
                description={
                    company
                        ? `Here is how ${companyName} is hiring right now.`
                        : "Set up your company profile to start posting jobs and receiving applicants."
                }
                actions={
                    company ? (
                        <Link
                            href="/dashboard/recruiter/jobs/new"
                            className={buttonStyles.primary}
                        >
                            <CirclePlus size={16} aria-hidden="true" />
                            Post a job
                        </Link>
                    ) : (
                        <Link
                            href="/dashboard/recruiter/my-company"
                            className={buttonStyles.primary}
                        >
                            Set up company
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    )
                }
            />

            {company ? (
                <div className="mt-8 space-y-6">
                    <DashboardStats statsData={stats} />

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <RecentApplications
                            applications={applications}
                            viewAllHref="/dashboard/recruiter/jobs"
                        />

                        <div className="space-y-6">
                            <CompanySnapshot company={company} jobs={jobs} />

                            <SurfaceCard className="p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-sm font-semibold text-white">
                                        Your job posts
                                    </h2>

                                    <Link
                                        href="/dashboard/recruiter/jobs"
                                        className="text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                                    >
                                        Manage
                                    </Link>
                                </div>

                                {recentJobs.length > 0 ? (
                                    <ul className="mt-4 divide-y divide-white/[0.06]">
                                        {recentJobs.map((job) => {
                                            const status =
                                                job.status || "active";
                                            const applicantCount =
                                                applicantCountByJob.get(
                                                    String(job._id)
                                                ) || 0;

                                            return (
                                                <li
                                                    key={job._id}
                                                    className="py-3 first:pt-0 last:pb-0"
                                                >
                                                    <Link
                                                        href={`/jobs/${job._id}`}
                                                        className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <p className="truncate text-xs font-medium text-white transition-colors group-hover:text-indigo-200">
                                                                {job.title ||
                                                                    "Untitled job"}
                                                            </p>

                                                            <span
                                                                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                                                                    statusStyles[
                                                                        status
                                                                    ] ||
                                                                    statusStyles.pending
                                                                }`}
                                                            >
                                                                {status}
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 text-[11px] text-zinc-500">
                                                            {applicantCount}{" "}
                                                            applicant
                                                            {applicantCount ===
                                                            1
                                                                ? ""
                                                                : "s"}{" "}
                                                            ·{" "}
                                                            {job.location ||
                                                                "Remote"}
                                                        </p>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
                                        <p className="text-xs text-zinc-400">
                                            No job posts yet.
                                        </p>
                                        <Link
                                            href="/dashboard/recruiter/jobs/new"
                                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                                        >
                                            Post your first job
                                            <ArrowRight
                                                size={13}
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </div>
                                )}
                            </SurfaceCard>
                        </div>
                    </div>
                </div>
            ) : (
                <SurfaceCard className="mt-8 p-8 text-center md:p-12">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                        <Factory size={26} aria-hidden="true" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
                        Register your company to start hiring
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
                        Add your company details, get verified, and publish your
                        first role. Applicants and hiring activity will appear
                        on this dashboard.
                    </p>

                    <div className="mx-auto mt-6 grid max-w-lg grid-cols-1 gap-3 text-left sm:grid-cols-3">
                        {[
                            "Create your company profile",
                            "Publish a job post",
                            "Review applicants",
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3"
                            >
                                <span className="font-mono text-[10px] text-indigo-300">
                                    0{index + 1}
                                </span>
                                <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/dashboard/recruiter/my-company"
                        className={`${buttonStyles.primary} mt-7`}
                    >
                        Register your company
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </SurfaceCard>
            )}
        </Container>
    );
}
