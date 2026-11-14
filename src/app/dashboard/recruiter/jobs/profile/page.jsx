import Link from "next/link";
import { redirect } from "next/navigation";
import {
    AvatarRoot,
    AvatarImage,
    AvatarFallback,
} from "@heroui/react";
import {
    ArrowRight,
    Briefcase,
    Calendar,
    CirclePlus,
    Envelope,
    Factory,
    Globe,
    LocationArrow,
    OfficeBadge,
    ShieldCheck,
} from "@gravity-ui/icons";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getRecuiterCompanies } from "@/lib/api/companies";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "Recruiter Profile",
    robots: { index: false, follow: false },
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const Detail = ({ label, value, mono = false }) => (
    <div>
        <dt className="text-xs font-medium text-zinc-500">{label}</dt>
        <dd
            className={`mt-1 text-sm text-zinc-200 ${
                mono ? "break-all font-mono text-xs" : ""
            }`}
        >
            {value || "—"}
        </dd>
    </div>
);

const quickActions = [
    {
        label: "Post a new job",
        description: "Publish a role to the job board",
        href: "/dashboard/recruiter/jobs/new",
        icon: CirclePlus,
    },
    {
        label: "Manage job posts",
        description: "Review and update active roles",
        href: "/dashboard/recruiter/jobs",
        icon: Briefcase,
    },
    {
        label: "Company profile",
        description: "View or edit your company details",
        href: "/dashboard/recruiter/my-company",
        icon: Factory,
    },
];

export default async function RecruiterProfilePage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/recruiter/jobs/profile");
    }

    const company = await getRecuiterCompanies(user.id).catch(() => null);
    const companyName = company?.companyName || "No company registered";

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Profile"
                title="Recruiter profile"
                description="Your account details and the company you hire for."
                actions={
                    <Link
                        href="/dashboard/recruiter/my-company"
                        className={buttonStyles.secondary}
                    >
                        Manage company
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                }
            />

            <div className="mt-8 max-w-5xl space-y-6">
                {/* Profile banner */}
                <SurfaceCard className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7">
                    <div className="flex min-w-0 items-center gap-4">
                        <AvatarRoot
                            size="lg"
                            className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04]"
                        >
                            <AvatarImage
                                src={user?.image || "/images/profile.jpg"}
                                alt={user?.name || "Recruiter"}
                            />
                            <AvatarFallback className="text-xl font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || "R"}
                            </AvatarFallback>
                        </AvatarRoot>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-semibold tracking-tight text-white">
                                    {user?.name || "Recruiter"}
                                </h2>

                                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                                    <OfficeBadge size={12} aria-hidden="true" />
                                    Recruiter
                                </span>
                            </div>

                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
                                <Envelope size={13} aria-hidden="true" />
                                {user?.email || "recruiter@company.com"}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck
                                        size={12}
                                        aria-hidden="true"
                                        className="text-emerald-400"
                                    />
                                    Account active
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} aria-hidden="true" />
                                    Joined {formatDate(user?.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 border-t border-white/[0.06] pt-4 md:border-0 md:pt-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400">
                            {company?.logoUrl ? (
                                <img
                                    src={company.logoUrl}
                                    alt={`${companyName} logo`}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Factory size={20} aria-hidden="true" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                                Associated company
                            </p>
                            <p className="mt-0.5 truncate text-xs font-medium text-white">
                                {companyName}
                            </p>
                        </div>
                    </div>
                </SurfaceCard>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    {/* Account details */}
                    <SurfaceCard className="p-6 md:p-7">
                        <div className="border-b border-white/[0.06] pb-4">
                            <h2 className="text-sm font-semibold text-white">
                                Account details
                            </h2>
                            <p className="mt-0.5 text-xs text-zinc-500">
                                Your registered profile information stored on
                                HireLoop.
                            </p>
                        </div>

                        <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Detail label="Full name" value={user?.name} />
                            <Detail label="Email address" value={user?.email} />
                            <Detail
                                label="Phone number"
                                value={user?.phoneNumber}
                            />
                            <Detail label="Account role" value="Recruiter" />
                            <Detail
                                label="Member since"
                                value={formatDate(user?.createdAt)}
                            />
                            <Detail label="Recruiter ID" value={user?.id} mono />
                        </dl>
                    </SurfaceCard>

                    <div className="space-y-6">
                        {/* Company summary */}
                        <SurfaceCard className="p-6">
                            <h2 className="text-sm font-semibold text-white">
                                Company profile
                            </h2>

                            {company ? (
                                <div className="mt-4 space-y-3 text-xs">
                                    <div>
                                        <p className="text-zinc-500">Company</p>
                                        <p className="mt-0.5 font-medium text-zinc-200">
                                            {companyName}
                                        </p>
                                    </div>

                                    {company.industry && (
                                        <div>
                                            <p className="text-zinc-500">
                                                Industry
                                            </p>
                                            <p className="mt-0.5 font-medium text-zinc-200">
                                                {company.industry}
                                            </p>
                                        </div>
                                    )}

                                    {company.location && (
                                        <div>
                                            <p className="text-zinc-500">
                                                Location
                                            </p>
                                            <p className="mt-0.5 flex items-center gap-1.5 font-medium text-zinc-200">
                                                <LocationArrow
                                                    size={12}
                                                    aria-hidden="true"
                                                    className="text-zinc-500"
                                                />
                                                {company.location}
                                            </p>
                                        </div>
                                    )}

                                    {company.website && (
                                        <div>
                                            <p className="text-zinc-500">
                                                Website
                                            </p>
                                            <a
                                                href={
                                                    company.website.startsWith(
                                                        "http"
                                                    )
                                                        ? company.website
                                                        : `https://${company.website}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-0.5 flex items-center gap-1.5 font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                                            >
                                                <Globe
                                                    size={12}
                                                    aria-hidden="true"
                                                />
                                                {company.website}
                                            </a>
                                        </div>
                                    )}

                                    <Link
                                        href="/dashboard/recruiter/my-company"
                                        className={`${buttonStyles.secondary} mt-2 w-full`}
                                    >
                                        Manage company
                                        <ArrowRight
                                            size={14}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-4 text-center">
                                    <p className="text-xs leading-relaxed text-zinc-400">
                                        You have not registered a company yet.
                                    </p>

                                    <Link
                                        href="/dashboard/recruiter/my-company"
                                        className={`${buttonStyles.primary} mt-4 w-full`}
                                    >
                                        Register company
                                    </Link>
                                </div>
                            )}
                        </SurfaceCard>

                        {/* Quick actions */}
                        <SurfaceCard className="p-3">
                            <ul>
                                {quickActions.map(
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
