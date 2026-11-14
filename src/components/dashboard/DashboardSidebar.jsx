import Link from "next/link";
import {
    AvatarRoot,
    AvatarImage,
    AvatarFallback,
    Button,
    DrawerRoot,
    DrawerBackdrop,
    DrawerContent,
    DrawerDialog,
    DrawerHeader,
    DrawerHeading,
    DrawerBody,
    DrawerCloseTrigger,
} from "@heroui/react";
import {
    ArrowUpRightFromSquare,
    CrownDiamond,
    LayoutSideContent,
    ShieldCheck,
} from "@gravity-ui/icons";
import Logo from "@/components/Logo";
import { getUserSession } from "@/lib/core/session";
import SidebarNav from "./SidebarNav";

const planLabels = {
    seeker_free: "Free plan",
    seeker_pro: "Pro plan",
    seeker_premium: "Premium plan",
    recruiter_free: "Free plan",
    recruiter_growth: "Growth plan",
    recruiter_enterprise: "Enterprise plan",
};

const roleLabels = {
    seeker: "Job seeker",
    recruiter: "Recruiter",
    admin: "Administrator",
};

function getPlanMeta(plan) {
    const label = planLabels[plan] || "Free plan";
    const isPaid = Boolean(plan && !plan.endsWith("_free"));

    return { label, isPaid };
}

function ProfileCard({ user }) {
    const { label, isPaid } = getPlanMeta(user?.plan);
    const isAdmin = user?.role === "admin";

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
                <AvatarRoot
                    size="md"
                    className="h-10 w-10 shrink-0 border border-white/10"
                >
                    <AvatarImage
                        src={user?.image || "/images/profile.jpg"}
                        alt={user?.name || "User"}
                    />

                    <AvatarFallback>
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                </AvatarRoot>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                        {user?.name || user?.email || "HireLoop user"}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                        {roleLabels[user?.role] || "Member"}
                    </p>
                </div>
            </div>

            <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    isAdmin
                        ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-300"
                        : isPaid
                          ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-300"
                          : "border-white/10 bg-white/[0.04] text-zinc-400"
                }`}
            >
                {isAdmin ? (
                    <ShieldCheck size={12} aria-hidden="true" />
                ) : (
                    isPaid && <CrownDiamond size={12} aria-hidden="true" />
                )}
                {isAdmin ? "Administrator" : label}
            </span>
        </div>
    );
}

function SidebarFooter() {
    return (
        <div className="border-t border-white/[0.06] pt-4">
            <Link
                href="/jobs"
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            >
                Browse job board
                <ArrowUpRightFromSquare size={14} aria-hidden="true" />
            </Link>
        </div>
    );
}

export default async function DashboardSidebar() {
    const user = await getUserSession();

    return (
        <>
            {/* Mobile top bar */}
            <div className="sticky top-[72px] z-40 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-black/80 px-4 py-3 backdrop-blur-xl lg:hidden">
                <Link
                    href="/"
                    aria-label="HireLoop home"
                    className="shrink-0"
                >
                    <Logo />
                </Link>

                <DrawerRoot>
                    <Button
                        variant="secondary"
                        className="h-9 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-zinc-200"
                    >
                        <LayoutSideContent size={16} aria-hidden="true" />
                        Menu
                    </Button>

                    <DrawerBackdrop>
                        <DrawerContent
                            placement="left"
                            className="w-[300px] border-r border-white/10 bg-[#0d0d0f] text-white"
                        >
                            <DrawerDialog>
                                <DrawerCloseTrigger />

                                <DrawerHeader>
                                    <DrawerHeading>
                                        <Logo />
                                    </DrawerHeading>
                                </DrawerHeader>

                                <DrawerBody>
                                    <ProfileCard user={user} />

                                    <div className="mt-6">
                                        <SidebarNav role={user?.role} />
                                    </div>

                                    <div className="mt-6">
                                        <SidebarFooter />
                                    </div>
                                </DrawerBody>
                            </DrawerDialog>
                        </DrawerContent>
                    </DrawerBackdrop>
                </DrawerRoot>
            </div>

            {/* Desktop sidebar */}
            <aside className="fixed bottom-0 left-0 top-[72px] z-30 hidden w-[272px] flex-col border-r border-white/[0.06] bg-[#0d0d0f] px-4 py-6 lg:flex">
                <Link
                    href="/"
                    aria-label="HireLoop home"
                    className="px-2"
                >
                    <Logo />
                </Link>

                <div className="mt-7">
                    <ProfileCard user={user} />
                </div>

                <div className="mt-6 flex-1 overflow-y-auto pr-1">
                    <SidebarNav role={user?.role} />
                </div>

                <div className="mt-4">
                    <SidebarFooter />
                </div>
            </aside>
        </>
    );
}
