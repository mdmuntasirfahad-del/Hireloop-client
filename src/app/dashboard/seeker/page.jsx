import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowRight,
    Calendar,
    CreditCard,
    Factory,
    FileText,
    Gear,
    Magnifier,
} from "@gravity-ui/icons";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getApplicationsByApplicant } from "@/lib/api/applications";
import { getPlanById } from "@/lib/api/plans";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "Seeker Dashboard",
    robots: { index: false, follow: false },
};

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

const quickLinks = [
    {
        label: "Browse open roles",
        description: "Find your next opportunity",
        href: "/jobs",
        icon: Magnifier,
    },
    {
        label: "Saved jobs",
        description: "Roles you want to revisit",
        href: "/dashboard/seeker/saved-jobs",
        icon: FileText,
    },
    {
        label: "Account settings",
        description: "Update your profile details",
        href: "/dashboard/seeker/settings",
        icon: Gear,
    },
];

export default async function SeekerDashboardHomePage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/seeker");
    }

    const [applicationsResult, plan] = await Promise.all([
        getApplicationsByApplicant(user.id).catch(() => []),
        getPlanById(user.plan || "seeker_free").catch(() => null),
    ]);

    const applications = Array.isArray(applicationsResult)
        ? applicationsResult
        : [];
    const applicationsThisMonth = applications.filter((application) =>
        isThisMonth(application.appliedAt || application.createdAt)
    ).length;
    const companyCount = new Set(
        applications.map((application) => application.companyName).filter(Boolean)
    ).size;

    const planName = plan?.name || "Free";
    const limit = Number(plan?.maxApplicationsPerMonth) || 3;
    const remaining = Math.max(limit - applicationsThisMonth, 0);
    const usagePercent =
        limit > 0
            ? Math.min((applicationsThisMonth / limit) * 100, 100)
            : 0;

    const recentApplications = [...applications]
        .sort(
            (a, b) =>
                getTimestamp(b.appliedAt || b.createdAt) -
                getTimestamp(a.appliedAt || a.createdAt)
        )
        .slice(0, 5);

    const firstName = user.name?.split(" ")[0] || "there";

    const stats = [
        {
            id: "total-applications",
            title: "Total applications",
            value: applications.length,
            icon: FileText,
            hint: "Every role you have applied to",
        },
        {
            id: "this-month",
            title: "This month",
            value: applicationsThisMonth,
            icon: Calendar,
            hint: `${remaining} application${
                remaining === 1 ? "" : "s"
            } remaining on ${planName}`,
        },
        {
            id: "companies",
            title: "Companies",
            value: companyCount,
            icon: Factory,
            hint: "Companies you have applied to",
        },
        {
            id: "plan",
            title: "Current plan",
            value: planName,
            icon: CreditCard,
            hint: `Up to ${limit} applications per month`,
        },
    ];

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Overview"
                title={`Welcome back, ${firstName}`}
                description="Track your applications, monthly usage, and next steps from one place."
                actions={
                    <Link href="/jobs" className={buttonStyles.primary}>
                        Browse jobs
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                }
            />

            <div className="mt-8 space-y-6">
                <DashboardStats statsData={stats} />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    {/* Recent applications */}
                    <SurfaceCard className="overflow-hidden">
                        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
                            <div>
                                <h2 className="text-sm font-semibold text-white">
                                    Recent applications
                                </h2>
                                <p className="mt-0.5 text-xs text-zinc-500">
                                    Your latest submissions and their status.
                                </p>
                            </div>

                            {applications.length > 0 && (
                                <Link
                                    href="/dashboard/seeker/applications"
                                    className="shrink-0 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                                >
                                    View all
                                </Link>
                            )}
                        </div>

                        {recentApplications.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px] text-left text-sm">
                                    <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">
                                                Job
                                            </th>
                                            <th className="px-5 py-3 font-medium">
                                                Company
                                            </th>
                                            <th className="px-5 py-3 font-medium">
                                                Applied
                                            </th>
                                            <th className="px-5 py-3 font-medium">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentApplications.map(
                                            (application, index) => (
                                                <tr
                                                    key={
                                                        application._id ||
                                                        `${application.jobId}-${index}`
                                                    }
                                                    className="border-t border-white/[0.06]"
                                                >
                                                    <td className="px-5 py-3.5">
                                                        <Link
                                                            href={`/jobs/${application.jobId}`}
                                                            className="font-medium text-white transition-colors hover:text-indigo-200"
                                                        >
                                                            {application.jobTitle ||
                                                                "Untitled job"}
                                                        </Link>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-zinc-400">
                                                        {application.companyName ||
                                                            "—"}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-zinc-400">
                                                        {formatDate(
                                                            application.appliedAt ||
                                                                application.createdAt
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-300">
                                                            {application.status ||
                                                                "Pending"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400">
                                    <FileText size={22} aria-hidden="true" />
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-white">
                                    No applications yet
                                </h3>

                                <p className="mt-1 max-w-sm text-sm leading-relaxed text-zinc-400">
                                    Apply to your first role and it will show up
                                    here with its current status.
                                </p>

                                <Link
                                    href="/jobs"
                                    className={`${buttonStyles.secondary} mt-5`}
                                >
                                    Browse open roles
                                </Link>
                            </div>
                        )}
                    </SurfaceCard>

                    <div className="space-y-6">
                        {/* Monthly usage */}
                        <SurfaceCard className="p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium text-zinc-500">
                                        Current plan
                                    </p>
                                    <h2 className="mt-1 text-lg font-semibold text-white">
                                        {planName}
                                    </h2>
                                </div>

                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                                    {remaining > 0 ? "Active" : "Limit reached"}
                                </span>
                            </div>

                            <div className="mt-5 flex items-end justify-between gap-3">
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    {applicationsThisMonth}
                                    <span className="text-sm font-medium text-zinc-500">
                                        {" "}
                                        / {limit}
                                    </span>
                                </p>
                                <span className="text-[11px] text-zinc-500">
                                    this month
                                </span>
                            </div>

                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>

                            <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
                                {remaining > 0
                                    ? `${remaining} application${
                                          remaining === 1 ? "" : "s"
                                      } remaining this month.`
                                    : "You have reached your monthly application limit."}
                            </p>

                            <Link
                                href="/dashboard/seeker/billing"
                                className={`${buttonStyles.secondary} mt-5 w-full`}
                            >
                                Manage plan
                                <ArrowRight size={15} aria-hidden="true" />
                            </Link>
                        </SurfaceCard>

                        {/* Quick links */}
                        <SurfaceCard className="p-3">
                            <ul>
                                {quickLinks.map(
                                    ({ label, description, href, icon: Icon }) => (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400">
                                                    <Icon
                                                        size={15}
                                                        aria-hidden="true"
                                                    />
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-xs font-medium text-white">
                                                        {label}
                                                    </span>
                                                    <span className="mt-0.5 block text-[11px] text-zinc-500">
                                                        {description}
                                                    </span>
                                                </span>

                                                <ArrowRight
                                                    size={14}
                                                    aria-hidden="true"
                                                    className="shrink-0 text-zinc-600"
                                                />
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </SurfaceCard>
                    </div>
                </div>
            </div>
        </Container>
    );
}
