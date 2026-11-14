"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    CircleCheckFill,
    StarFill,
    ArrowRight,
    Envelope,
    ShieldCheck,
    Rocket,
} from "@gravity-ui/icons";

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SuccessClient({
    customerEmail,
    planName,
    amountTotal,
    currency,
    interval,
}) {
    const formattedAmount =
        amountTotal != null
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: (currency || "usd").toUpperCase(),
            }).format(amountTotal / 100)
            : null;

    const billingLabel =
        interval === "month" ? "Billed monthly" : interval === "year" ? "Billed yearly" : "One-time payment";

    const rows = [
        { label: "Plan", value: planName },
        { label: "Billing", value: billingLabel },
        ...(formattedAmount ? [{ label: "Amount paid", value: formattedAmount }] : []),
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12 md:py-20 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 rounded-full bg-emerald-700/10 blur-[120px]" />

            <div className="max-w-xl w-full text-center space-y-8 relative z-10">

                {/* STATUS BADGE */}
                <motion.span
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                    <StarFill size={12} /> Payment Confirmed
                </motion.span>

                {/* ANIMATED CHECK */}
                <div className="relative flex items-center justify-center h-40">
                    {[0, 1].map((i) => (
                        <motion.span
                            key={i}
                            className="absolute rounded-full border border-emerald-500/30"
                            initial={{ width: 96, height: 96, opacity: 0.55 }}
                            animate={{ width: 260, height: 260, opacity: 0 }}
                            transition={{ duration: 2.4, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }}
                        />
                    ))}
                    <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                        className="relative z-10 w-24 h-24 rounded-full bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-[0_0_70px_-10px_rgba(16,185,129,0.65)]"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                            className="flex"
                        >
                            <CircleCheckFill size={52} />
                        </motion.span>
                    </motion.div>
                </div>

                {/* HEADING */}
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                    <motion.h1
                        variants={item}
                        className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
                    >
                        You&apos;re all set!
                    </motion.h1>
                    <motion.p variants={item} className="text-sm md:text-base text-zinc-400 max-w-md mx-auto">
                        Your subscription is now active. A confirmation and receipt have been sent to your email.
                    </motion.p>
                </motion.div>

                {/* RECEIPT CARD */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-[#141416] border border-zinc-800/80 rounded-[28px] p-6 md:p-7 text-left shadow-2xl space-y-6"
                >
                    <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                                <Rocket size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">{planName}</p>
                                <p className="text-[11px] text-zinc-500">HireLoop Subscription</p>
                            </div>
                        </div>
                        <motion.span
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.4 }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 shrink-0"
                        >
                            <ShieldCheck size={12} /> Active
                        </motion.span>
                    </div>

                    <div className="space-y-3">
                        {rows.map((row) => (
                            <motion.div
                                key={row.label}
                                variants={item}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="text-zinc-500">{row.label}</span>
                                <span className="font-semibold text-zinc-200">{row.value}</span>
                            </motion.div>
                        ))}
                        {customerEmail && (
                            <motion.div variants={item} className="flex items-center justify-between text-xs gap-4">
                                <span className="text-zinc-500 flex items-center gap-1.5 shrink-0">
                                    <Envelope size={12} /> Receipt to
                                </span>
                                <span className="font-semibold text-zinc-200 truncate">{customerEmail}</span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* ACTIONS */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-center gap-2 w-full px-7 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-all shadow-lg"
                        >
                            Go to Dashboard <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                    <motion.div variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                        <Link
                            href="/jobs"
                            className="flex items-center justify-center gap-2 w-full px-7 py-3 rounded-xl bg-zinc-800/90 text-white hover:bg-zinc-700 border border-zinc-700/60 text-xs font-semibold transition-all"
                        >
                            Browse Jobs
                        </Link>
                    </motion.div>
                </motion.div>

                {/* FOOTNOTE */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5"
                >
                    <ShieldCheck size={14} className="text-indigo-400" />
                    Manage or cancel your plan anytime from your dashboard.
                </motion.p>

            </div>
        </div>
    );
}
