import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CreditCard } from "@gravity-ui/icons";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getApplicationsByApplicant } from "@/lib/api/applications";
import { getPlanById } from "@/lib/api/plans";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "Billing",
    robots: { index: false, follow: false },
};

const isThisMonth = (value) => {
    if (!value) return false;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    const now = new Date();

    return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
};

export default async function SeekerBillingPage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/seeker/billing");
    }

    let plan = null;

    try {
        plan = await getPlanById(user.plan || "seeker_free");
    } catch (error) {
        console.error("Failed to load plan:", error);
    }

    let applications = [];

    try {
        const result = await getApplicationsByApplicant(user.id);
        applications = Array.isArray(result) ? result : [];
    } catch (error) {
        console.error("Failed to load applications:", error);
    }

    const planName = plan?.name || "Free";
    const limit = Number(plan?.maxApplicationsPerMonth) || 3;
    const used = applications.filter((application) =>
        isThisMonth(application.appliedAt || application.createdAt)
    ).length;
    const usagePercent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
    const remaining = Math.max(limit - used, 0);
    const isFreePlan = !user.plan || user.plan.endsWith("_free");

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Billing"
                title="Plan and usage"
                description="Manage your HireLoop plan and keep track of your monthly application allowance."
                actions={
                    <Link href="/plans" className={buttonStyles.primary}>
                        View plans
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                }
            />

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Current plan */}
                <SurfaceCard className="p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                                <CreditCard size={20} aria-hidden="true" />
                            </span>

                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                                    Current plan
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                                    {planName}
                                </h2>
                            </div>
                        </div>

                        <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${
                                isFreePlan
                                    ? "border-white/10 bg-white/[0.04] text-zinc-400"
                                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            }`}
                        >
                            {isFreePlan ? "Free" : "Active"}
                        </span>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                        You can apply to up to{" "}
                        <span className="font-medium text-white">{limit}</span>{" "}
                        jobs per month on the {planName} plan.
                    </p>

                    <div className="mt-6 border-t border-white/[0.06] pt-5">
                        <Link
                            href="/plans"
                            className={`${buttonStyles.secondary} w-full`}
                        >
                            Compare plans
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </SurfaceCard>

                {/* Usage */}
                <SurfaceCard className="p-6 md:p-7">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                        Monthly applications
                    </p>

                    <div className="mt-2 flex items-end justify-between gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {used}
                            <span className="text-sm font-medium text-zinc-500">
                                {" "}
                                / {limit}
                            </span>
                        </h2>
                        <span className="text-xs text-zinc-400">
                            {remaining} remaining
                        </span>
                    </div>

                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            style={{ width: `${usagePercent}%` }}
                        />
                    </div>

                    <p className="mt-3 text-xs text-zinc-500">
                        {used} of {limit} applications used this month.
                    </p>

                    <div className="mt-6 flex items-center gap-2 border-t border-white/[0.06] pt-5 text-[11px] text-zinc-500">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                remaining > 0 ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                            aria-hidden="true"
                        />
                        {remaining > 0
                            ? "Your plan is active and ready for new applications."
                            : "You have reached your monthly limit. Upgrade to keep applying."}
                    </div>
                </SurfaceCard>
            </div>
        </Container>
    );
}
