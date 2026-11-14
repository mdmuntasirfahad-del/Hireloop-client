import Link from "next/link";
import { redirect } from "next/navigation";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@heroui/react";
import {
    ArrowRight,
    Envelope,
    Person,
    ShieldCheck,
} from "@gravity-ui/icons";
import SignOutButton from "@/components/dashboard/SignOutButton";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "Settings",
    robots: { index: false, follow: false },
};

const planLabels = {
    seeker_free: "Free",
    seeker_pro: "Pro",
    seeker_premium: "Premium",
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

export default async function SeekerSettingsPage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/seeker/settings");
    }

    const planLabel = planLabels[user?.plan] || user?.plan || "Free";

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Settings"
                title="Account settings"
                description="View your profile information and manage your HireLoop account."
                actions={
                    <Link
                        href="/dashboard/seeker/billing"
                        className={buttonStyles.secondary}
                    >
                        View billing
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                }
            />

            <div className="mt-8 max-w-5xl space-y-6">
                {/* Profile banner */}
                <SurfaceCard className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center md:p-8">
                    <AvatarRoot
                        size="lg"
                        className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04]"
                    >
                        <AvatarImage
                            src={user?.image || "/images/profile.jpg"}
                            alt={user?.name || "Job Seeker"}
                        />
                        <AvatarFallback className="text-xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || "S"}
                        </AvatarFallback>
                    </AvatarRoot>

                    <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                                {user?.name || "Job Seeker"}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                                Job seeker
                            </span>
                        </div>

                        <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Envelope size={13} aria-hidden="true" />
                            {user?.email || "seeker@example.com"}
                        </p>

                        <p className="flex items-center gap-1 pt-1 text-[11px] text-zinc-500">
                            <ShieldCheck
                                size={12}
                                aria-hidden="true"
                                className="text-emerald-400"
                            />
                            Account active · {planLabel} plan
                        </p>
                    </div>
                </SurfaceCard>

                {/* Account details */}
                <SurfaceCard className="p-6 md:p-8">
                    <div className="border-b border-white/[0.06] pb-4">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                            <Person
                                size={18}
                                aria-hidden="true"
                                className="text-indigo-400"
                            />
                            Account details
                        </h2>
                        <p className="mt-1 text-xs text-zinc-400">
                            Your registered profile information stored on
                            HireLoop.
                        </p>
                    </div>

                    <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Detail label="Full name" value={user?.name} />
                        <Detail label="Email address" value={user?.email} />
                        <Detail label="Phone number" value={user?.phoneNumber} />
                        <Detail label="Account role" value="Job seeker" />
                        <Detail label="Current plan" value={planLabel} />
                        <Detail
                            label="Member since"
                            value={formatDate(user?.createdAt)}
                        />
                        <Detail label="Account ID" value={user?.id} mono />
                    </dl>

                    <div className="mt-7 border-t border-white/[0.06] pt-5">
                        <Link
                            href="/dashboard/seeker/billing"
                            className={buttonStyles.secondary}
                        >
                            Manage plan and usage
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>
                </SurfaceCard>

                {/* Sign out */}
                <SurfaceCard className="border-red-500/10 p-6 md:p-8">
                    <h2 className="text-base font-semibold text-white">
                        Sign out
                    </h2>
                    <p className="mt-1 text-xs text-zinc-400">
                        Sign out of your HireLoop account on this device.
                    </p>
                    <div className="mt-5">
                        <SignOutButton />
                    </div>
                </SurfaceCard>
            </div>
        </Container>
    );
}
