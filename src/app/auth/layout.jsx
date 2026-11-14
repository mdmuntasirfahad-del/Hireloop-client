import Link from "next/link";
import Logo from "@/components/Logo";
import {
    CircleCheckFill,
    ShieldCheck,
    Sparkles,
} from "@gravity-ui/icons";

const highlights = [
    {
        icon: Sparkles,
        title: "AI-matched roles",
        description:
            "Get a daily brief of roles that fit your skills, experience, and salary expectations.",
    },
    {
        icon: ShieldCheck,
        title: "Verified employers",
        description:
            "Every company is reviewed before its roles go live on the job board.",
    },
    {
        icon: CircleCheckFill,
        title: "Track every application",
        description:
            "See responses, interviews, and next steps from a single dashboard.",
    },
];

export default function AuthLayout({ children }) {
    return (
        <div className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: "56px 56px",
                        maskImage:
                            "radial-gradient(ellipse at top, black 0%, transparent 70%)",
                        WebkitMaskImage:
                            "radial-gradient(ellipse at top, black 0%, transparent 70%)",
                    }}
                />
            </div>

            <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16 lg:px-8 lg:py-16">
                {/* Brand panel */}
                <section className="hidden lg:block">
                    <Link
                        href="/"
                        aria-label="HireLoop home"
                        className="inline-block"
                    >
                        <Logo />
                    </Link>

                    <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-300">
                        Welcome to HireLoop
                    </p>

                    <h1 className="mt-3 max-w-lg text-balance text-4xl font-medium leading-tight text-white">
                        Where serious careers get matched.
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
                        Build a profile once, get curated roles daily, and keep
                        every application organized from first click to signed
                        offer.
                    </p>

                    <ul className="mt-10 space-y-5">
                        {highlights.map(
                            ({ icon: Icon, title, description }) => (
                                <li key={title} className="flex gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                                        <Icon
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {title}
                                        </p>
                                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                                            {description}
                                        </p>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>

                    <div className="mt-10 max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                        <p className="text-sm leading-relaxed text-zinc-300">
                            &ldquo;I found a role that matched my stack in the
                            first week. The application tracker kept every step
                            in one place.&rdquo;
                        </p>
                        <p className="mt-3 text-xs text-zinc-500">
                            Amina R. &mdash; Product Designer
                        </p>
                    </div>
                </section>

                {/* Form panel */}
                <section className="mx-auto w-full max-w-md lg:max-w-none">
                    {children}
                </section>
            </div>
        </div>
    );
}
