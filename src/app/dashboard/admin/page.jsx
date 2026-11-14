import Link from "next/link";
import {
    ArrowRight,
    Briefcase,
    Factory,
    FileText,
    Persons,
} from "@gravity-ui/icons";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import RecentApplications from "@/components/dashboard/RecentApplications";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { formatDate, formatNumber } from "@/lib/admin/format";
import { getAdminOverview } from "@/lib/admin/queries";

export const metadata = {
    title: "Overview",
};

export default async function AdminOverviewPage() {
    const overview = await getAdminOverview();
    const { counts } = overview;

    const stats = [
        {
            id: "users",
            title: "Total users",
            value: formatNumber(counts.users),
            icon: Persons,
            hint: `${counts.seekers} seekers · ${counts.recruiters} recruiters · ${counts.admins} admins`,
        },
        {
            id: "jobs",
            title: "Active jobs",
            value: formatNumber(counts.activeJobs),
            icon: Briefcase,
            hint: `${counts.jobs} total roles across ${counts.companies} companies`,
        },
        {
            id: "companies",
            title: "Pending companies",
            value: formatNumber(counts.pendingCompanies),
            icon: Factory,
            hint: `${counts.companies} company profiles registered`,
        },
        {
            id: "applications",
            title: "Applications",
            value: formatNumber(counts.applications),
            icon: FileText,
            hint: "Applications submitted across all roles",
        },
    ];

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="HIRELOOP ADMIN"
                title="Platform overview"
                description="Monitor activity, review pending companies, and keep the HireLoop marketplace moving."
                actions={
                    <Link
                        href="/jobs"
                        className={buttonStyles.secondary}
                    >
                        View job board
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                }
            />

            <div className="mt-8 space-y-6">
                <DashboardStats statsData={stats} />

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <SurfaceCard className="overflow-hidden">
                        <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
                            <div>
                                <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                                    <Factory
                                        size={16}
                                        aria-hidden="true"
                                        className="text-amber-300"
                                    />
                                    Companies awaiting review
                                </h2>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Approve company profiles so recruiters can
                                    establish their presence.
                                </p>
                            </div>

                            <Link
                                href="/dashboard/admin/companies"
                                className="shrink-0 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                            >
                                Manage
                            </Link>
                        </div>

                        {overview.pendingCompanies.length > 0 ? (
                            <ul className="divide-y divide-white/[0.06]">
                                {overview.pendingCompanies.map((company) => (
                                    <li
                                        key={company.id}
                                        className="flex items-center justify-between gap-4 px-5 py-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">
                                                {company.companyName}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-zinc-500">
                                                {company.recruiterName} ·{" "}
                                                {company.industry}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-3">
                                            <span className="hidden text-[11px] text-zinc-500 sm:inline">
                                                {formatDate(company.createdAt)}
                                            </span>
                                            <AdminStatusBadge status="pending" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-5 py-10 text-center text-sm text-zinc-500">
                                No companies are waiting for approval.
                            </p>
                        )}
                    </SurfaceCard>

                    <SurfaceCard className="overflow-hidden">
                        <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
                            <div>
                                <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                                    <Persons
                                        size={16}
                                        aria-hidden="true"
                                        className="text-indigo-300"
                                    />
                                    Newest members
                                </h2>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Recently registered HireLoop accounts.
                                </p>
                            </div>

                            <Link
                                href="/dashboard/admin/users"
                                className="shrink-0 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                            >
                                View all
                            </Link>
                        </div>

                        {overview.recentUsers.length > 0 ? (
                            <ul className="divide-y divide-white/[0.06]">
                                {overview.recentUsers.map((user) => (
                                    <li
                                        key={user.id}
                                        className="flex items-center justify-between gap-4 px-5 py-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">
                                                {user.name}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-zinc-500">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-[11px] capitalize text-zinc-300">
                                                {user.role === "unassigned"
                                                    ? "Unassigned"
                                                    : user.role}
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-zinc-600">
                                                {formatDate(user.createdAt)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-5 py-10 text-center text-sm text-zinc-500">
                                No members yet.
                            </p>
                        )}
                    </SurfaceCard>
                </div>

                <RecentApplications
                    applications={overview.recentApplications}
                    viewAllHref="/dashboard/admin/applications"
                    title="Latest applications"
                    description="The most recent applications across all open roles."
                />

                <SurfaceCard className="overflow-hidden">
                    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
                        <div>
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                                <Briefcase
                                    size={16}
                                    aria-hidden="true"
                                    className="text-indigo-300"
                                />
                                Recently posted jobs
                            </h2>
                            <p className="mt-1 text-xs text-zinc-500">
                                Keep an eye on new roles entering the
                                marketplace.
                            </p>
                        </div>

                        <Link
                            href="/dashboard/admin/jobs"
                            className="shrink-0 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                        >
                            View all
                        </Link>
                    </div>

                    {overview.recentJobs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left text-sm">
                                <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Role
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Company
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Posted
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overview.recentJobs.map((job) => (
                                        <tr
                                            key={job.id}
                                            className="border-t border-white/[0.06]"
                                        >
                                            <td className="px-5 py-4">
                                                <Link
                                                    href={`/dashboard/admin/jobs?q=${encodeURIComponent(
                                                        job.title
                                                    )}`}
                                                    className="font-medium text-white transition-colors hover:text-indigo-200"
                                                >
                                                    {job.title}
                                                </Link>
                                                <p className="mt-0.5 text-[11px] text-zinc-500">
                                                    {job.location}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 text-zinc-400">
                                                {job.companyName}
                                            </td>
                                            <td className="px-5 py-4 text-zinc-400">
                                                {formatDate(job.createdAt)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <AdminStatusBadge
                                                    status={job.status}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="px-5 py-10 text-center text-sm text-zinc-500">
                            No jobs have been posted yet.
                        </p>
                    )}
                </SurfaceCard>
            </div>
        </Container>
    );
}
