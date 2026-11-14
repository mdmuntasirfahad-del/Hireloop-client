import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowRight,
    Calendar,
    Factory,
    FileText,
} from "@gravity-ui/icons";
import { StatCard } from "@/components/dashboard/StatCard";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getApplicationsByApplicant } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "My Applications",
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

export default async function SeekerApplicationsPage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/seeker/applications");
    }

    let applications = [];

    try {
        const result = await getApplicationsByApplicant(user.id);
        applications = Array.isArray(result) ? result : [];
    } catch (error) {
        console.error("Failed to load applications:", error);
    }

    const thisMonthCount = applications.filter((application) =>
        isThisMonth(application.appliedAt || application.createdAt)
    ).length;

    const companyCount = new Set(
        applications.map((application) => application.companyName).filter(Boolean)
    ).size;

    const stats = [
        {
            id: "total-applications",
            title: "Total applications",
            value: applications.length,
            icon: FileText,
        },
        {
            id: "this-month",
            title: "This month",
            value: thisMonthCount,
            icon: Calendar,
        },
        {
            id: "companies",
            title: "Companies",
            value: companyCount,
            icon: Factory,
        },
    ];

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Applications"
                title="My applications"
                description="Track every position you have applied to on HireLoop."
                actions={
                    <Link href="/jobs" className={buttonStyles.primary}>
                        Browse jobs
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                }
            />

            <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} {...stat} />
                    ))}
                </div>

                {applications.length > 0 ? (
                    <SurfaceCard className="overflow-hidden">
                        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
                            <h2 className="text-sm font-semibold text-white">
                                Application history
                            </h2>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-zinc-400">
                                {applications.length}{" "}
                                {applications.length === 1 ? "role" : "roles"}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Job
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Company
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Applied on
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
                                    {applications.map((application, index) => (
                                        <tr
                                            key={
                                                application._id ||
                                                `${application.jobId}-${index}`
                                            }
                                            className="border-t border-white/[0.06]"
                                        >
                                            <td className="px-5 py-4">
                                                {application.jobId ? (
                                                    <Link
                                                        href={`/jobs/${application.jobId}`}
                                                        className="font-medium text-white transition-colors hover:text-indigo-200"
                                                    >
                                                        {application.jobTitle ||
                                                            "Untitled job"}
                                                    </Link>
                                                ) : (
                                                    <span className="font-medium text-white">
                                                        {application.jobTitle ||
                                                            "Untitled job"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-zinc-400">
                                                {application.companyName || "—"}
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
                                                <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-300">
                                                    {application.status ||
                                                        "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SurfaceCard>
                ) : (
                    <EmptyState
                        icon={FileText}
                        title="No applications yet"
                        description="Once you apply for a role, it will show up here with its current status."
                        action={
                            <Link
                                href="/jobs"
                                className={buttonStyles.primary}
                            >
                                Browse open roles
                            </Link>
                        }
                    />
                )}
            </div>
        </Container>
    );
}
