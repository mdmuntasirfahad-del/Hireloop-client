"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, Label, InputGroup } from "@heroui/react";
import {
    At,
    Lock,
    Eye,
    EyeSlash,
    CircleCheckFill,
    TriangleExclamationFill,
    ShieldCheck,
} from "@gravity-ui/icons";
import { signIn } from "@/lib/auth-client";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function SignInPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const toggleVisibility = () => setIsVisible((visible) => !visible);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => router.push(redirectTo), 1200);
        return () => clearTimeout(timer);
    }, [success, router, redirectTo]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const { error: authError } = await signIn.email({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                setError(
                    authError.message ||
                        "Something went wrong during sign in."
                );
            } else {
                setSuccess("Signed in successfully. Redirecting...");
                setFormData({ email: "", password: "" });
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SurfaceCard className="w-full p-6 sm:p-8">
            <div className="text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-300">
                    Welcome back
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Sign in to HireLoop
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Continue to your dashboard, saved jobs, and applications.
                </p>
            </div>

            <div className="mt-6 space-y-4">
                {success && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300"
                    >
                        <CircleCheckFill
                            size={16}
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                        />
                        <span>{success}</span>
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300"
                    >
                        <TriangleExclamationFill
                            size={16}
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                        />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField isRequired fullWidth>
                        <Label className="text-xs font-medium text-zinc-300">
                            Email address
                        </Label>
                        <InputGroup className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f0f11] px-3 py-2.5 transition-colors focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-500/20">
                            <InputGroup.Prefix>
                                <At
                                    size={16}
                                    className="pointer-events-none text-zinc-500"
                                    aria-hidden="true"
                                />
                            </InputGroup.Prefix>
                            <InputGroup.Input
                                type="email"
                                name="email"
                                autoComplete="email"
                                spellCheck={false}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                            />
                        </InputGroup>
                    </TextField>

                    <TextField isRequired fullWidth>
                        <Label className="text-xs font-medium text-zinc-300">
                            Password
                        </Label>
                        <InputGroup className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f0f11] px-3 py-2.5 transition-colors focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-500/20">
                            <InputGroup.Prefix>
                                <Lock
                                    size={16}
                                    className="pointer-events-none text-zinc-500"
                                    aria-hidden="true"
                                />
                            </InputGroup.Prefix>
                            <InputGroup.Input
                                type={isVisible ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                            />
                            <InputGroup.Suffix>
                                <button
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label={
                                        isVisible
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    aria-pressed={isVisible}
                                    className="rounded-md p-0.5 text-zinc-500 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                                >
                                    {isVisible ? (
                                        <EyeSlash
                                            size={16}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Eye
                                            size={16}
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </InputGroup.Suffix>
                        </InputGroup>
                    </TextField>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${buttonStyles.primary} mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>

            <div className="mt-6 border-t border-white/[0.06] pt-5 text-center text-sm text-zinc-500">
                Don&apos;t have an account?{" "}
                <Link
                    href={`/auth/signup?redirect=${encodeURIComponent(
                        redirectTo
                    )}`}
                    className="font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                >
                    Create one
                </Link>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
                <ShieldCheck size={13} aria-hidden="true" />
                Secure sign-in for your HireLoop account
            </p>
        </SurfaceCard>
    );
}
