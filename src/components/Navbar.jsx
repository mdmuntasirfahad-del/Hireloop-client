"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import Container from "./ui/Container";
import { signOut, useSession } from "@/lib/auth-client";

const navLinks = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Browse Jobs",
        href: "/jobs",
    },
    {
        name: "Pricing",
        href: "/plans",
    },
];

const dashboardLinks = {
    seeker: "/dashboard/seeker",
    recruiter: "/dashboard/recruiter",
    admin: "/dashboard/admin",
};

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, refetch } = useSession();
    const user = session?.user;
    const router = useRouter();
    const pathname = usePathname();

    const links = user?.email
        ? [
              ...navLinks,
              {
                  name: "Dashboard",
                  href: dashboardLinks[user.role] || "/dashboard/seeker",
              },
          ]
        : navLinks;

    const isActive = (href) =>
        pathname === href ||
        (href !== "/" && pathname.startsWith(`${href}/`));

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/signin");
                    router.refresh();
                },
            },
        });
        refetch();
    };

    return (
        <nav
            aria-label="Main navigation"
            className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black/80 backdrop-blur-xl"
        >
            <Container>
                <header className="flex h-[72px] items-center justify-between gap-6">
                    <Link
                        href="/"
                        aria-label="HireLoop home"
                        className="shrink-0"
                    >
                        <Logo />
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        <ul className="flex items-center gap-1">
                            {links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        aria-current={
                                            isActive(link.href)
                                                ? "page"
                                                : undefined
                                        }
                                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive(link.href)
                                                ? "bg-white/[0.06] text-white"
                                                : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <span
                            className="h-6 w-px bg-white/10"
                            aria-hidden="true"
                        />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="max-w-[180px] truncate text-sm text-zinc-400">
                                    {user.name || user.email}
                                </span>

                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/signin"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/auth/signup"
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </header>
            </Container>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div
                    id="mobile-menu"
                    className="border-t border-white/[0.06] bg-[#0b0b0d] md:hidden"
                >
                    <Container className="py-4">
                        <ul className="space-y-1">
                            {links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        aria-current={
                                            isActive(link.href)
                                                ? "page"
                                                : undefined
                                        }
                                        className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                            isActive(link.href)
                                                ? "bg-white/[0.06] text-white"
                                                : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}

                            <li
                                aria-hidden="true"
                                className="my-3 h-px bg-white/10"
                            />

                            {user ? (
                                <>
                                    <li className="px-4 py-1 text-xs text-zinc-500">
                                        Signed in as{" "}
                                        <span className="text-zinc-300">
                                            {user.name || user.email}
                                        </span>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                setIsMenuOpen(false);
                                                await handleSignOut();
                                            }}
                                            className="block w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href="/auth/signin"
                                            onClick={() =>
                                                setIsMenuOpen(false)
                                            }
                                            className="block rounded-xl px-4 py-3 text-sm font-medium text-indigo-300 transition-colors hover:bg-white/[0.05]"
                                        >
                                            Sign In
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/auth/signup"
                                            onClick={() =>
                                                setIsMenuOpen(false)
                                            }
                                            className="mt-1 block rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
                                        >
                                            Get Started
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </Container>
                </div>
            )}
        </nav>
    );
}
