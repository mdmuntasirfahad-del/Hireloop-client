import Link from "next/link";
import {
    ArrowRight,
    Envelope,
    Person,
    ShieldCheck,
} from "@gravity-ui/icons";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@heroui/react";
import AdminProfileForm from "@/components/admin/AdminProfileForm";
import SignOutButton from "@/components/dashboard/SignOutButton";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { formatDate } from "@/lib/admin/format";
import { getUserSessionRole } from "@/lib/core/session";

export const metadata = {
    title: "Settings",
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

export default async function AdminSettingsPage() {
    const user = await getUserSessionRole("admin");

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="HIRELOOP ADMIN"
                title="Admin settings"
                description="Manage your administrator profile and review your account access."
                actions={
                    <Link
                        href="/dashboard/admin/logout"
                        className={buttonStyles.secondary}
                    >
                        Sign out
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                }
            />

            <div className="mt-8 max-w-5xl space-y-6">
                <SurfaceCard className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center md:p-8">
                    <AvatarRoot
                        size="lg"
                        className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04]"
                    >
                        <AvatarImage
                            src={user?.image || "/images/profile.jpg"}
                            alt={user?.name || "Administrator"}
                        />
                        <AvatarFallback className="text-xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </AvatarFallback>
                    </AvatarRoot>

                    <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                                {user?.name || "Administrator"}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-fuchsia-300">
                                <ShieldCheck size={11} aria-hidden="true" />
                                Administrator
                            </span>
                        </div>

                        <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Envelope size={13} aria-hidden="true" />
                            {user?.email || "—"}
                        </p>

                        <p className="flex items-center gap-1 pt-1 text-[11px] text-zinc-500">
                            <ShieldCheck
                                size={12}
                                aria-hidden="true"
                                className="text-emerald-400"
                            />
                            Full platform access · Member since{" "}
                            {formatDate(user?.createdAt)}
                        </p>
                    </div>
                </SurfaceCard>

                <SurfaceCard className="p-6 md:p-8">
                    <div className="border-b border-white/[0.06] pb-4">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                            <Person
                                size={18}
                                aria-hidden="true"
                                className="text-indigo-400"
                            />
                            Edit profile
                        </h2>
                        <p className="mt-1 text-xs text-zinc-400">
                            Update the name and phone number shown on your
                            administrator account.
                        </p>
                    </div>

                    <div className="mt-6">
                        <AdminProfileForm
                            name={user?.name || ""}
                            phoneNumber={user?.phoneNumber || ""}
                        />
                    </div>
                </SurfaceCard>

                <SurfaceCard className="p-6 md:p-8">
                    <div className="border-b border-white/[0.06] pb-4">
                        <h2 className="text-base font-semibold text-white">
                            Account details
                        </h2>
                        <p className="mt-1 text-xs text-zinc-400">
                            Your registered administrator information.
                        </p>
                    </div>

                    <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Detail label="Full name" value={user?.name} />
                        <Detail label="Email address" value={user?.email} />
                        <Detail
                            label="Phone number"
                            value={user?.phoneNumber}
                        />
                        <Detail label="Account role" value="Administrator" />
                        <Detail
                            label="Email verified"
                            value={user?.emailVerified ? "Yes" : "No"}
                        />
                        <Detail
                            label="Member since"
                            value={formatDate(user?.createdAt)}
                        />
                        <Detail label="Account ID" value={user?.id} mono />
                    </dl>
                </SurfaceCard>

                <SurfaceCard className="border-red-500/10 p-6 md:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-white">
                                Sign out
                            </h2>
                            <p className="mt-1 text-xs text-zinc-400">
                                End this administrator session on this device.
                            </p>
                        </div>

                        <SignOutButton />
                    </div>
                </SurfaceCard>
            </div>
        </Container>
    );
}
