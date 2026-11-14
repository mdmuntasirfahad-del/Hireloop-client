import Link from "next/link";
import { ArrowUpRightFromSquare, Factory } from "@gravity-ui/icons";
import AdminActionForm from "@/components/admin/AdminActionForm";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminQueryError from "@/components/admin/AdminQueryError";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { setCompanyApproval } from "@/lib/action/admin";
import { formatDate, titleCase } from "@/lib/admin/format";
import { getAdminCompanies } from "@/lib/admin/queries";
import {
    readAdminFilter,
    readAdminPage,
    readAdminQuery,
} from "@/lib/admin/searchParams";

export const metadata = {
    title: "Companies",
};

const approvalOptions = [
    { value: "", label: "All companies" },
    { value: "pending", label: "Pending review" },
    { value: "approved", label: "Approved" },
];

export default async function AdminCompaniesPage({ searchParams }) {
    const params = await searchParams;
    const page = readAdminPage(params);
    const q = readAdminQuery(params);
    const approval = readAdminFilter(params, "approval", [
        "pending",
        "approved",
    ]);

    let result;

    try {
        result = await getAdminCompanies({ page, q, approval });
    } catch (error) {
        console.error("Failed to load admin companies:", error);

        return (
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="HIRELOOP ADMIN"
                    title="Companies"
                    description="Review company profiles on HireLoop."
                />
                <div className="mt-8">
                    <AdminQueryError retryHref="/dashboard/admin/companies" />
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="HIRELOOP ADMIN"
                title="Companies"
                description="Approve company profiles, review their hiring footprint, and keep recruiter details accurate."
                actions={
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <span
                            className="h-1.5 w-1.5 rounded-full bg-amber-400"
                            aria-hidden="true"
                        />
                        {result.total}{" "}
                        {result.total === 1 ? "company" : "companies"}
                    </span>
                }
            />

            <div className="mt-8 space-y-4">
                <AdminFilterBar
                    basePath="/dashboard/admin/companies"
                    query={q}
                    queryPlaceholder="Search by company, industry, location…"
                    filters={[
                        {
                            name: "approval",
                            label: "Approval",
                            value: approval,
                            options: approvalOptions,
                        },
                    ]}
                />

                {result.items.length > 0 ? (
                    <SurfaceCard className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1040px] text-left text-sm">
                                <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Company
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Recruiter
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Industry
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Jobs
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Plan
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Created
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {result.items.map((company) => (
                                        <tr
                                            key={company.id}
                                            className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {company.logoUrl ? (
                                                        <img
                                                            src={company.logoUrl}
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

                                                    <div className="min-w-0">
                                                        <p className="font-medium text-white">
                                                            {
                                                                company.companyName
                                                            }
                                                        </p>
                                                        <p className="mt-0.5 text-[11px] text-zinc-500">
                                                            {
                                                                company.location
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-zinc-300">
                                                    {company.recruiterName}
                                                </p>
                                                {company.recruiterEmail && (
                                                    <p className="mt-0.5 text-[11px] text-zinc-500">
                                                        {
                                                            company.recruiterEmail
                                                        }
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-zinc-400">
                                                {company.industry}
                                            </td>
                                            <td className="px-5 py-4 text-zinc-300">
                                                {company.jobsCount}
                                            </td>
                                            <td className="px-5 py-4 text-zinc-400">
                                                {company.plan
                                                    ? titleCase(company.plan)
                                                    : "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                                {formatDate(
                                                    company.createdAt
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <AdminStatusBadge
                                                    status={company.status}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <AdminActionForm
                                                        action={
                                                            setCompanyApproval
                                                        }
                                                        fields={{
                                                            companyId:
                                                                company.id,
                                                            approved:
                                                                company.isApproved
                                                                    ? "false"
                                                                    : "true",
                                                        }}
                                                        submitLabel={
                                                            company.isApproved
                                                                ? "Revoke"
                                                                : "Approve"
                                                        }
                                                        pendingLabel="Saving…"
                                                        variant={
                                                            company.isApproved
                                                                ? "danger"
                                                                : "success"
                                                        }
                                                        confirmMessage={
                                                            company.isApproved
                                                                ? "Revoke this company's approval?"
                                                                : ""
                                                        }
                                                    />

                                                    {company.website && (
                                                        <Link
                                                            href={
                                                                company.website
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
                                                        >
                                                            Website
                                                            <ArrowUpRightFromSquare
                                                                size={11}
                                                                aria-hidden="true"
                                                            />
                                                        </Link>
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
                        icon={Factory}
                        title="No companies match these filters"
                        description="Try a different search term or clear the approval filter."
                    />
                )}

                <AdminPagination
                    basePath="/dashboard/admin/companies"
                    page={result.page}
                    totalPages={result.totalPages}
                    filters={{ q, approval }}
                />
            </div>
        </Container>
    );
}
