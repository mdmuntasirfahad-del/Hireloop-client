"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock } from "@gravity-ui/icons";
import JobApply from "./JobApply";
import Container from "@/components/ui/Container";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function ApplyPanel({
    user,
    job,
    initialCount = 0,
    maxApplications = 0,
}) {
    const [count, setCount] = useState(initialCount);

    const usagePercent =
        maxApplications > 0
            ? Math.min((count / maxApplications) * 100, 100)
            : 0;
    const canApply = maxApplications > 0 && count < maxApplications;
    const remaining = Math.max(maxApplications - count, 0);
    const jobHref = `/jobs/${job?._id || job?.id}`;

    return (
        <Container className="py-10 md:py-14">
            <div className="mx-auto max-w-3xl space-y-6">
                <Link
                    href={jobHref}
                    className="inline-flex items-center gap-2 rounded-md text-xs font-medium text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to job details
                </Link>

                {/* Monthly application tracker */}
                <SurfaceCard
                    className={`p-5 ${
                        !canApply ? "border-amber-500/20" : ""
                    }`}
                >
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Hi {user.name},
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-400">
                                Track your monthly job applications
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-200">
                            {maxApplications > 0
                                ? `${count} / ${maxApplications}`
                                : "—"}
                        </span>
                    </div>

                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePercent}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                    </div>

                    <p className="mt-2 text-[11px] text-zinc-500">
                        {maxApplications > 0
                            ? canApply
                                ? `${remaining} application${
                                      remaining === 1 ? "" : "s"
                                  } remaining this month.`
                                : "You've reached your monthly application limit."
                            : "We couldn't load your plan limits right now."}
                    </p>
                </SurfaceCard>

                {canApply ? (
                    <JobApply
                        applicant={user}
                        job={job}
                        onSubmitted={() => setCount((previous) => previous + 1)}
                    />
                ) : (
                    <SurfaceCard className="mx-auto max-w-2xl p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">
                            <Lock size={26} aria-hidden="true" />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
                            {maxApplications > 0
                                ? "Monthly limit reached"
                                : "Application limit unavailable"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
                            {maxApplications > 0
                                ? `You've used all ${maxApplications} applications on your current plan this month. Upgrade your plan to keep applying.`
                                : "We couldn't load your plan details. Refresh the page or review the available plans to continue."}
                        </p>

                        <Link
                            href="/plans"
                            className={`${buttonStyles.primary} mt-6`}
                        >
                            View plans
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </SurfaceCard>
                )}
            </div>
        </Container>
    );
}
