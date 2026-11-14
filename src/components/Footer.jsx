import Link from "next/link";
import Logo from "./Logo";
import Container from "./ui/Container";

const footerColumns = [
    {
        title: "Product",
        links: [
            { name: "Browse Jobs", href: "/jobs" },
            { name: "Pricing", href: "/plans" },
            { name: "Create Account", href: "/auth/signup" },
        ],
    },
    {
        title: "Account",
        links: [
            { name: "Sign In", href: "/auth/signin" },
            { name: "Dashboard", href: "/dashboard" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#050505] text-white">
            {/* Decorative background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-20"
                aria-hidden="true"
            >
                <div className="absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: "48px 48px",
                        maskImage:
                            "radial-gradient(ellipse at top, black 0%, transparent 70%)",
                        WebkitMaskImage:
                            "radial-gradient(ellipse at top, black 0%, transparent 70%)",
                    }}
                />
            </div>

            <Container className="relative py-14">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr]">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <Link
                            href="/"
                            aria-label="HireLoop home"
                            className="inline-block"
                        >
                            <Logo />
                        </Link>

                        <p className="mt-5 text-sm leading-6 text-zinc-500">
                            The AI-native career platform built for people who
                            take their careers seriously.
                        </p>
                    </div>

                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                {column.title}
                            </h2>

                            <ul className="mt-4 space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-zinc-400 transition-colors hover:text-white"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} HireLoop. All rights
                        reserved.
                    </p>

                    <p>Built for seekers and recruiters.</p>
                </div>
            </Container>
        </footer>
    );
}
