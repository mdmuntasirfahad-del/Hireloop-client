import Link from "next/link";
import {
    ArrowDownToLine,
    Briefcase,
    FileText,
    Persons,
    Receipt,
} from "@gravity-ui/icons";
import AdminBreakdownList from "@/components/admin/AdminBreakdownList";
import AdminQueryError from "@/components/admin/AdminQueryError";
import AdminTrendChart from "@/components/admin/AdminTrendChart";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { formatDate, formatNumber } from "@/lib/admin/format";
import { getAdminReports } from "@/lib/admin/queries";
import { readAdminRange } from "@/lib/admin/searchParams";

export const metadata = {
    title: "Reports",
};

const ranges = [
    { value: 7, label: "7 days" },
    { value: 30, label: "30 days" },
    { value: 90, label: "90 days" },
];

const rangeClass = (active) =>
    `inline-flex h-9 items-center rounded-xl border px-3 text-xs font-medium transition-colors ${
        active
            ? "border-indigo-400/40 bg-indigo-500/15 text-white"
            : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-white"
    }`;

const exportLinks = [
    { type: "users", label: "Users", icon: Persons },
    { type: "jobs", label: "Jobs", icon: Briefcase },
    { type: "companies", label: "Companies", icon: Receipt },
    { type: "applications", label: "Applications", icon: FileText },
];

export default async function AdminReportsPage({ searchParams }) {
    const params = await searchParams;
    const range = readAdminRange(params);

    let report;

    try {
        report = await getAdminReports(range);
    } catch (error) {
        console.error("Failed to load admin reports:", error);

        return (
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="HIRELOOP ADMIN"
                    title="Reports"
                    description="Platform activity and growth reporting."
                />
                <div className="mt-8">
                    <AdminQueryError retryHref="/dashboard/admin/reports" />
                </div>
            </Container>
        );
    }

    const stats = [
        {
            id: "new-users",
            title: "New users",
            value: formatNumber(report.newUsers),
            icon: Persons,
            hint: `${formatNumber(
                report.totals.users
            )} registered accounts in total`,
        },
        {
            id: "new-jobs",
            title: "New jobs",
            value: formatNumber(report.newJobs),
            icon: Briefcase,
            hint: `${formatNumber(
                report.totals.activeJobs
            )} active roles right now`,
        },
        {
            id: "new-applications",
            title: "New applications",
            value: formatNumber(report.newApplications),
            icon: FileText,
            hint: `${formatNumber(
                report.totals.applications
            )} applications in total`,
        },
        {
            id: "new-companies",
            title: "New companies",
            value: formatNumber(report.newCompanies),
            icon: Receipt,
            hint: `${formatNumber(
                report.totals.pendingCompanies
            )} companies awaiting review`,
        },
    ];

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="HIRELOOP ADMIN"
                title="Reports"
                description="Understand platform growth, application activity, and the shape of the HireLoop marketplace."
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        {ranges.map((item) => (
                            <Link
                                key={item.value}
                                href={`/dashboard/admin/reports?range=${item.value}`}
                                className={rangeClass(
                                    range === item.value
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                }
            />

            <div className="mt-8 space-y-6">
                <p className="text-xs text-zinc-500">
                    Showing activity since{" "}
                    <span className="text-zinc-300">
                        {formatDate(report.since)}
                    </span>
                    .
                </p>

                <DashboardStats statsData={stats} />

                <div className="grid gap-6 xl:grid-cols-3">
                    <AdminTrendChart
                        title="New users"
                        description="Account registrations in this period."
                        data={report.trends.users}
                        accent="indigo"
                    />
                    <AdminTrendChart
                        title="New jobs"
                        description="Roles posted in this period."
                        data={report.trends.jobs}
                        accent="emerald"
                    />
                    <AdminTrendChart
                        title="Applications"
                        description="Applications submitted in this period."
                        data={report.trends.applications}
                        accent="amber"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <AdminBreakdownList
                        title="Jobs by category"
                        description="All-time role distribution."
                        data={report.topCategories}
                        accent="indigo"
                    />
                    <AdminBreakdownList
                        title="Jobs by location"
                        description="Where HireLoop roles are based."
                        data={report.topLocations}
                        accent="emerald"
                    />
                    <AdminBreakdownList
                        title="Application pipeline"
                        description="All applications by current status."
                        data={report.pipeline}
                        accent="fuchsia"
                    />
                </div>

                <SurfaceCard className="p-5 md:p-6">
                    <div className="flex flex-col gap-2 border-b border-white/[0.06] pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                                <ArrowDownToLine
                                    size={16}
                                    aria-hidden="true"
                                    className="text-indigo-300"
                                />
                                Export reports
                            </h2>
                            <p className="mt-1 text-xs text-zinc-500">
                                Download CSV files for the selected{" "}
                                {report.rangeDays}-day period.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {exportLinks.map(({ type, label, icon: Icon }) => (
                            <Link
                                key={type}
                                href={`/api/admin/reports/export?type=${type}&range=${report.rangeDays}`}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.07] hover:text-white"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <Icon
                                        size={15}
                                        aria-hidden="true"
                                        className="text-indigo-300"
                                    />
                                    {label}
                                </span>
                                <ArrowDownToLine
                                    size={14}
                                    aria-hidden="true"
                                    className="text-zinc-500"
                                />
                            </Link>
                        ))}
                    </div>
                </SurfaceCard>
            </div>
        </Container>
    );
}
