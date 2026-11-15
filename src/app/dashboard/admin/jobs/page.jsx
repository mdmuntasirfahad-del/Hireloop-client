import Link from "next/link";
import {
    ArrowUpRightFromSquare,
    Briefcase,
    Factory,
} from "@gravity-ui/icons";
import AdminActionForm from "@/components/admin/AdminActionForm";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminQueryError from "@/components/admin/AdminQueryError";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { updateJobStatus } from "@/lib/action/admin";
import { formatDate, formatSalary } from "@/lib/admin/format";
import { getAdminJobs } from "@/lib/admin/queries";
import {
    readAdminFilter,
    readAdminPage,
    readAdminQuery,
} from "@/lib/admin/searchParams";

export const metadata = {
    title: "Jobs",
};

const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "closed", label: "Closed" },
];

export default async function AdminJobsPage({ searchParams }) {
    const params = await searchParams;
    const page = readAdminPage(params);
    const q = readAdminQuery(params);
    const status = readAdminFilter(params, "status", [
        "active",
        "pending",
        "closed",
    ]);

    let result;

    try {
        result = await getAdminJobs({ page, q, status });
    } catch (error) {
        console.error("Failed to load admin jobs:", error);

        return (
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="HIRELOOP ADMIN"
                    title="Jobs"
                    description="Review and moderate job listings."
                />
                <div className="mt-8">
                    <AdminQueryError retryHref="/dashboard/admin/jobs" />
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="HIRELOOP ADMIN"
                title="Jobs"
                description="Moderate every role on HireLoop. Closing a job removes it from the public board."
                actions={
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <span
                            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                            aria-hidden="true"
                        />
                        {result.total} {result.total === 1 ? "job" : "jobs"}
                    </span>
                }
            />

            <div className="mt-8 space-y-4">
                <AdminFilterBar
                    basePath="/dashboard/admin/jobs"
                    query={q}
                    queryPlaceholder="Search by role, company, location…"
                    filters={[
                        {
                            name: "status",
                            label: "Status",
                            value: status,
                            options: statusOptions,
                        },
                    ]}
                />

                {result.items.length > 0 ? (
                    <SurfaceCard className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1160px] text-left text-sm">
                                <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Role
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Company
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Recruiter
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Type
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Salary
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Posted
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {result.items.map((job) => (
                                        <tr
                                            key={job.id}
                                            className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="px-5 py-4">
                                                <Link
                                                    href={job.publicHref}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-indigo-200"
                                                >
                                                    {job.title}
                                                    <ArrowUpRightFromSquare
                                                        size={12}
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                                <p className="mt-0.5 text-[11px] text-zinc-500">
                                                    {job.category} ·{" "}
                                                    {job.location}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {job.companyLogoUrl ? (
                                                        <img
                                                            src={
                                                                job.companyLogoUrl
                                                            }
                                                            alt=""
                                                            className="h-8 w-8 rounded-lg border border-white/10 object-cover"
                                                        />
                                                    ) : (
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-500">
                                                            <Factory
                                                                size={15}
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    )}
                                                    <span className="text-zinc-300">
                                                        {job.companyName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-zinc-300">
                                                    {job.recruiterName}
                                                </p>
                                                {job.recruiterEmail && (
                                                    <p className="mt-0.5 text-[11px] text-zinc-500">
                                                        {job.recruiterEmail}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                                {job.type}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-zinc-300">
                                                {formatSalary(job.salary)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                                {formatDate(job.createdAt)}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <AdminStatusBadge
                                                    status={job.status}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {job.status !== "active" && (
                                                        <AdminActionForm
                                                            action={
                                                                updateJobStatus
                                                            }
                                                            fields={{
                                                                jobId: job.id,
                                                                status: "active",
                                                            }}
                                                            submitLabel="Activate"
                                                            pendingLabel="Saving…"
                                                            variant="success"
                                                        />
                                                    )}

                                                    {job.status !== "pending" && (
                                                        <AdminActionForm
                                                            action={
                                                                updateJobStatus
                                                            }
                                                            fields={{
                                                                jobId: job.id,
                                                                status: "pending",
                                                            }}
                                                            submitLabel="Pending"
                                                            pendingLabel="Saving…"
                                                            variant="secondary"
                                                        />
                                                    )}

                                                    {job.status !== "closed" && (
                                                        <AdminActionForm
                                                            action={
                                                                updateJobStatus
                                                            }
                                                            fields={{
                                                                jobId: job.id,
                                                                status: "closed",
                                                            }}
                                                            submitLabel="Close"
                                                            pendingLabel="Saving…"
                                                            variant="danger"
                                                            confirmMessage="Close this job? It will disappear from the public job board."
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SurfaceCard>
                ) : (
                    <EmptyState
                        icon={Briefcase}
                        title="No jobs match these filters"
                        description="Try a different search term or clear the status filter."
                    />
                )}

                <AdminPagination
                    basePath="/dashboard/admin/jobs"
                    page={result.page}
                    totalPages={result.totalPages}
                    filters={{ q, status }}
                />
            </div>
        </Container>
    );
}
