"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    Check,
    Person,
    Briefcase,
    ShieldCheck,
    ArrowRight,
} from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

const seekerPlans = [
    {
        name: "Free",
        id: "seeker_free",
        price: "$0",
        period: "/forever",
        description: "Essential tools to get started with your job search.",
        features: [
            "Browse & save up to 10 jobs",
            "Apply to up to 3 jobs per month",
            "Basic profile builder",
            "Email job alerts",
        ],
        popular: false,
        buttonText: "Get started free",
    },
    {
        name: "Pro",
        id: "seeker_pro",
        price: "$19",
        period: "/month",
        description:
            "For active job seekers looking for accelerated hiring.",
        features: [
            "Apply to up to 30 jobs per month",
            "Unlimited saved jobs",
            "Application status tracking",
            "Salary insights & benchmarks",
        ],
        popular: true,
        buttonText: "Upgrade to Pro",
    },
    {
        name: "Premium",
        id: "seeker_premium",
        price: "$39",
        period: "/month",
        description:
            "Maximum visibility and priority treatment for top talent.",
        features: [
            "Everything in Pro",
            "Unlimited job applications",
            "Profile boost to recruiters",
            "Early access to new job postings",
            "24/7 priority customer support",
        ],
        popular: false,
        buttonText: "Get Premium access",
    },
];

const recruiterPlans = [
    {
        name: "Free",
        id: "recruiter_free",
        price: "$0",
        period: "/forever",
        description: "Great for a company's initial hiring needs.",
        features: [
            "Up to 3 active job posts",
            "Basic applicant management",
            "Standard listing visibility",
            "Standard company profile",
        ],
        popular: false,
        buttonText: "Post a job free",
    },
    {
        name: "Growth",
        id: "recruiter_growth",
        price: "$49",
        period: "/month",
        description: "Ideal for growing teams with regular hiring needs.",
        features: [
            "Up to 10 active job posts",
            "Full applicant tracking pipeline",
            "Basic candidate analytics",
            "Dedicated email support",
        ],
        popular: true,
        buttonText: "Start Growth plan",
    },
    {
        name: "Enterprise",
        id: "recruiter_enterprise",
        price: "$149",
        period: "/month",
        description:
            "For scaling organizations requiring maximum hiring volume.",
        features: [
            "Up to 50 active job posts",
            "Advanced analytics dashboard",
            "Featured job listings boost",
            "Team collaboration tools",
            "Custom company branding",
            "Priority VIP support",
        ],
        popular: false,
        buttonText: "Scale with Enterprise",
    },
];

const roleTabs = [
    { id: "seekers", label: "For job seekers", icon: Person },
    { id: "recruiters", label: "For recruiters", icon: Briefcase },
];

export default function PlanComponent() {
    const [userRoleTab, setUserRoleTab] = useState("seekers");
    const { data: session } = useSession();
    const shouldReduceMotion = useReducedMotion();

    const user = session?.user;
    const currentPlans =
        userRoleTab === "seekers" ? seekerPlans : recruiterPlans;

    const renderCta = (plan) => {
        const ctaClass = `${
            plan.popular ? buttonStyles.primary : buttonStyles.secondary
        } w-full`;

        if (plan.price === "$0" || !user) {
            const href = user
                ? "/dashboard"
                : "/auth/signin?redirect=/plans";

            return (
                <Link href={href} className={ctaClass}>
                    {plan.buttonText}
                    <ArrowRight size={16} aria-hidden="true" />
                </Link>
            );
        }

        return (
            <form action="/api/checkout_sessions" method="POST">
                <input type="hidden" name="plan_id" value={plan.id} />
                <button type="submit" className={ctaClass}>
                    {plan.buttonText}
                    <ArrowRight size={16} aria-hidden="true" />
                </button>
            </form>
        );
    };

    return (
        <div className="relative overflow-hidden">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_70%)]"
            />

            <Container className="py-12 md:py-16">
                <div className="space-y-10">
                    <PageHeader
                        align="center"
                        eyebrow="Pricing"
                        title="Simple, transparent pricing"
                        description="Choose the plan that fits your career goals or hiring needs. Upgrade or cancel anytime."
                    />

                    {/* Audience toggle */}
                    <div className="flex justify-center">
                        <div
                            role="tablist"
                            aria-label="Choose plan audience"
                            className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5"
                        >
                            {roleTabs.map(({ id, label, icon: Icon }) => {
                                const isActive = userRoleTab === id;

                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setUserRoleTab(id)}
                                        className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 ${
                                            isActive
                                                ? "text-zinc-950"
                                                : "text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="activeRoleTab"
                                                className="absolute inset-0 rounded-xl bg-white"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Icon
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Plan cards */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={userRoleTab}
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : { opacity: 0, y: 16 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            exit={
                                shouldReduceMotion
                                    ? { opacity: 1 }
                                    : { opacity: 0, y: -16 }
                            }
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.25,
                                ease: "easeOut",
                            }}
                            className="grid grid-cols-1 items-stretch gap-6 pt-2 md:grid-cols-3"
                        >
                            {currentPlans.map((plan, index) => (
                                <motion.div
                                    key={plan.id}
                                    initial={
                                        shouldReduceMotion
                                            ? false
                                            : { opacity: 0, y: 20 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: shouldReduceMotion ? 0 : 0.3,
                                        delay: shouldReduceMotion
                                            ? 0
                                            : index * 0.06,
                                        ease: "easeOut",
                                    }}
                                    className="h-full"
                                >
                                    <SurfaceCard
                                        className={`relative flex h-full flex-col p-6 md:p-7 ${
                                            plan.popular
                                                ? "border-indigo-500/50 ring-1 ring-indigo-500/30"
                                                : ""
                                        }`}
                                    >
                                        {plan.popular && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-indigo-400/30 bg-indigo-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-indigo-950/40">
                                                Most popular
                                            </span>
                                        )}

                                        <div>
                                            <h2 className="text-lg font-semibold text-white">
                                                {plan.name}
                                            </h2>

                                            <p className="mt-2 min-h-[36px] text-xs leading-relaxed text-zinc-400">
                                                {plan.description}
                                            </p>

                                            <div className="mt-5 flex items-baseline gap-1">
                                                <span className="text-4xl font-semibold tracking-tight text-white">
                                                    {plan.price}
                                                </span>
                                                <span className="text-xs font-medium text-zinc-500">
                                                    {plan.period}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex-1 border-t border-white/[0.08] pt-6">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                                                What&apos;s included
                                            </p>

                                            <ul className="mt-4 space-y-3">
                                                {plan.features.map(
                                                    (feature) => (
                                                        <li
                                                            key={feature}
                                                            className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-300"
                                                        >
                                                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                                                                <Check
                                                                    size={10}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                            {feature}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        <div className="mt-8">
                                            {renderCta(plan)}
                                        </div>
                                    </SurfaceCard>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex flex-col items-center justify-center gap-3 border-t border-white/[0.06] pt-8 text-xs text-zinc-500 md:flex-row md:gap-6">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck
                                size={15}
                                className="text-indigo-400"
                                aria-hidden="true"
                            />
                            Cancel or switch plans anytime
                        </span>

                        <span
                            className="hidden h-1 w-1 rounded-full bg-zinc-700 md:inline-block"
                            aria-hidden="true"
                        />

                        <span>No hidden fees or setup charges</span>

                        <span
                            className="hidden h-1 w-1 rounded-full bg-zinc-700 md:inline-block"
                            aria-hidden="true"
                        />

                        <span>
                            Need a custom plan?{" "}
                            <a
                                href="mailto:sales@hireloop.com"
                                className="text-indigo-300 underline-offset-4 transition-colors hover:text-indigo-200 hover:underline"
                            >
                                Contact sales
                            </a>
                        </span>
                    </div>
                </div>
            </Container>
        </div>
    );
}
