"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, Label, InputGroup } from "@heroui/react";
import {
    Person,
    Handset,
    At,
    Lock,
    Eye,
    EyeSlash,
    CircleCheckFill,
    TriangleExclamationFill,
    ShieldCheck,
    Briefcase,
} from "@gravity-ui/icons";
import { signUp } from "@/lib/auth-client";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

const inputGroupClass =
    "mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f0f11] px-3 py-2.5 transition-colors focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-500/20";

const inputClass =
    "w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600";

const roleOptions = [
    {
        value: "seeker",
        title: "Job seeker",
        description: "Find and apply to roles",
        icon: Person,
    },
    {
        value: "recruiter",
        title: "Recruiter",
        description: "Post jobs and hire talent",
        icon: Briefcase,
    },
];

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: "seeker",
        plan: "seeker_free",
    });

    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const toggleVisibility = () => setIsVisible((visible) => !visible);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleRoleChange = (role) => {
        setFormData((previous) => ({
            ...previous,
            role,
            plan: role === "seeker" ? "seeker_free" : "recruiter_free",
        }));
    };

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => router.replace(redirectTo), 1200);
        return () => clearTimeout(timer);
    }, [success, router, redirectTo]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const { error: authError } = await signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                role: formData.role,
                plan: formData.plan,
            });

            if (authError) {
                setError(
                    authError.message ||
                        "Something went wrong during sign up."
                );
            } else {
                setSuccess("Account created successfully. Redirecting...");
                setFormData({
                    name: "",
                    phoneNumber: "",
                    email: "",
                    password: "",
                    role: "seeker",
                    plan: "seeker_free",
                });
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
                    Get started
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Create your account
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Join HireLoop to find your next role or hire your next
                    teammate.
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
                            Full name
                        </Label>
                        <InputGroup className={inputGroupClass}>
                            <InputGroup.Prefix>
                                <Person
                                    size={16}
                                    className="pointer-events-none text-zinc-500"
                                    aria-hidden="true"
                                />
                            </InputGroup.Prefix>
                            <InputGroup.Input
                                type="text"
                                name="name"
                                autoComplete="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </InputGroup>
                    </TextField>

                    <TextField isRequired fullWidth>
                        <Label className="text-xs font-medium text-zinc-300">
                            Phone number
                        </Label>
                        <InputGroup className={inputGroupClass}>
                            <InputGroup.Prefix>
                                <Handset
                                    size={16}
                                    className="pointer-events-none text-zinc-500"
                                    aria-hidden="true"
                                />
                            </InputGroup.Prefix>
                            <InputGroup.Input
                                type="tel"
                                name="phoneNumber"
                                autoComplete="tel"
                                inputMode="tel"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </InputGroup>
                    </TextField>

                    <div>
                        <p className="text-xs font-medium text-zinc-300">
                            I&apos;m joining as
                        </p>

                        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {roleOptions.map(
                                ({ value, title, description, icon: Icon }) => {
                                    const isActive = formData.role === value;

                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                handleRoleChange(value)
                                            }
                                            aria-pressed={isActive}
                                            className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 ${
                                                isActive
                                                    ? "border-indigo-400/60 bg-indigo-500/10"
                                                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                                            }`}
                                        >
                                            <span
                                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                                                    isActive
                                                        ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                                                        : "border-white/10 bg-white/[0.04] text-zinc-500"
                                                }`}
                                            >
                                                <Icon
                                                    size={14}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <span className="min-w-0">
                                                <span className="block text-xs font-semibold text-white">
                                                    {title}
                                                </span>
                                                <span className="mt-0.5 block text-[11px] text-zinc-500">
                                                    {description}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    <TextField isRequired fullWidth>
                        <Label className="text-xs font-medium text-zinc-300">
                            Email address
                        </Label>
                        <InputGroup className={inputGroupClass}>
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
                                className={inputClass}
                            />
                        </InputGroup>
                    </TextField>

                    <TextField isRequired fullWidth>
                        <Label className="text-xs font-medium text-zinc-300">
                            Password
                        </Label>
                        <InputGroup className={inputGroupClass}>
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
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className={inputClass}
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
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>
            </div>

            <div className="mt-6 border-t border-white/[0.06] pt-5 text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link
                    href={`/auth/signin?redirect=${encodeURIComponent(
                        redirectTo
                    )}`}
                    className="font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                >
                    Sign in
                </Link>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
                <ShieldCheck size={13} aria-hidden="true" />
                Your information is kept private and secure
            </p>
        </SurfaceCard>
    );
}
