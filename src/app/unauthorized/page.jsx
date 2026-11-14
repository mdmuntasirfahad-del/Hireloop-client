import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    LifeRing,
    Lock,
    ShieldExclamation,
} from "@gravity-ui/icons";

export const metadata = {
    title: "Unauthorized",
    description: "You do not have permission to access this page.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function UnauthorizedPage() {
    return (
        <section className="relative isolate flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden bg-[#08080a] px-4 py-16 sm:px-6 md:py-24">
            {/* Decorative background */}
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
            >
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
                        `,
                        backgroundSize: "56px 56px",
                        maskImage:
                            "radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 100%)",
                        WebkitMaskImage:
                            "radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 100%)",
                    }}
                />

                <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-[120px]" />

                <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/[0.08] blur-[110px]" />

                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#08080a] to-transparent" />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08080a] to-transparent" />
            </div>

            <div className="relative w-full max-w-2xl">
                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#101013]/90 p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-10 md:p-12">
                    {/* Top hairline */}
                    <div
                        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        aria-hidden="true"
                    />

                    {/* Header row */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-zinc-300">
                            <Lock size={12} className="text-indigo-300" />
                            Security notice
                        </span>

                        <span className="rounded-md border border-red-500/20 bg-red-500/[0.07] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-red-300/90">
                            403 · Unauthorized
                        </span>
                    </div>

                    {/* Hero */}
                    <div className="relative mt-10 flex flex-col items-center text-center">
                        <span
                            className="pointer-events-none absolute -top-10 select-none text-[150px] font-black leading-none tracking-tighter text-white/[0.025] sm:text-[180px]"
                            aria-hidden="true"
                        >
                            403
                        </span>

                        <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-red-500/25 bg-gradient-to-b from-red-500/15 to-red-500/[0.03] text-red-300 shadow-[0_0_60px_-12px_rgba(239,68,68,0.45)] ring-1 ring-inset ring-white/10">
                            <ShieldExclamation size={34} />
                            <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-red-500/30 bg-[#101013]">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            </span>
                        </div>

                        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                            Access denied
                        </h1>

                        <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400 sm:text-[15px]">
                            Your account doesn&apos;t have the permission
                            required to view this page. If you believe this is
                            a mistake, try signing in with a different account
                            or contact support.
                        </p>

                        {/* Actions */}
                        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/20 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101013]"
                            >
                                Go to Dashboard
                                <ArrowRight size={16} />
                            </Link>

                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101013]"
                            >
                                <ArrowLeft size={16} className="text-zinc-400" />
                                Back to Home
                            </Link>
                        </div>

                        <Link
                            href="/auth/signin"
                            className="mt-5 text-xs font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101013]"
                        >
                            Sign in with a different account
                        </Link>
                    </div>

                    {/* Support strip */}
                    <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-[11px] sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                        >
                            <LifeRing size={13} className="text-indigo-300" />
                            Need help?{" "}
                            <span className="font-medium text-zinc-200">
                                Contact support
                            </span>
                        </Link>

                        <span className="font-mono uppercase tracking-[0.18em] text-zinc-600">
                            REF: AUTH_403
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
