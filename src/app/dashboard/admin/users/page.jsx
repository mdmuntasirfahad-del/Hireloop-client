import { Persons } from "@gravity-ui/icons";
import AdminActionForm from "@/components/admin/AdminActionForm";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminQueryError from "@/components/admin/AdminQueryError";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { updateUserRole } from "@/lib/action/admin";
import { getAdminSession } from "@/lib/admin/guard";
import { getAdminUsers } from "@/lib/admin/queries";
import {
    readAdminFilter,
    readAdminPage,
    readAdminQuery,
} from "@/lib/admin/searchParams";
import { formatDate, titleCase } from "@/lib/admin/format";

export const metadata = {
    title: "Users",
};

const roleOptions = [
    { value: "", label: "All roles" },
    { value: "seeker", label: "Seekers" },
    { value: "recruiter", label: "Recruiters" },
    { value: "admin", label: "Administrators" },
    { value: "unassigned", label: "Unassigned" },
];

export default async function AdminUsersPage({ searchParams }) {
    const params = await searchParams;
    const page = readAdminPage(params);
    const q = readAdminQuery(params);
    const role = readAdminFilter(params, "role", [
        "seeker",
        "recruiter",
        "admin",
        "unassigned",
    ]);

    const admin = await getAdminSession();

    let result;

    try {
        result = await getAdminUsers({ page, q, role });
    } catch (error) {
        console.error("Failed to load admin users:", error);

        return (
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="HIRELOOP ADMIN"
                    title="Users"
                    description="Search and manage HireLoop accounts."
                />
                <div className="mt-8">
                    <AdminQueryError retryHref="/dashboard/admin/users" />
                </div>
            </Container>
        );
    }

    const hasFilters = Boolean(q || role);

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="HIRELOOP ADMIN"
                title="Users"
                description="Review every account, understand who is using HireLoop, and keep role assignments accurate."
                actions={
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <span
                            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                            aria-hidden="true"
                        />
                        {result.total} {result.total === 1 ? "user" : "users"}
                    </span>
                }
            />

            <div className="mt-8 space-y-4">
                <AdminFilterBar
                    basePath="/dashboard/admin/users"
                    query={q}
                    queryPlaceholder="Search by name or email…"
                    filters={[
                        {
                            name: "role",
                            label: "Role",
                            value: role,
                            options: roleOptions,
                        },
                    ]}
                />

                {result.items.length > 0 ? (
                    <SurfaceCard className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            User
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Role
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Plan
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Joined
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Account
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {result.items.map((user) => {
                                        const isCurrent = user.id === admin?.id;
                                        const isAdmin = user.role === "admin";

                                        return (
                                            <tr
                                                key={user.id}
                                                className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="font-medium text-white">
                                                        {user.name}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-zinc-500">
                                                        {user.email}
                                                    </p>
                                                    {user.phoneNumber && (
                                                        <p className="mt-0.5 text-[11px] text-zinc-600">
                                                            {user.phoneNumber}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <AdminStatusBadge
                                                            status={user.role}
                                                        />

                                                        {!isAdmin &&
                                                            !isCurrent && (
                                                                <AdminActionForm
                                                                    action={
                                                                        updateUserRole
                                                                    }
                                                                    fields={{
                                                                        userId: user.id,
                                                                    }}
                                                                    select={{
                                                                        name: "role",
                                                                        label: `Role for ${
                                                                            user.name
                                                                        }`,
                                                                        defaultValue:
                                                                            user.role ===
                                                                            "recruiter"
                                                                                ? "recruiter"
                                                                                : "seeker",
                                                                        options: [
                                                                            {
                                                                                value: "seeker",
                                                                                label: "Seeker",
                                                                            },
                                                                            {
                                                                                value: "recruiter",
                                                                                label: "Recruiter",
                                                                            },
                                                                        ],
                                                                    }}
                                                                    submitLabel="Update"
                                                                />
                                                            )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-zinc-400">
                                                    {user.plan
                                                        ? titleCase(user.plan)
                                                        : "—"}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                                                    {formatDate(
                                                        user.createdAt
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    {isCurrent ? (
                                                        <span className="text-[11px] font-medium text-indigo-300">
                                                            Current account
                                                        </span>
                                                    ) : user.emailVerified ? (
                                                        <span className="text-[11px] text-emerald-300">
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-zinc-500">
                                                            Unverified
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </SurfaceCard>
                ) : (
                    <EmptyState
                        icon={Persons}
                        title="No users match these filters"
                        description="Try a different search term or clear the role filter."
                    />
                )}

                <AdminPagination
                    basePath="/dashboard/admin/users"
                    page={result.page}
                    totalPages={result.totalPages}
                    filters={{ q, role }}
                />

                {hasFilters && result.items.length === 0 && (
                    <p className="text-center text-xs text-zinc-500">
                        Use Reset in the filter bar to see every account.
                    </p>
                )}
            </div>
        </Container>
    );
}
