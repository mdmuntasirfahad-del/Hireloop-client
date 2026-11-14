import { FileText } from "@gravity-ui/icons";
import AdminActionForm from "@/components/admin/AdminActionForm";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminQueryError from "@/components/admin/AdminQueryError";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { updateApplicationStatus } from "@/lib/action/admin";
import { formatDate } from "@/lib/admin/format";
import { getAdminApplications } from "@/lib/admin/queries";
import {
    readAdminFilter,
    readAdminPage,
    readAdminQuery,
} from "@/lib/admin/searchParams";

export const metadata = {
    title: "Applications",
};

const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "reviewing", label: "Reviewing" },
    { value: "interviewing", label: "Interviewing" },
    { value: "rejected", label: "Rejected" },
    { value: "hired", label: "Hired" },
];

const applicationStatusOptions = statusOptions.slice(1);

export default async function AdminApplicationsPage({ searchParams }) {
    const params = await searchParams;
    const page = readAdminPage(params);
    const q = readAdminQuery(params);
    const status = readAdminFilter(params, "status", [
        "pending",
        "reviewing",
        "interviewing",
        "rejected",
        "hired",
    ]);

    let result;

    try {
        result = await getAdminApplications({ page, q, status });
    } catch (error) {
        console.error("Failed to load admin applications:", error);

        return (
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="HIRELOOP ADMIN"
                    title="Applications"
                    description="Review applications across HireLoop."
                />
                <div className="mt-8">
                    <AdminQueryError retryHref="/dashboard/admin/applications" />
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="HIRELOOP ADMIN"
                title="Applications"
                description="Track candidate activity across every job and keep application statuses up to date."
                actions={
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <span
                            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                            aria-hidden="true"
                        />
                        {result.total}{" "}
                        {result.total === 1
                            ? "application"
                            : "applications"}
                    </span>
                }
            />

            <div className="mt-8 space-y-4">
                <AdminFilterBar
                    basePath="/dashboard/admin/applications"
                    query={q}
                    queryPlaceholder="Search by applicant, role, company…"
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
                            <table className="w-full min-w-[1100px] text-left text-sm">
                                <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Applicant
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Role
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Company
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Applied
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Documents
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Update
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {result.items.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-white">
                                                    {
                                                        application.applicantName
                                                    }
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-zinc-500">
                                                    {
                                                        application.applicantEmail
                                                    }
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 text-zinc-300">
                                                {application.jobTitle}
                                            </td>
                                            <td className="px-5 py-4 text-zinc-400">
                                                {application.companyName}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                                {formatDate(
                                                    application.appliedAt
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    {application.resumeUrl ? (
                                                        <a
                                                            href={
                                                                application.resumeUrl
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                                                        >
                                                            View resume
                                                        </a>
                                                    ) : (
                                                        <span className="text-[11px] text-zinc-600">
                                                            No resume
                                                        </span>
                                                    )}

                                                    {application.portfolioUrl && (
                                                        <a
                                                            href={
                                                                application.portfolioUrl
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200"
                                                        >
                                                            Portfolio
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <AdminStatusBadge
                                                    status={application.status}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <AdminActionForm
                                                    action={
                                                        updateApplicationStatus
                                                    }
                                                    fields={{
                                                        applicationId:
                                                            application.id,
                                                    }}
                                                    select={{
                                                        name: "status",
                                                        label: `Status for ${application.applicantName}`,
                                                        defaultValue:
                                                            application.status,
                                                        options: applicationStatusOptions,
                                                    }}
                                                    submitLabel="Update"
                                                    pendingLabel="Saving…"
                                                />
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
                        title="No applications match these filters"
                        description="Try a different search term or clear the status filter."
                    />
                )}

                <AdminPagination
                    basePath="/dashboard/admin/applications"
                    page={result.page}
                    totalPages={result.totalPages}
                    filters={{ q, status }}
                />
            </div>
        </Container>
    );
}
